from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from services import AuthService
from schemas import UserLogin, Token, UserResponse, TokenData
from core.config import settings
from jose import JWTError, jwt

# This will be used by the auth_router.py
# We will move the get_current_user, login, refresh, and me logic here.

# Placeholder for get_current_user dependency


class AuthController:
    def __init__(self, db: Session):
        self.auth_service = AuthService(db)
        self.db = db

    async def get_current_user(self, token: str) -> UserResponse:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            raw_email: str | None = payload.get("sub")
            if raw_email is None:
                raise credentials_exception
            email: str = raw_email
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception

        if token_data.email is None:
            raise credentials_exception

        user = self.auth_service.get_user_by_email_service(
            email=token_data.email)
        if user is None:
            raise credentials_exception
        return UserResponse.model_validate(user)

    def login_for_access_token(self, form_data: OAuth2PasswordRequestForm) -> dict:
        user_login = UserLogin(
            email=form_data.username, password=form_data.password)
        return self.auth_service.login_user(user_login)

    def refresh_access_token(self, refresh_token: str) -> dict:
        return self.auth_service.refresh_access_token(refresh_token)

    async def read_users_me(self, current_user: UserResponse) -> UserResponse:
        return current_user
