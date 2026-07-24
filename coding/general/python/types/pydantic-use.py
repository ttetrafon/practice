# https://www.youtube.com/watch?v=502XOB0u8OY
# https://github.com/ArjanCodes/examples/tree/main/2024/pydantic_refresh

from enum import auto, IntFlag
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    SecretStr,
    ValidationError
)
from typing import Any

class Role(IntFlag):
    Author = auto()
    Editor = auto()
    Developer = auto()
    Admin = Author | Editor | Developer

class User(BaseModel): # BaseModel is the basis of validation that Pydantic provides
    name: str = Field(examples=["Nakis"])
    email: EmailStr = Field( # The Field can be used to fine-tune the details of the validation.
        examples=["ttetrafon@yahoo.gr"],
        description="The user's email address",
        frozen=True
    )
    password: SecretStr
    role: Role = Field(default=None)

def validate(data: dict[str, Any]) -> None:
    try:
        user = User.model_validate(data)
        print(user)
    except ValidationError as e:
        print("User is invalid...")
        for error in e.errors():
            print("-", error)

nakis: User = {
    "name": "Nakis",
    "email": "ttetrafon@yahoo.gr"
}
