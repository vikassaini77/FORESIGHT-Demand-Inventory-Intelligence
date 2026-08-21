import pandas as pd
import numpy as np
import joblib
import os

PROCESSED_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
MODELS_DIR = r"c:\Users\hp\Desktop\Retail system\models"

print("1. Loading Data and Models...")
df_inv = pd.read_parquet(os.path.join(PROCESSED_DIR, "inventory_features.parquet"))
df_sales = pd.read_parquet(os.path.join(PROCESSED_DIR, "sales_features.parquet"))

model_inv = joblib.load(os.path.join(MODELS_DIR, "operational_cost_model.pkl"))
model_sales = joblib.load(os.path.join(MODELS_DIR, "sales_volume_model.pkl"))

print("2. Scoring Engine A (Inventory)...")
features_inv = ['month', 'day_of_week', 'is_weekend', 'historical_demand', 'demand_variability', 
            'current_inventory', 'reorder_point', 'lead_time_days', 
            'holding_cost', 'ordering_cost', 'shortage_cost', 'product_id', 'warehouse_id']

# Predict operational cost
df_inv['predicted_operational_cost'] = model_inv.predict(df_inv[features_inv])

def get_inv_status(row):
    if row['current_inventory'] <= row['reorder_point']:
        return "🔴 Reorder Required"
    elif row['current_inventory'] > (row['historical_demand'] * 2) and row['predicted_operational_cost'] > 500:
        return "🟡 High Cost Overstock"
    else:
        return "🟢 Healthy"

df_inv['inventory_status'] = df_inv.apply(get_inv_status, axis=1)

print("3. Scoring Engine B (Sales)...")
features_sales = ['month', 'day_of_week', 'is_weekend', 'Inventory Level', 'Price', 'Discount', 'Holiday/Promotion', 'Competitor Pricing', 'Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']

df_sales['predicted_units_sold'] = model_sales.predict(df_sales[features_sales])

def get_sales_status(row):
    if row['predicted_units_sold'] > row['Inventory Level']:
        return "🔴 Stockout Risk"
    else:
        return "🟢 Healthy"

df_sales['sales_status'] = df_sales.apply(get_sales_status, axis=1)

print("4. Saving Scored Datasets...")
df_inv.to_csv(os.path.join(PROCESSED_DIR, "inventory_scored.csv"), index=False)
df_sales.to_csv(os.path.join(PROCESSED_DIR, "sales_scored.csv"), index=False)

print("\n--- INVENTORY HEALTH SUMMARY (ENGINE A) ---")
print("Engine A scoring complete.")

print("\n--- SALES HEALTH SUMMARY (ENGINE B) ---")
print("Engine B scoring complete.")
print("Done!")
