import pandas as pd
import os
import datetime

PROCESSED_DIR = r"c:\Users\hp\Desktop\Retail system\data\processed"
PO_DIR = r"c:\Users\hp\Desktop\Retail system\data\purchase_orders"

def generate_pos():
    os.makedirs(PO_DIR, exist_ok=True)
    print("1. Loading Scored Inventory Data...")
    df_inv = pd.read_csv(os.path.join(PROCESSED_DIR, "inventory_scored.csv"))

    # Filter for items needing reorder
    reorder_items = df_inv[df_inv['inventory_status'].str.contains("Reorder", na=False)]
    
    if reorder_items.empty:
        print("No items require reordering at this time.")
        return 0
    
    print(f"2. Generating Purchase Orders for {len(reorder_items)} items...")
    
    # Group by warehouse (or could be supplier if we had it)
    po_count = 0
    grouped = reorder_items.groupby('warehouse_id')
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for warehouse_id, group in grouped:
        po_filename = f"PO_Warehouse_{warehouse_id}_{timestamp}.csv"
        po_path = os.path.join(PO_DIR, po_filename)
        
        # Calculate Order Quantity
        # Order up to 2x historical demand to build safety stock
        group['order_quantity'] = (group['historical_demand'] * 2) - group['current_inventory']
        
        # Ensure minimum order quantity > 0
        group['order_quantity'] = group['order_quantity'].apply(lambda x: x if x > 0 else 50)
        
        # Select columns for PO
        po_df = group[['product_id', 'current_inventory', 'reorder_point', 'historical_demand', 'order_quantity']]
        
        po_df.to_csv(po_path, index=False)
        po_count += 1
        print(f"  -> Generated {po_filename}")
        
    print(f"3. Successfully generated {po_count} Purchase Orders.")
    return po_count

if __name__ == "__main__":
    generate_pos()
