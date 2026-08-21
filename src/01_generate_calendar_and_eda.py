import pandas as pd
import numpy as np
import os

# Paths
DATA_DIR = r"c:\Users\hp\Desktop\Retail system\data\raw\retail_clean_dataset"
OUT_CALENDAR = os.path.join(DATA_DIR, "calender.csv")
EDA_OUT = r"c:\Users\hp\Desktop\Retail system\data\eda_summary.txt"

print("Starting Calendar Generation and EDA...")

# 1. Generate Calendar
print("Reading dates to find min and max from sales_transactions.csv...")
# Read only the 'date' column to save memory and time
try:
    dates_df = pd.read_csv(os.path.join(DATA_DIR, "sales_transactions.csv"), usecols=['date'])
    dates_df['date'] = pd.to_datetime(dates_df['date'])

    min_date = dates_df['date'].min()
    max_date = dates_df['date'].max()
    print(f"Sales Data ranges from {min_date.date()} to {max_date.date()}")

    # Generate calendar extending 1 year into the future for forecasting
    end_date = max_date + pd.DateOffset(years=1)
    calendar_df = pd.DataFrame({"date": pd.date_range(start=min_date, end=end_date)})

    calendar_df['year'] = calendar_df['date'].dt.year
    calendar_df['month'] = calendar_df['date'].dt.month
    calendar_df['day'] = calendar_df['date'].dt.day
    calendar_df['day_of_week'] = calendar_df['date'].dt.dayofweek
    calendar_df['day_name'] = calendar_df['date'].dt.day_name()
    calendar_df['is_weekend'] = calendar_df['day_of_week'].isin([5, 6]).astype(int)
    calendar_df['quarter'] = calendar_df['date'].dt.quarter

    calendar_df.to_csv(OUT_CALENDAR, index=False)
    print(f"-> Calendar dataset generated and saved to {OUT_CALENDAR}")
    
except Exception as e:
    print(f"Error generating calendar: {e}")

# 2. Basic EDA (Sampling for speed)
print("\nPerforming basic EDA on a sample of 500,000 rows...")
try:
    sample_df = pd.read_csv(os.path.join(DATA_DIR, "sales_transactions.csv"), nrows=500000)
    
    # Let's also check sku_master and inventory_snapshot
    sku_df = pd.read_csv(os.path.join(DATA_DIR, "sku_master.csv"), nrows=1000)
    inv_df = pd.read_csv(os.path.join(DATA_DIR, "inventory_snapshot.csv"), nrows=1000)
    
    with open(EDA_OUT, "w") as f:
        f.write("=== SALES TRANSACTIONS EDA (Sample 500k rows) ===\n")
        f.write(str(sample_df.dtypes) + "\n\n")
        f.write("=== SUMMARY STATISTICS ===\n")
        f.write(str(sample_df.describe()) + "\n\n")
        f.write("=== MISSING VALUES ===\n")
        f.write(str(sample_df.isnull().sum()) + "\n\n")
        
        f.write("=== SKU MASTER (Sample) ===\n")
        f.write(str(sku_df.dtypes) + "\n\n")
        f.write("=== INVENTORY SNAPSHOT (Sample) ===\n")
        f.write(str(inv_df.dtypes) + "\n")

    print(f"-> EDA Summary saved to {EDA_OUT}")
except Exception as e:
    print(f"Error during EDA: {e}")

print("Done.")
