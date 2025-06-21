from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional, Dict, Any
from core.config import settings

security = HTTPBearer()


class JWTTokenPayload:
    """JWT token payload from Supabase"""

    def __init__(self, payload: Dict[str, Any]):
        self.sub: str = payload.get("sub", "")  # User ID
        self.email: Optional[str] = payload.get("email")
        self.role: Optional[str] = payload.get("role")
        self.aud: Optional[str] = payload.get("aud")
        self.exp: Optional[int] = payload.get("exp")
        self.iat: Optional[int] = payload.get("iat")
        self.raw_payload = payload


def get_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract bearer token from Authorization header"""
    return credentials.credentials


def verify_token(token: str) -> JWTTokenPayload:
    """Verify JWT token using Supabase JWT secret"""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.ALGORITHM],
            audience="authenticated"
        )
        return JWTTokenPayload(payload)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_user(token: str = Depends(get_bearer_token)) -> JWTTokenPayload:
    """Dependency to require authenticated user"""
    return verify_token(token)


def get_current_user_id(current_user: JWTTokenPayload = Depends(require_user)) -> str:
    """Get the current user's ID from the JWT token"""
    if not current_user.sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token"
        )
    return current_user.sub


def get_current_user_email(current_user: JWTTokenPayload = Depends(require_user)) -> Optional[str]:
    """Get the current user's email from the JWT token"""
    return current_user.email
