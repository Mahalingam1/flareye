import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routers import hospital, cameras, sensors, incidents, evacuation, compliance, copilot, demo, reports

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"Hospital Fire Safety Intelligence & Emergency Response Platform - {settings.PROJECT_TAGLINE}",
    version=settings.VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(hospital.router)
app.include_router(cameras.router)
app.include_router(sensors.router)
app.include_router(incidents.router)
app.include_router(evacuation.router)
app.include_router(compliance.router)
app.include_router(copilot.router)
app.include_router(demo.router)
app.include_router(reports.router)

# Active WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Heartbeat & telemetry stream every second
            await asyncio.sleep(settings.WS_HEARTBEAT_INTERVAL)
            telemetry_data = {
                "type": "TELEMETRY_UPDATE",
                "timestamp": "2026-08-11T14:32:15Z",
                "system_status": "ONLINE",
                "active_incident": True,
                "overall_risk_score": 94.0,
                "floor2_temp": 68.4,
                "floor2_smoke": 320.0,
                "safest_exit": "EAST RAMP EMERGENCY EXIT",
                "people_count_icu": 17
            }
            await websocket.send_text(json.dumps(telemetry_data))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "status": "ONLINE",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
