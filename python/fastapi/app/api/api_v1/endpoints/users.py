from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.models.models import User, All_Users

router = APIRouter()

users: List[User] = []


@router.get("/", response_model=All_Users)
async def get_users() -> All_Users:
    return {
        "total": len(users),
        "users": users
    }


@router.get("/get_user", response_model=User)
async def get_user(user_id: str) -> User:
    res: User = None
    for user in users:
        if user.user_id == user_id:
            res = user
    if res != None:
        return res
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/list", response_model=List[User])
async def list_user(limit: int = 10, start_at: int = 0) -> List[User]:
    return users[start_at:limit]


@router.post("/", response_model=List[User])
async def add_user(in_users: List[User]) -> List[User]:
    for user in in_users:
        users.append(user)
    return in_users
