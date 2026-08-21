import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from lightgbm import LGBMRegressor
import warnings
warnings.filterwarnings('ignore')

PROCESSED_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
MODELS_DIR = r"c:\Users\hp\Desktop\Retail system\models"
os.makedirs(MODELS_DIR, exist_ok=True)

# --- Engine A: Inventory Optimization ---
print("\n=== ENGINE A: Inventory Optimization ===")
df_inv = pd.read_parquet(os.path.join(PROCESSED_DIR, "inventory_features.parquet"))

target_inv = 'target_operational_cost'
features_inv = ['month', 'day_of_week', 'is_weekend', 'historical_demand', 'demand_variability', 
            'current_inventory', 'reorder_point', 'lead_time_days', 
            'holding_cost', 'ordering_cost', 'shortage_cost']
cat_features_inv = ['product_id', 'warehouse_id']

X_inv = df_inv[features_inv + cat_features_inv]
y_inv = df_inv[target_inv]

X_train, X_test, y_train, y_test = train_test_split(X_inv, y_inv, test_size=0.2, random_state=42)
lgb_inv = LGBMRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
lgb_inv.fit(X_train, y_train, categorical_feature=cat_features_inv)

y_pred = lgb_inv.predict(X_test)
print(f"Operational Cost RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")
joblib.dump(lgb_inv, os.path.join(MODELS_DIR, "operational_cost_model.pkl"))

# --- Engine B: Sales Forecasting ---
print("\n=== ENGINE B: Sales Forecasting ===")
df_sales = pd.read_parquet(os.path.join(PROCESSED_DIR, "sales_features.parquet"))

target_sales = 'Units Sold'
features_sales = ['month', 'day_of_week', 'is_weekend', 'Inventory Level', 'Price', 'Discount', 'Holiday/Promotion', 'Competitor Pricing']
cat_features_sales = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']

X_sales = df_sales[features_sales + cat_features_sales]
y_sales = df_sales[target_sales]

X_train, X_test, y_train, y_test = train_test_split(X_sales, y_sales, test_size=0.2, random_state=42)
lgb_sales = LGBMRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
lgb_sales.fit(X_train, y_train, categorical_feature=cat_features_sales)

y_pred = lgb_sales.predict(X_test)
print(f"Units Sold RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")
joblib.dump(lgb_sales, os.path.join(MODELS_DIR, "sales_volume_model.pkl"))

print("\n Dual-Engine ML Training complete!")
