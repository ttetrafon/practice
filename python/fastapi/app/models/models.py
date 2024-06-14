from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4


class Role(str, Enum):
    admin = "admin"
    user = "user"
    student = "student"


class Gender(str, Enum):
    male = "male"
    female = "female"
    unknown = "unknown"


class User(BaseModel):
    # For non-required fields, add a default value
    uuid: Optional[UUID] = uuid4()
    user_id: str
    is_active: bool = True
    first_name: str
    middle_name: Optional[str] = ""
    family_name: str
    gender: Optional[Gender] = Gender.unknown
    roles: List[Role] = [Role.user]


class All_Users(BaseModel):
    total: int
    users: List[User]
