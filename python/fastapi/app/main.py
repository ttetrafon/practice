from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from contextlib import asynccontextmanager
from httpx import AsyncClient
import asyncio, time
from app.api.v1.api import router as api_router
from app.requests import requests_handler as rh, websockets as ws

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



# Websocket control
ws_manager: ws.ConnectionManager = ws.ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message(f"[You] {data}", websocket)
            await ws_manager.broadcast_message(f"[{client_id}] {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        await ws_manager.broadcast_message(f"[Server] Client {client_id} has disconnected...")


app.include_router(api_router, prefix="/api/v1")
