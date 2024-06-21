from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from httpx import AsyncClient
import asyncio, time
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


"""
BEST PRACTICES
1. Use `async def` for endpoints with non-blocking I/O operations.
2. Use `def` for endpoints with blocking operations.
"""

# Runs in main thread, multiple requests are processed sequentially
@app.get("/1")
async def sleep_1():
    print("Started...")
    time.sleep(5) # blocking!
    print("... finished")

# Runs in main thread, await pauses the function operation, allowing for other requests to be handled
@app.get("/2")
async def sleep_2():
    print("Started...")
    await asyncio.sleep(5) # non-blocking!
    print("... finished")

# Runs in separate thread, multiple requests are processed in parallel
@app.get("/3")
def sleep_3():
    print("Started...")
    asyncio.sleep(5)
    print("... finished")


app.include_router(api_router, prefix="/api/v1")
