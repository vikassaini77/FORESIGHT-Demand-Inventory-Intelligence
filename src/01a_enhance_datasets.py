import pandas as pd
import numpy as np
import random
import os

RAW_DIR = r"c:\Users\hp\Desktop\Retail system\data\raw\retail_clean_dataset"

print("1. Enhancing store_master.csv...")
stores = pd.read_csv(os.path.join(RAW_DIR, "store_master.csv"))
regions = ['North', 'South', 'East', 'West', 'Central']
formats = ['Supercenter', 'Mall Kiosk', 'Express']
stores['region'] = [random.choice(regions) for _ in range(len(stores))]
stores['store_format'] = [random.choice(formats) for _ in range(len(stores))]
stores.to_csv(os.path.join(RAW_DIR, "store_master.csv"), index=False)

print("2. Enhancing sku_master.csv...")
skus = pd.read_csv(os.path.join(RAW_DIR, "sku_master.csv"))
suppliers = ['GlobalTrade Inc.', 'RetailPro Supplies', 'Prime Goods LLC', 'Apex Distributors']
skus['supplier_name'] = [random.choice(suppliers) for _ in range(len(skus))]
# Handle possible division by zero or negative costs
skus['profit_margin_pct'] = ((skus['unit_price'] - skus['cost_price']) / skus['unit_price']).fillna(0)
skus.to_csv(os.path.join(RAW_DIR, "sku_master.csv"), index=False)

print("3. Enhancing inventory_snapshot.csv...")
inv = pd.read_csv(os.path.join(RAW_DIR, "inventory_snapshot.csv"))
warehouses = ['WH-Alpha', 'WH-Beta', 'WH-Gamma']
inv['warehouse_location'] = [random.choice(warehouses) for _ in range(len(inv))]
inv.to_csv(os.path.join(RAW_DIR, "inventory_snapshot.csv"), index=False)

print("4. Enhancing sales_transactions.csv in chunks (This might take a minute)...")
# We need cost_price from skus to calculate actual profit
cost_dict = skus.set_index('sku_id')['cost_price'].to_dict()

chunk_size = 1_000_000
temp_file = os.path.join(RAW_DIR, "sales_transactions_enhanced.csv")
first_chunk = True

times_of_day = ['Morning', 'Afternoon', 'Evening']

for chunk in pd.read_csv(os.path.join(RAW_DIR, "sales_transactions.csv"), chunksize=chunk_size):
    # Add time_of_day (randomized for synthetic data)
    chunk['time_of_day'] = np.random.choice(times_of_day, len(chunk))
    
    # Calculate profit_realized
    # profit = total_value (which has discounts applied) - (cost_price * quantity)
    chunk['cost_price'] = chunk['sku_id'].map(cost_dict)
    chunk['profit_realized'] = chunk['total_value'] - (chunk['cost_price'] * chunk['quantity'])
    chunk.drop(columns=['cost_price'], inplace=True)
    
    # Save chunk
    chunk.to_csv(temp_file, mode='w' if first_chunk else 'a', header=first_chunk, index=False)
    first_chunk = False
    print("Processed 1 million rows...")

# Replace old file with new file
os.replace(temp_file, os.path.join(RAW_DIR, "sales_transactions.csv"))

print("All datasets successfully enhanced!")
