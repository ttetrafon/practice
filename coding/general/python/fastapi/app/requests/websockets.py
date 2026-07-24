from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, msg: str, websocket: WebSocket):
        await websocket.send_text(msg)

    async def broadcast_message(self, msg: str):
        for ws in self.active_connections:
            await ws.send_text(msg)
