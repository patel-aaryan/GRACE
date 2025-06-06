from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database.session import get_db
from schemas import Token, UserResponse, UserCreate
from controllers import AuthController

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserResponse:
    auth_controller = AuthController(db)
    return await auth_controller.get_current_user(token=token)


@router.post("/register", response_model=UserResponse)
def register_user(user_create: UserCreate, db: Session = Depends(get_db)):
    auth_controller = AuthController(db)
    return auth_controller.auth_service.register_user(user_create=user_create)


@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_controller = AuthController(db)
    return auth_controller.login_for_access_token(form_data=form_data)


@router.post("/refresh", response_model=Token)
def refresh_access_token(refresh_token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    auth_controller = AuthController(db)
    return auth_controller.refresh_access_token(refresh_token=refresh_token)


@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    auth_controller = AuthController(db=Depends(get_db))
    return await auth_controller.read_users_me(current_user=current_user)
