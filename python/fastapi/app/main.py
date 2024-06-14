from fastapi import FastAPI
from app.api.api_v1.api import router as api_router

app = FastAPI(title="FastAPILambda")

@app.get("/")
async def root():
    return {"message": "FastAPI running!"}

@app.get("/heartbeat")
async def heartbeat():
    return {"message": "All good!"}

app.include_router(api_router, prefix="/api/v1")
