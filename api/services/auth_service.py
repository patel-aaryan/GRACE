from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from datastores import UserDatastore
from schemas import UserCreate, UserLogin, TokenData, UserResponse
from utils.passwords import verify_password
from core.config import settings


class AuthService:
    def __init__(self, db: Session):
        self.user_datastore = UserDatastore(db)

    def _create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(
                timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def _create_refresh_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(
                timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def register_user(self, user_create: UserCreate) -> UserResponse:
        existing_user = self.user_datastore.get_user_by_email(
            user_create.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user = self.user_datastore.create_user(user_create)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create user"
            )
        return UserResponse.from_orm(user)

    def login_user(self, user_login: UserLogin) -> dict:
        user = self.user_datastore.get_user_by_email(user_login.email)
        if not user or not verify_password(user_login.password, str(user.hashed_password)):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self._create_access_token(data={"sub": user.email})
        refresh_token = self._create_refresh_token(data={"sub": user.email})
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

    def refresh_access_token(self, refresh_token: str) -> dict:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(
                refresh_token, settings.REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM])
            raw_email: str | None = payload.get("sub")
            if raw_email is None:
                raise credentials_exception
            email: str = raw_email
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception

        if token_data.email is None:
            raise credentials_exception

        user = self.user_datastore.get_user_by_email(token_data.email)
        if user is None:
            raise credentials_exception

        new_access_token = self._create_access_token(data={"sub": user.email})
        new_refresh_token = self._create_refresh_token(
            data={"sub": user.email})
        return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

    def get_user_by_email_service(self, email: str):
        """Fetches a user by email from the datastore."""
        return self.user_datastore.get_user_by_email(email)
