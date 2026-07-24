from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from httpx import AsyncClient # AsyncClient is a non-blocking implementation of http requests, and is also a FastAPI dependency.


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Can define different clients for different applications, to determine specific base_url, headers, etc on each one.
    print("ON!!!")
    app.client1 = AsyncClient()
    yield
    print("OFF!!!")
    await app.client.aclose() # On App Shutdown


async def get_request(request: Request, url: str):
    client = request.app.client1
    res = await client.get(url)
    return res.json()
