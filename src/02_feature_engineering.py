import pandas as pd
import os

PROCESSED_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
os.makedirs(PROCESSED_DIR, exist_ok=True)

# --- Engine A: Inventory Optimization ---
RAW_INV_DIR = r"c:\Users\hp\Desktop\Retail system\data\raw\inventory_dataset"
print("1A. Loading Inventory Dataset...")
df_inv = pd.read_csv(os.path.join(RAW_INV_DIR, "Inventory_Dataset.csv"))

print("2A. Extracting Temporal Features (Inventory)...")
df_inv['date'] = pd.to_datetime(df_inv['date'])
df_inv['month'] = df_inv['date'].dt.month
df_inv['day_of_week'] = df_inv['date'].dt.dayofweek
df_inv['is_weekend'] = df_inv['day_of_week'].isin([5, 6]).astype(int)

df_inv['product_id'] = df_inv['product_id'].astype('category')
df_inv['warehouse_id'] = df_inv['warehouse_id'].astype('category')

out_path_inv = os.path.join(PROCESSED_DIR, "inventory_features.parquet")
df_inv.to_parquet(out_path_inv, index=False)


# --- Engine B: Sales Analytics ---
RAW_SALES_DIR = r"c:\Users\hp\Desktop\Retail system\data\raw\sales_dataset"
print("\n1B. Loading Sales Dataset...")
df_sales = pd.read_csv(os.path.join(RAW_SALES_DIR, "retail_store_inventory.csv"))

print("2B. Extracting Features (Sales)...")
df_sales['Date'] = pd.to_datetime(df_sales['Date'])
df_sales['month'] = df_sales['Date'].dt.month
df_sales['day_of_week'] = df_sales['Date'].dt.dayofweek
df_sales['is_weekend'] = df_sales['day_of_week'].isin([5, 6]).astype(int)

# Categorical Features
cat_cols = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']
for col in cat_cols:
    df_sales[col] = df_sales[col].astype('category')

out_path_sales = os.path.join(PROCESSED_DIR, "sales_features.parquet")
df_sales.to_parquet(out_path_sales, index=False)

print("\n Dual-Engine Feature Engineering complete!")
