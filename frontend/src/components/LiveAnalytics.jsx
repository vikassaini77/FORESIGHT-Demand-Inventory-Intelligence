import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveAnalytics = () => {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState({ sales: 0, revenue: 0, confidence: 100 });
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // Pre-fill with empty data for smooth chart entry
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: '', sales: 0, revenue: 0, confidence: 100
    }));
    setData(initialData);

    const ws = new WebSocket('ws://localhost:8000/ws/live-analytics');

    ws.onopen = () => setStatus('Connected');
    ws.onclose = () => setStatus('Disconnected. Retrying...');
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setLatest(newData);
      
      setData((prev) => {
        const newArr = [...prev, newData];
        if (newArr.length > 20) newArr.shift(); // Keep exactly 20 points for scrolling effect
        return newArr;
      });
    };

    return () => ws.close();
  }, []);

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0' }}>Live Predictive Analytics</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Real-time streaming data from global POS systems.</p>
        </div>
        <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
          {status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* KPI Cards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <Activity size={20} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Live Sales Velocity</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>
            {latest.sales} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>units/sec</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <TrendingUp size={20} color="var(--success)" />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Live Revenue Stream</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>
            ${(latest.revenue).toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', border: `1px solid ${getConfidenceColor(latest.confidence)}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <AlertTriangle size={20} color={getConfidenceColor(latest.confidence)} />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Prediction Confidence</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getConfidenceColor(latest.confidence) }}>
            {latest.confidence}%
          </div>
          {latest.confidence < 60 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '8px', color: 'var(--danger)', fontSize: '0.85rem' }}>
               Warning: High volatility detected. Predictions may be inaccurate.
             </motion.div>
          )}
        </div>
      </div>

      {/* Scrolling Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.1rem' }}>Sales Velocity Stream</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ background: 'rgba(5,5,5,0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalytics;
