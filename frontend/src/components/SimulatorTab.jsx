import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

function SimulatorTab() {
  const [price, setPrice] = useState(50);
  const [discount, setDiscount] = useState(5);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const payload = [{
          "Store ID": "Store_1",
          "Product ID": "SKU_1",
          "Category": "Electronics",
          "Region": "North",
          "Weather Condition": "Clear",
          "Seasonality": "Spring",
          "month": 5,
          "day_of_week": 2,
          "is_weekend": 0,
          "Inventory Level": 500,
          "Price": price,
          "Discount": discount,
          "Holiday/Promotion": 0,
          "Competitor Pricing": 48
        }];

        const res = await axios.post('http://localhost:8000/api/predict/sales', payload);
        const units = res.data[0].predicted_units_sold;
        setPrediction({
          units: units,
          revenue: units * (price * (1 - discount/100))
        });
      } catch (err) {
        console.error(err);
      }
    };
    
    // Add simple debounce
    const timeoutId = setTimeout(() => {
      fetchPrediction();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [price, discount]);

  const data = prediction ? [
    { name: 'Expected Units', value: prediction.units },
    { name: 'Expected Revenue ($)', value: prediction.revenue }
  ] : [];

  return (
    <div className="chart-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Interactive "What-If" Scenario Simulator</h2>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Adjust the Price and Discount for a standard Electronics product in the North region to see how the ML model predicts changes in Units Sold and total Revenue.
      </p>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Price ($): {price}</label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>Discount (%): {discount}</label>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={discount} 
            onChange={(e) => setDiscount(Number(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <RechartsTooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SimulatorTab;
