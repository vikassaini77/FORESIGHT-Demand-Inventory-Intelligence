import pandas as pd
import numpy as np
import joblib
import os

PROCESSED_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
MODELS_DIR = r"c:\Users\hp\Desktop\Retail system\models"

print("1. Loading Data and Model...")
df_sales = pd.read_csv(os.path.join(PROCESSED_DIR, "sales_scored.csv"))
model_sales = joblib.load(os.path.join(MODELS_DIR, "sales_volume_model.pkl"))

print("2. Running Pricing Optimization Sweep...")
features_sales = ['month', 'day_of_week', 'is_weekend', 'Inventory Level', 'Price', 'Discount', 'Holiday/Promotion', 'Competitor Pricing', 'Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']
cat_cols = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Seasonality']

# Ensure categoricals match training
for col in cat_cols:
    df_sales[col] = df_sales[col].astype('category')

unique_products = df_sales.drop_duplicates(subset=['Product ID']).copy()

price_adjustments = [-0.2, -0.1, 0.0, 0.1, 0.2]

# Create bulk prediction dataframe
sim_dfs = []
for adj in price_adjustments:
    df_sim = unique_products.copy()
    df_sim['Simulated_Adjustment'] = adj
    df_sim['Simulated_Price'] = df_sim['Price'] * (1 + adj)
    # Temporarily overwrite Price for model
    df_sim['Price'] = df_sim['Simulated_Price']
    sim_dfs.append(df_sim)

bulk_sim = pd.concat(sim_dfs, ignore_index=True)

# Predict all at once
bulk_sim['Predicted_Units'] = model_sales.predict(bulk_sim[features_sales])
bulk_sim['Simulated_Revenue'] = bulk_sim['Predicted_Units'] * bulk_sim['Simulated_Price']

# Find the row with max revenue for each product
idx = bulk_sim.groupby('Product ID')['Simulated_Revenue'].idxmax()
best_rows = bulk_sim.loc[idx]

results = []
for _, row in best_rows.iterrows():
    base_price = row['Price'] / (1 + row['Simulated_Adjustment'])
    best_price = row['Simulated_Price']
    results.append({
        'Product ID': row['Product ID'],
        'Category': row['Category'],
        'Base Price': base_price,
        'Optimal Price': best_price,
        'Price Adjustment %': row['Simulated_Adjustment'] * 100,
        'Expected Units': row['Predicted_Units'],
        'Expected Revenue': row['Simulated_Revenue']
    })

optimal_df = pd.DataFrame(results)

print("3. Saving Optimal Pricing...")
optimal_df.to_csv(os.path.join(PROCESSED_DIR, "optimal_pricing.csv"), index=False)
print("Done!")
