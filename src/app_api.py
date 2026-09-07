from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load local environment variables from .env
load_dotenv()

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .database import engine, Base, get_db
from .models import User
from .auth import get_password_hash, verify_password, create_access_token, get_current_user
import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from .websockets import manager, simulate_live_analytics, simulate_alerts, simulate_supply_chain

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project FORESIGHT API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_live_analytics())
    asyncio.create_task(simulate_alerts())
    asyncio.create_task(simulate_supply_chain())

@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

DATA_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
MODELS_DIR = r"c:\Users\hp\Desktop\Retail system\models"

# Lazy-loaded globals
models = {}
datasets = {}

def load_data(name, filename):
    if name not in datasets:
        datasets[name] = pd.read_csv(os.path.join(DATA_DIR, filename))
    return datasets[name]

def load_model(name, filename):
    if name not in models:
        models[name] = joblib.load(os.path.join(MODELS_DIR, filename))
    return models[name]

# --- ENGINE A ENDPOINTS ---
@app.get("/api/inventory/kpi")
def get_inventory_kpis():
    df = load_data('inventory', 'inventory_scored.csv')
    return {
        "total_inventory_units": int(df['current_inventory'].sum()),
        "average_operational_cost": float(df['predicted_operational_cost'].mean()),
        "items_requiring_reorder": int((df['inventory_status'] == '🔴 Reorder Required').sum()),
        "average_lead_time_days": float(df['lead_time_days'].mean())
    }

@app.get("/api/inventory/health")
def get_inventory_health():
    df = load_data('inventory', 'inventory_scored.csv')
    return df['inventory_status'].value_counts().to_dict()

@app.get("/api/inventory/risk")
def get_inventory_risks(status: Optional[str] = None, limit: int = 50):
    df = load_data('inventory', 'inventory_scored.csv')
    if status:
        df = df[df['inventory_status'].str.contains(status, case=False, na=False)]
    else:
        df = df[~df['inventory_status'].str.contains("Healthy", case=False, na=False)]
    return df.head(limit).to_dict(orient="records")

class OpCostInput(BaseModel):
    product_id: int
    warehouse_id: int
    month: int
    day_of_week: int
    is_weekend: int
    historical_demand: int
    demand_variability: float
    current_inventory: int
    reorder_point: int
    lead_time_days: int
    holding_cost: float
    ordering_cost: float
    shortage_cost: float

@app.post("/api/predict/operational_cost")
def predict_op_cost(inputs: List[OpCostInput]):
    model = load_model('op_cost', 'operational_cost_model.pkl')
    df_input = pd.DataFrame([i.dict() for i in inputs])
    df_input['product_id'] = df_input['product_id'].astype('category')
    df_input['warehouse_id'] = df_input['warehouse_id'].astype('category')
    
    preds = model.predict(df_input)
    return [{"product_id": inputs[i].product_id, "predicted_operational_cost": float(p)} for i, p in enumerate(preds)]

# --- ENGINE B ENDPOINTS ---
@app.get("/api/sales/kpi")
def get_sales_kpis():
    df = load_data('sales', 'sales_scored.csv')
    df['Revenue'] = df['predicted_units_sold'] * df['Price']
    return {
        "total_predicted_sales": float(df['predicted_units_sold'].sum()),
        "total_predicted_revenue": float(df['Revenue'].sum()),
        "items_with_stockout_risk": int((df['sales_status'] == '🔴 Stockout Risk').sum())
    }

@app.get("/api/sales/health")
def get_sales_health():
    df = load_data('sales', 'sales_scored.csv')
    return df['sales_status'].value_counts().to_dict()

@app.get("/api/sales/risk")
def get_sales_risks(limit: int = 50):
    df = load_data('sales', 'sales_scored.csv')
    df = df[df['sales_status'] == '🔴 Stockout Risk']
    return df.head(limit).to_dict(orient="records")

@app.get("/api/sales/aggregations/revenue_by_weather")
def get_revenue_by_weather():
    df = load_data('sales', 'sales_scored.csv')
    df['Revenue'] = df['predicted_units_sold'] * df['Price']
    agg = df.groupby('Weather Condition')['Revenue'].sum().to_dict()
    return agg

class SalesInput(BaseModel):
    Store_ID: str = Field(alias="Store ID")
    Product_ID: str = Field(alias="Product ID")
    Category: str
    Region: str
    Weather_Condition: str = Field(alias="Weather Condition")
    Seasonality: str
    month: int
    day_of_week: int
    is_weekend: int
    Inventory_Level: int = Field(alias="Inventory Level")
    Price: float
    Discount: float
    Holiday_Promotion: int = Field(alias="Holiday/Promotion")
    Competitor_Pricing: float = Field(alias="Competitor Pricing")

@app.post("/api/predict/sales")
def predict_sales(inputs: List[SalesInput]):
    model = load_model('sales', 'sales_volume_model.pkl')
    # Use by_alias to correctly map keys like 'Store ID'
    df_input = pd.DataFrame([i.dict(by_alias=True) for i in inputs])
    for col in ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']:
        df_input[col] = df_input[col].astype('category')
        
    preds = model.predict(df_input)
    return [{"Product ID": inputs[i].Product_ID, "predicted_units_sold": float(p)} for i, p in enumerate(preds)]

@app.get("/api/sales/optimal_pricing")
def get_optimal_pricing(limit: int = 50):
    df = load_data('optimal_pricing', 'optimal_pricing.csv')
    return df.head(limit).to_dict(orient="records")

@app.post("/api/inventory/generate_pos")
def api_generate_pos():
    import subprocess
    import sys
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "06_po_generator.py")
    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
    if result.returncode == 0:
        return {"status": "success", "message": "Purchase Orders generated successfully."}
    else:
        return {"status": "error", "message": result.stderr}
class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_ai(chat_input: ChatMessage):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": "Error: GEMINI_API_KEY is not set in the environment variables."}
    
    try:
        print(f"Received chat request: {chat_input.message}")
        genai.configure(api_key=api_key)
        
        system_prompt = "You are FORESIGHT OS. You MUST answer in 1 to 2 short sentences max. No formatting, no tables, no lists."
        
        model = genai.GenerativeModel(
            'gemini-3.6-flash', 
            system_instruction=system_prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=60,
                temperature=0.2
            )
        )
        print("Model configured, calling generate_content...")
        response = model.generate_content(chat_input.message)
        print("Received response from Gemini.")
        return {"response": response.text}
    except Exception as e:
        print(f"Error in chat_with_ai: {e}")
        return {"response": f"Error communicating with AI: {str(e)}"}

# --- DASHBOARD MOCK ENDPOINTS ---
class ForecastRequest(BaseModel):
    store_id: str
    item_id: str

@app.post("/forecast")
def generate_forecast(req: ForecastRequest):
    return [
        {"Date": "2026-08-21", "Historical_Demand": 120, "Forecast": 125.4},
        {"Date": "2026-08-22", "Historical_Demand": 115, "Forecast": 118.2},
        {"Date": "2026-08-23", "Historical_Demand": 130, "Forecast": 135.1},
        {"Date": "2026-08-24", "Historical_Demand": None, "Forecast": 142.7},
        {"Date": "2026-08-25", "Historical_Demand": None, "Forecast": 128.9}
    ]

class PricingRequest(BaseModel):
    store_id: str
    item_id: str

@app.post("/pricing/optimize")
def optimize_pricing(req: PricingRequest):
    return {
        "Action": "Decrease Price",
        "Current_Price": 24.99,
        "Competitor_Avg": 22.50,
        "Suggested_Price": 22.99,
        "Reason": "High price elasticity detected. A 8% price drop is predicted to increase volume by 22%, maximizing total margin."
    }

class PORequest(BaseModel):
    store_id: str

@app.post("/po/generate")
def generate_po_mock(req: PORequest):
    from datetime import datetime
    return {
        "Status": "Generated",
        "Generated_At": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Purchase_Orders": [
            {"Item_ID": "SKU_084", "Predicted_Shortage": 45.2, "Order_Quantity": 100, "Estimated_Cost": 1250.00},
            {"Item_ID": "SKU_112", "Predicted_Shortage": 12.8, "Order_Quantity": 50, "Estimated_Cost": 420.50},
            {"Item_ID": "SKU_993", "Predicted_Shortage": 88.5, "Order_Quantity": 200, "Estimated_Cost": 3400.00}
        ]
    }

# --- AUTH ENDPOINTS ---
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    company: str = ""
    job_title: str = ""

@app.post("/api/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, name=user.name, password_hash=hashed_password, company=user.company, job_title=user.job_title)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully"}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "phone": current_user.phone,
        "timezone": current_user.timezone,
        "company": current_user.company,
        "job_title": current_user.job_title
    }

