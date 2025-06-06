from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.models import User
from schemas import UserCreate
from utils.passwords import get_password_hash


class UserDatastore:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_create: UserCreate) -> User | None:
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            full_name=user_create.full_name
        )
        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:  # Handle cases like duplicate email
            self.db.rollback()
            return None

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()
