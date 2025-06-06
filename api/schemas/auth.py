from pydantic import BaseModel
from typing import Optional


class UserProfile(BaseModel):
    id: str
    email: Optional[str] = None
    role: Optional[str] = None


class TokenVerificationResponse(BaseModel):
    valid: bool
    user_id: str
    email: Optional[str] = None
