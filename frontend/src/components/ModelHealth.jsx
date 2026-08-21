import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
import { Database, Cpu, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import FileDropzone from './FileDropzone';

function ModelHealth() {
  const [timeRange, setTimeRange] = useState('7D');
  const { addToast } = useToast();
  const [isRetraining, setIsRetraining] = useState(false);
  
  const maeData = [
    { date: 'Nov 14', mae: 16.5 },
    { date: 'Nov 15', mae: 15.8 },
    { date: 'Nov 16', mae: 15.1 },
    { date: 'Nov 17', mae: 14.7 },
    { date: 'Nov 18', mae: 14.5 },
    { date: 'Nov 19', mae: 14.2 },
    { date: 'Nov 20', mae: 14.1 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
            {payload[0].value} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Units</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container animate-fade-up">
      <header className="header">
        <div>
          <h1>Model Health & Data Pipeline</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Technical telemetry for FORESIGHT ML Engines
          </div>
        </div>
        <div className="btn-group" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
          {['24H', '7D', '30D', 'YTD'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background: timeRange === range ? 'var(--accent-color)' : 'transparent',
                color: timeRange === range ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} /> Sales Engine (LightGBM)
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '4px' }}>Running</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> Last retrained: 8 hrs ago
          </div>
        </div>
        
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={16} /> Data Ingestion Pipeline
            </div>
            <span className="badge badge-success">Healthy</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '4px' }}>Synced</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> Last sync: 15 mins ago
          </div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} /> Current MAE Score
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px', color: 'var(--accent-color)' }}>
            14.1 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Units</span>
          </div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '12px', fontWeight: 500 }}>
            Target: &lt; 15.0 Units
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="var(--accent-color)" /> Retrain Model with Historical Data
        </h3>
        <FileDropzone 
          title="Upload Sales Dataset"
          description="Drag and drop CSV or Excel files containing historical sales data"
          acceptedTypes=".csv, .xlsx"
          onUploadSuccess={(file) => {
            addToast(`Successfully parsed ${file.name}`, 'success');
            setIsRetraining(true);
            setTimeout(() => {
               setIsRetraining(false);
               addToast('Model retrained successfully. MAE score improved.', 'success');
            }, 4000);
          }}
        />
        {isRetraining && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#3b82f6' }} />
            <div>
               <div style={{ fontWeight: '600', color: '#3b82f6' }}>Retraining LightGBM Engine...</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Processing new hyper-parameters and optimizing weights.</div>
            </div>
          </div>
        )}
      </div>

      <div className="chart-card" style={{ height: '420px', padding: '1.5rem 1.5rem 2.5rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Sales Forecasting Mean Absolute Error (MAE)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={maeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMae" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="var(--text-muted)" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="mae" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMae)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ModelHealth;
