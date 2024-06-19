from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from httpx import AsyncClient
from app.api.v1.api import router as api_router
from app.requests import requests_handler as rh

app = FastAPI(title="FastAPI", lifespan=rh.lifespan)

@app.get("/")
async def root():
    return {"message": "FastAPI running!"}

@app.get("/heartbeat")
async def heartbeat():
    return {"message": "All good!"}

@app.get("/generate-uuid")
async def generate_uuid(request: Request):
    url = 'https://www.uuidtools.com/api/generate/v1'
    res = await rh.get_request(request, url)
    return {"uuid": res[0]}

app.include_router(api_router, prefix="/api/v1")
