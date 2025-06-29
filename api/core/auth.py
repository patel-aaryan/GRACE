from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError, JWTClaimsError
from typing import Optional, Dict, Any, Generator
from sqlalchemy.orm import Session
from core.config import settings
from database.db import get_db_with_auth, get_service_db
import logging

logger = logging.getLogger(__name__)

# Security scheme for Bearer token
security = HTTPBearer(auto_error=False)


class User:
    """Simplified user model from JWT payload"""

    def __init__(self, payload: Dict[str, Any]):
        self.id: str = payload.get("sub", "")
        self.email: Optional[str] = payload.get("email")
        self.role: str = payload.get("role", "authenticated")
        self.payload = payload


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Verify JWT token and return user information.
    This is the main authentication dependency you should use.
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.ALGORITHM],
            audience="authenticated"
        )

        if not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token"
            )

        return User(payload)

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(current_user: User = Depends(get_current_user)) -> str:
    """Get the current user's ID - convenience function"""
    return current_user.id


# Backwards compatibility aliases
require_user = get_current_user  # Alias for backwards compatibility
JWTTokenPayload = User  # Alias for backwards compatibility


def get_current_user_email(current_user: JWTTokenPayload = Depends(require_user)) -> Optional[str]:
    """Get the current user's email from the JWT token"""
    return current_user.email


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Verify and decode Supabase JWT token.
    Returns the decoded token payload.
    """
    try:
        token = credentials.credentials

        # Decode the JWT token using Supabase JWT secret
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.ALGORITHM],
            audience="authenticated"
        )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


def get_user_id_from_token(token_payload: Dict[str, Any] = Depends(verify_jwt_token)) -> str:
    """
    Extract user ID from verified JWT token.
    """
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )
    return user_id


def get_authenticated_db(
    user_id: str = Depends(get_user_id_from_token)
) -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session with proper RLS context
    for the authenticated user.
    """
    with get_db_with_auth(user_id=user_id, role="authenticated") as db:
        yield db


def get_optional_authenticated_db(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session with optional authentication.
    If no token is provided, uses service role. If token is provided, uses authenticated user context.
    """
    if not credentials:
        # No authentication provided, use service role
        with get_service_db() as db:
            yield db
    else:
        # Verify token and set user context
        try:
            payload = verify_jwt_token(credentials)
            user_id = payload.get("sub")
            if user_id:
                with get_db_with_auth(user_id=user_id, role="authenticated") as db:
                    yield db
            else:
                with get_service_db() as db:
                    yield db
        except HTTPException:
            # Invalid token, use service role for public access
            with get_service_db() as db:
                yield db


def require_service_role(
    token_payload: Dict[str, Any] = Depends(verify_jwt_token)
) -> Dict[str, Any]:
    """
    Require service role access. Use this for admin endpoints.
    """
    role = token_payload.get("role")
    if role != "service_role":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Service role required"
        )
    return token_payload


def get_admin_db(
    token_payload: Dict[str, Any] = Depends(require_service_role)
) -> Generator[Session, None, None]:
    """
    FastAPI dependency for admin operations that bypass RLS.
    """
    with get_service_db() as db:
        yield db


def extract_user_from_request(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    """
    Extract user ID from request without raising exceptions.
    Returns None if no valid token is provided.
    """
    if not credentials:
        return None

    try:
        payload = verify_jwt_token(credentials)
        return payload.get("sub")
    except HTTPException:
        return None


class RLSContext:
    """
    Context manager for manually setting RLS context in database operations.
    """

    def __init__(self, user_id: Optional[str] = None, role: str = "authenticated"):
        self.user_id = user_id
        self.role = role
        self._context_manager = None

    def __enter__(self) -> Session:
        self._context_manager = get_db_with_auth(
            user_id=self.user_id, role=self.role)
        return self._context_manager.__enter__()

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._context_manager:
            return self._context_manager.__exit__(exc_type, exc_val, exc_tb)


# Utility functions for common operations
def check_user_access_to_profile(db: Session, user_id: str, profile_id: str) -> bool:
    """
    Check if a user has access to a specific profile (either own profile or as caregiver).
    """
    from database.models import Profile, Caregiver

    # Check if it's the user's own profile
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        return False

    if str(profile.id) == user_id:
        return True

    # Check if user is a caregiver for this profile
    if profile.caregiver_id is not None:
        caregiver = db.query(Caregiver).filter(
            Caregiver.id == profile.caregiver_id).first()
        if caregiver and str(caregiver.id) == user_id:
            return True

    return False


def get_accessible_profile_ids(db: Session, user_id: str) -> list[str]:
    """
    Get all profile IDs that the current user can access.
    """
    from database.models import Profile, Caregiver

    accessible_ids = []

    # User's own profile
    user_profile = db.query(Profile).filter(Profile.id == user_id).first()
    if user_profile:
        accessible_ids.append(str(user_profile.id))

    # Profiles managed as caregiver
    managed_profiles = db.query(Profile).join(Caregiver).filter(
        Caregiver.id == user_id
    ).all()

    for profile in managed_profiles:
        accessible_ids.append(str(profile.id))

    return list(set(accessible_ids))  # Remove duplicates
