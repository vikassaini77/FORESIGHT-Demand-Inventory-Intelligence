import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, DollarSign, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function SalesTab({ salesKpi, salesHealth, revByWeather }) {
  const [optimalPricing, setOptimalPricing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/sales/optimal_pricing?limit=5');
        setOptimalPricing(res.data);
      } catch (err) {
        console.error("Error fetching pricing", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title"><BarChart2 size={16} color="var(--accent-color)" /> Total Predicted Sales</div>
          <div className="kpi-value">{salesKpi?.total_predicted_sales?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title"><DollarSign size={16} color="var(--success)" /> Total Predicted Revenue</div>
          <div className="kpi-value">${salesKpi?.total_predicted_revenue?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title"><AlertTriangle size={16} color="var(--danger)" /> Items with Stockout Risk</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>{salesKpi?.items_with_stockout_risk?.toLocaleString()}</div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="chart-card">
          <h2>Sales Health Distribution</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesHealth} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={5} dataKey="value" stroke="none">
                  {salesHealth?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }}/>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="chart-card">
          <h2>Revenue by Weather Condition</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revByWeather} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="#60a5fa" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: '20px' }}>
        <h2>Dynamic Pricing Optimization Engine</h2>
        <p style={{ color: '#94a3b8' }}>Top 5 recommended price adjustments to maximize revenue based on ML elasticity model.</p>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#60a5fa' }}>
                <th style={{ padding: '10px' }}>Product ID</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Base Price</th>
                <th style={{ padding: '10px' }}>Optimal Price</th>
                <th style={{ padding: '10px' }}>Adjustment %</th>
                <th style={{ padding: '10px' }}>Expected Revenue</th>
              </tr>
            </thead>
            <tbody>
              {optimalPricing.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>{item['Product ID']}</td>
                  <td style={{ padding: '10px' }}>{item['Category']}</td>
                  <td style={{ padding: '10px' }}>${item['Base Price'].toFixed(2)}</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 'bold' }}>${item['Optimal Price'].toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>
                    {item['Price Adjustment %'] > 0 ? (
                      <span style={{ color: '#10b981' }}>+{item['Price Adjustment %'].toFixed(0)}%</span>
                    ) : item['Price Adjustment %'] < 0 ? (
                      <span style={{ color: '#ef4444' }}>{item['Price Adjustment %'].toFixed(0)}%</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>0%</span>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>${item['Expected Revenue'].toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default SalesTab;
