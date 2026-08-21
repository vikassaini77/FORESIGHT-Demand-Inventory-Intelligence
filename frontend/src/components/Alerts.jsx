import React, { useState } from 'react';
import { AlertTriangle, Info, BellRing, TrendingDown, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function Alerts() {
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Critical Stockout Risk for SKU_18 in East Warehouse', time: '10 mins ago', unread: true, icon: <AlertTriangle size={18} color="#ef4444" /> },
    { id: 2, type: 'warning', message: 'Competitor Price Dropped by 10% for SKU_9', time: '2 hours ago', unread: true, icon: <TrendingDown size={18} color="#f59e0b" /> },
    { id: 3, type: 'info', message: 'Nightly Model Retraining Completed (MAE: 14.2)', time: '8 hours ago', unread: false, icon: <Info size={18} color="#3b82f6" /> },
    { id: 4, type: 'system', message: 'PO Batch PO-BATCH-004 sent successfully to ERP.', time: '1 day ago', unread: false, icon: <BellRing size={18} color="#10b981" /> },
  ]);

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, unread: false })));
    addToast('All alerts marked as read', 'success');
  };

  const handleAlertClick = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, unread: false } : a));
  };

  const handleReview = (e, alert) => {
    e.stopPropagation(); // Prevent marking as read when clicking review
    handleAlertClick(alert.id);
    addToast(`Initiating review protocol for: ${alert.message}`, 'info');
    
    // Simulate resolution after delay
    setTimeout(() => {
      addToast('Review complete. Action logged.', 'success');
    }, 2000);
  };

  return (
    <div className="page-container animate-fade-up">
      <header className="header">
        <div>
          <h1>Alerts & Notifications</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            System events and AI-generated warnings
          </div>
        </div>
        <button onClick={handleMarkAllRead} className="btn btn-secondary">
          <Check size={16} /> Mark all as read
        </button>
      </header>

      <div className="chart-card" style={{ maxWidth: '800px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>
          Recent Activity
        </div>
        
        {alerts.map((alert, index) => (
          <div key={alert.id} 
          onClick={() => handleAlertClick(alert.id)}
          style={{ 
            display: 'flex', 
            gap: '16px', 
            padding: '1.25rem 1.5rem', 
            borderBottom: index < alerts.length - 1 ? '1px solid var(--border-color)' : 'none',
            background: alert.unread ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
            position: 'relative',
            transition: 'background 0.2s',
            cursor: 'pointer'
          }}
          className="hover:bg-white/5"
          >
            {alert.unread && (
              <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '3px', background: 'var(--accent-color)' }} />
            )}
            
            <div style={{ marginTop: '2px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '50%', height: 'fit-content' }}>
              {alert.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: alert.unread ? '600' : '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {alert.message}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {alert.time}
              </div>
            </div>
            
            {alert.type === 'critical' && (
              <button 
                onClick={(e) => handleReview(e, alert)}
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', height: 'fit-content' }}
              >
                Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
