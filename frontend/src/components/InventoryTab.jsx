import React, { useState } from 'react';
import axios from 'axios';
import { Package, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

function InventoryTab({ invKpi, invHealth }) {
  const [poStatus, setPoStatus] = useState('');
  
  const generatePOs = async () => {
    setPoStatus('Generating...');
    try {
      const res = await axios.post('http://localhost:8000/api/inventory/generate_pos');
      if (res.data.status === 'success') {
        setPoStatus(res.data.message);
      } else {
        setPoStatus('Error: ' + res.data.message);
      }
    } catch (err) {
      setPoStatus('Error generating POs.');
    }
  };

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title"><Package size={16} color="var(--accent-color)" /> Total Inventory Units</div>
          <div className="kpi-value">{invKpi?.total_inventory_units?.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title"><TrendingDown size={16} color="var(--success)" /> Avg Operational Cost</div>
          <div className="kpi-value">${invKpi?.average_operational_cost?.toFixed(2)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title"><AlertTriangle size={16} color="var(--danger)" /> Items Requiring Reorder</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>{invKpi?.items_requiring_reorder?.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title"><Clock size={16} color="var(--warning)" /> Avg Lead Time (Days)</div>
          <div className="kpi-value">{invKpi?.average_lead_time_days?.toFixed(1)}</div>
        </div>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0' }}>Automated Reordering (Mock ERP)</h3>
            <p style={{ margin: 0, color: '#94a3b8' }}>Generate Purchase Orders for all {invKpi?.items_requiring_reorder} items currently flagged as 🔴 Reorder Required.</p>
          </div>
          <button 
            onClick={generatePOs}
            style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Generate Purchase Orders
          </button>
        </div>
        {poStatus && <div style={{ marginTop: '10px', color: '#10b981' }}>{poStatus}</div>}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Inventory Health Distribution</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={invHealth} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={5} dataKey="value" stroke="none">
                  {invHealth?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }}/>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default InventoryTab;
