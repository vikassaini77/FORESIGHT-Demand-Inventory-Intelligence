import React, { useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

// --- MOCK DATA FOR NEW CHARTS ---
const demandData = [
  { month: 'Jan', actual: 4000, predicted: 4200 },
  { month: 'Feb', actual: 8000, predicted: 8500 },
  { month: 'Mar', actual: 5000, predicted: 5200 },
  { month: 'Apr', actual: 12000, predicted: 12500 },
  { month: 'May', actual: 8000, predicted: 8500 },
  { month: 'Jun', actual: 12000, predicted: 12800 },
  { month: 'Jul', actual: 11000, predicted: 11500 },
  { month: 'Aug', actual: 14000, predicted: 14500 },
  { month: 'Sep', actual: 11000, predicted: 11500 },
  { month: 'Oct', actual: 20000, predicted: 22000 },
  { month: 'Nov', actual: 15000, predicted: 16000 },
  { month: 'Dec', actual: 14000, predicted: 14500 },
];

const supplierData = [
  { name: 'On-Time', value: 78, color: '#f59e0b' },
  { name: 'Late', value: 12, color: '#ea580c' },
  { name: 'Pending', value: 10, color: '#52525b' },
];

const inventoryCategories = [
  { name: 'Raw Materials', value: 85 },
  { name: 'Work in Progress', value: 45 },
  { name: 'Finished Goods', value: 65 },
  { name: 'Packaging', value: 30 },
];

// Custom Glowing Radial Gauge Component
const RadialGauge = ({ value, max, color, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 8px ${color}80)` }}>
      {/* Background Circle */}
      <circle
        stroke="rgba(255,255,255,0.05)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Glowing Foreground Circle */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
};

export default function Dashboard() {
  const { addToast } = useToast();

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={staggerContainer} style={{ padding: '0 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="glow-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff' }}>Global Supply Chain Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Dynamic Date/Time • Live AI Prediction</p>
        </div>
        <button className="btn" style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid var(--border-color)', color: '#fff' }}>
          Premium KPI ▼
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Total Inventory */}
        <motion.div variants={fadeUpVariant} className="kpi-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              <div style={{ background: 'var(--accent-gold)', padding: '4px', borderRadius: '4px', color: '#000' }}>📦</div>
              TOTAL INVENTORY
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginTop: '1rem', lineHeight: 1 }}>24,850</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              Units <span style={{ color: 'var(--success)' }}>+3.2% ↑</span>
            </div>
          </div>
          <RadialGauge value={75} max={100} color="var(--accent-gold)" />
        </motion.div>

        {/* Demand Prediction */}
        <motion.div variants={fadeUpVariant} className="kpi-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              <div style={{ background: 'var(--accent-color)', padding: '4px', borderRadius: '4px', color: '#fff' }}>📈</div>
              DEMAND PREDICTION
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginTop: '1rem', lineHeight: 1 }}>18,400</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              Units [Next 30 Days]
            </div>
          </div>
          {/* Mock sparkline using SVG */}
          <svg width="80" height="40" style={{ filter: 'drop-shadow(0 0 8px rgba(234,88,12,0.8))' }}>
            <polyline fill="none" stroke="var(--accent-color)" strokeWidth="3" points="0,30 20,20 40,25 60,5 80,10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Fulfillment Rate */}
        <motion.div variants={fadeUpVariant} className="kpi-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              <div style={{ background: 'var(--accent-gold)', padding: '4px', borderRadius: '4px', color: '#000' }}>✓</div>
              FULFILLMENT RATE
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginTop: '1rem', lineHeight: 1 }}>96.7%</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              <span style={{ color: 'var(--success)' }}>+0.8% ↑</span>
            </div>
          </div>
          <RadialGauge value={96.7} max={100} color="var(--accent-gold)" />
        </motion.div>

        {/* On-Time Delivery */}
        <motion.div variants={fadeUpVariant} className="kpi-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              <div style={{ background: 'var(--danger)', padding: '4px', borderRadius: '4px', color: '#fff' }}>⏱</div>
              ON-TIME DELIVERY
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginTop: '1rem', lineHeight: 1 }}>94.2%</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
              <span style={{ color: 'var(--danger)' }}>-1.1% ↓</span>
            </div>
          </div>
          <RadialGauge value={94.2} max={100} color="var(--danger)" />
        </motion.div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', height: '400px' }}>
        
        {/* Demand Forecast Area Chart */}
        <motion.div variants={fadeUpVariant} className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demand Forecast & Prediction</h3>
            <select className="glass-select" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              <option>All Months</option>
            </select>
          </div>
          
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-gold)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid var(--accent-color)', borderRadius: '8px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="actual" stroke="var(--accent-gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))' }} />
                <Area type="monotone" dataKey="predicted" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" style={{ filter: 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.8))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inventory Status Progress Bars */}
        <motion.div variants={fadeUpVariant} className="chart-card">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>Inventory Status by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {inventoryCategories.map(cat => (
              <div key={cat.name}>
                <div style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '8px' }}>{cat.name}</div>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'visible', position: 'relative' }}>
                  <div style={{ 
                    width: `${cat.value}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-color))',
                    borderRadius: '12px',
                    boxShadow: '0 0 12px rgba(234, 88, 12, 0.8)',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Supplier Performance Donut */}
        <motion.div variants={fadeUpVariant} className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier Performance</h3>
          <div style={{ flex: 1, position: 'relative', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={supplierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  stroke="none"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {supplierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}90)` }} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On-Time</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>78%</div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
