import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Package, MapPin, Search, AlertCircle, RefreshCw, Activity, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { MiniSpinner } from './PremiumLoader';

// --- MOCK DATA FOR NEW CHARTS ---
const inventoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Apparel', value: 300 },
  { name: 'Home Goods', value: 300 },
  { name: 'Groceries', value: 200 },
];
const COLORS = ['#ea580c', '#f59e0b', '#b45309', '#78350f'];

const revenueData = [
  { name: 'Mon', revenue: 4000, cost: 2400 },
  { name: 'Tue', revenue: 3000, cost: 1398 },
  { name: 'Wed', revenue: 2000, cost: 9800 },
  { name: 'Thu', revenue: 2780, cost: 3908 },
  { name: 'Fri', revenue: 1890, cost: 4800 },
  { name: 'Sat', revenue: 2390, cost: 3800 },
  { name: 'Sun', revenue: 3490, cost: 4300 },
];

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { user } = useUser();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab 1: Demand Forecast
  const [storeId, setStoreId] = useState('STORE_001');
  const [itemId, setItemId] = useState('SKU_001');
  const [forecastData, setForecastData] = useState(null);
  
  // Tab 2: Pricing
  const [pricingStoreId, setPricingStoreId] = useState('STORE_002');
  const [pricingItemId, setPricingItemId] = useState('SKU_005');
  const [pricingData, setPricingData] = useState(null);
  
  // Tab 3: PO Gen
  const [poStoreId, setPoStoreId] = useState('STORE_003');
  const [poData, setPoData] = useState(null);

  const [loading, setLoading] = useState(false);

  // --- API CALLS ---
  const handleForecast = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/forecast', { store_id: storeId, item_id: itemId });
      setForecastData(res.data);
      addToast('Forecast generated successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate forecast', 'error');
    }
    setLoading(false);
  };

  const handlePricing = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/pricing/optimize', { store_id: pricingStoreId, item_id: pricingItemId });
      setPricingData(res.data);
      addToast('Pricing optimized', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to optimize pricing', 'error');
    }
    setLoading(false);
  };

  const handlePO = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/po/generate', { store_id: poStoreId });
      setPoData(res.data);
      addToast(`PO generated for ${poStoreId}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PO', 'error');
    }
    setLoading(false);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const renderOverview = () => (
    <motion.div initial="hidden" animate="show" variants={staggerContainer}>
      <motion.div variants={staggerContainer} className="kpi-grid">
        <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="kpi-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Total Active SKUs</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px' }}>12,450</div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '8px' }}>+4.2% from last week</div>
        </motion.div>
        <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="kpi-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Predicted Stockouts</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px', color: 'var(--warning)' }}>24</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>Action required in 7 days</div>
        </motion.div>
        <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="kpi-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Model Accuracy (MAE)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '4px', color: 'var(--accent-color)' }}>14.1</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>LightGBM Engine</div>
        </motion.div>
      </motion.div>

      <motion.div variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="chart-card" style={{ height: '350px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Inventory Breakdown</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUpVariant} whileHover={{ y: -5 }} className="chart-card" style={{ height: '350px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Revenue vs Costs (7D)</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--panel-bg-hover)' }} contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Bar dataKey="revenue" stackId="a" fill="var(--accent-color)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="cost" stackId="a" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </motion.div>
  );

const TypewriterText = ({ text }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.03 }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

  return (
    <div className="page-container" style={{ padding: '2.5rem' }}>
      <header className="header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {user?.name || user?.email?.split('@')[0] || 'Jane'}.
          </h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', height: '24px' }}>
            <TypewriterText text="I have analyzed 4,209 supply chain nodes today. System health is optimal." />
          </div>
        </div>
        <button className="btn btn-secondary" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'forecast', label: 'Demand Forecast' },
          { id: 'pricing', label: 'Dynamic Pricing' },
          { id: 'po', label: 'PO Generation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}

      {/* --- OTHER TABS (Simplified for brevity, preserving functionality) --- */}
      {activeTab === 'forecast' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card"
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Demand Forecasting Engine</h2>
          <div className="controls-bar">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-icon-wrapper">
                <MapPin size={16} />
                <input type="text" className="glass-input" value={storeId} onChange={e => setStoreId(e.target.value)} placeholder="Store ID" />
              </div>
              <div className="input-icon-wrapper">
                <Package size={16} />
                <input type="text" className="glass-input" value={itemId} onChange={e => setItemId(e.target.value)} placeholder="Item ID" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleForecast} disabled={loading}>
              {loading ? <MiniSpinner /> : <Activity size={16} />} {loading ? 'Running...' : 'Generate Forecast'}
            </button>
          </div>
          
          {forecastData && (
            <div style={{ marginTop: '2rem' }}>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Date</th><th>Historical Demand</th><th>Forecast (LightGBM)</th></tr>
                  </thead>
                  <tbody>
                    {forecastData.map((row, i) => (
                      <tr key={i}>
                        <td>{row.Date}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{row.Historical_Demand || 'N/A'}</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{row.Forecast ? row.Forecast.toFixed(1) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card"
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Dynamic Pricing Optimizer</h2>
          <div className="controls-bar">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-icon-wrapper">
                <MapPin size={16} />
                <input type="text" className="glass-input" value={pricingStoreId} onChange={e => setPricingStoreId(e.target.value)} placeholder="Store ID" />
              </div>
              <div className="input-icon-wrapper">
                <Package size={16} />
                <input type="text" className="glass-input" value={pricingItemId} onChange={e => setPricingItemId(e.target.value)} placeholder="Item ID" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handlePricing} disabled={loading}>
              {loading ? <MiniSpinner /> : <RefreshCw size={16} />} {loading ? 'Optimizing...' : 'Optimize Pricing'}
            </button>
          </div>

          {pricingData && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--panel-bg-hover)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Recommendation: {pricingData.Action}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Current Price</div><div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${pricingData.Current_Price.toFixed(2)}</div></div>
                <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Competitor Avg</div><div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${pricingData.Competitor_Avg.toFixed(2)}</div></div>
                <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Suggested Price</div><div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>${pricingData.Suggested_Price.toFixed(2)}</div></div>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pricingData.Reason}</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'po' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card"
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Automated PO Generation</h2>
          <div className="controls-bar">
            <div className="input-icon-wrapper">
              <MapPin size={16} />
              <input type="text" className="glass-input" value={poStoreId} onChange={e => setPoStoreId(e.target.value)} placeholder="Store ID" />
            </div>
            <button className="btn btn-primary" onClick={handlePO} disabled={loading}>
              {loading ? <MiniSpinner /> : <ArrowRight size={16} />} {loading ? 'Processing...' : 'Generate POs'}
            </button>
          </div>
          
          {poData && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <span className="badge badge-success">Status: {poData.Status}</span>
                <span className="badge badge-neutral">Generated at: {poData.Generated_At}</span>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Item ID</th><th>Predicted Shortage</th><th>Order Qty</th><th>Est. Cost</th></tr>
                  </thead>
                  <tbody>
                    {poData.Purchase_Orders.map((po, i) => (
                      <tr key={i}>
                        <td>{po.Item_ID}</td>
                        <td style={{ color: 'var(--warning)' }}>{po.Predicted_Shortage.toFixed(1)}</td>
                        <td style={{ fontWeight: 'bold' }}>{po.Order_Quantity}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>${po.Estimated_Cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Dashboard;
