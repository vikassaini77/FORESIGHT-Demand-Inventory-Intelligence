import asyncio
import random
import json
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        # Maps channel name to a list of active WebSocket connections
        self.active_connections: dict[str, list[WebSocket]] = {
            "live-analytics": [],
            "alerts": [],
            "supply-chain": []
        }

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel in self.active_connections:
            self.active_connections[channel].append(websocket)
        else:
            self.active_connections[channel] = [websocket]

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            try:
                self.active_connections[channel].remove(websocket)
            except ValueError:
                pass

    async def broadcast(self, message: dict, channel: str):
        if channel not in self.active_connections:
            return
        
        dead_connections = []
        for connection in self.active_connections[channel]:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead, channel)

manager = ConnectionManager()

# --- Simulation Tasks ---

async def simulate_live_analytics():
    """Simulates real-time sales and predictive analytics data."""
    base_sales = 100
    base_revenue = 15000
    confidence = 85

    while True:
        await asyncio.sleep(2) # Update every 2 seconds
        
        # Add random noise
        sales_spike = random.randint(-15, 25)
        base_sales = max(0, base_sales + sales_spike)
        
        revenue_spike = sales_spike * random.randint(100, 200)
        base_revenue = max(0, base_revenue + revenue_spike)
        
        confidence = min(99, max(40, confidence + random.randint(-5, 5)))
        
        data = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "sales": base_sales,
            "revenue": base_revenue,
            "confidence": confidence
        }
        await manager.broadcast(data, "live-analytics")

async def simulate_alerts():
    """Simulates random supply chain alerts."""
    alerts_pool = [
        {"text": "CRITICAL: Temperature spike in Container 4A", "type": "error"},
        {"text": "Demand surge detected in European sector", "type": "info"},
        {"text": "Supplier delay: 3 hours for PO-112", "type": "warning"},
        {"text": "Inventory dropped below 5% for SKU-882", "type": "error"},
        {"text": "AI Optimization: Route 4 updated, saving 1.2 hrs", "type": "success"}
    ]
    while True:
        # Wait a random amount of time between 10 to 30 seconds
        await asyncio.sleep(random.randint(10, 30))
        
        alert = random.choice(alerts_pool)
        data = {
            "id": random.randint(1000, 9999),
            "text": alert["text"],
            "type": alert["type"],
            "time": "Just now"
        }
        await manager.broadcast(data, "alerts")

async def simulate_supply_chain():
    """Simulates live shipment arcs (origin -> destination) around the globe."""
    cities = [
        {"name": "New York", "lat": 40.71, "lng": -74.00},
        {"name": "London", "lat": 51.50, "lng": -0.12},
        {"name": "Tokyo", "lat": 35.67, "lng": 139.65},
        {"name": "Sydney", "lat": -33.86, "lng": 151.20},
        {"name": "Cape Town", "lat": -33.92, "lng": 18.42},
        {"name": "Rio", "lat": -22.90, "lng": -43.17},
        {"name": "Mumbai", "lat": 19.07, "lng": 72.87}
    ]
    
    while True:
        await asyncio.sleep(random.randint(3, 8))
        
        origin = random.choice(cities)
        dest = random.choice([c for c in cities if c != origin])
        
        color = random.choice(["#3b82f6", "#10b981", "#ef4444", "#f59e0b"]) # Blue, Green, Red, Amber
        
        data = {
            "startLat": origin["lat"],
            "startLng": origin["lng"],
            "endLat": dest["lat"],
            "endLng": dest["lng"],
            "color": color,
            "origin": origin["name"],
            "dest": dest["name"]
        }
        await manager.broadcast(data, "supply-chain")

# We will start these tasks during FastAPI startup
