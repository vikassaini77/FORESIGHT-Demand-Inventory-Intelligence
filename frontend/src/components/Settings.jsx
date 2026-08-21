import React, { useState } from 'react';
import { Save, Bell, Database, Shield, Zap, Settings as SettingsIcon, Sliders, Key, AlertOctagon, User, Building, MapPin, DollarSign, Smartphone, Laptop, Trash2, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import FileDropzone from './FileDropzone';

function Settings() {
  const { addToast } = useToast();
  const { user, setUser } = useUser();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // General State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState('Northbay Logistics');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState(true);

  // ML State
  const [threshold, setThreshold] = useState(20);
  const [autoPO, setAutoPO] = useState(true);
  const [driftAlerts, setDriftAlerts] = useState(true);
  
  // API State
  const [apiUrl, setApiUrl] = useState('https://api.erp.northbay.com/v1');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  // Security State
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro 16"', location: 'New York, USA', time: 'Active now', icon: <Laptop size={16} />, current: true },
    { id: 2, device: 'iPhone 14 Pro', location: 'New York, USA', time: 'Last active 2 hours ago', icon: <Smartphone size={16} />, current: false }
  ]);

  const markDirty = (setter, value) => {
    setter(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Update global user context
    setUser(prev => ({ ...prev, name, email }));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      addToast('Settings saved successfully', 'success');
    }, 1200);
  };

  const handleRollKey = () => {
    addToast('Generating new API key...', 'info');
    setTimeout(() => {
      addToast('Production API Key rotated successfully', 'success');
    }, 1500);
  };

  const handlePurge = () => {
    addToast('Purging ML cache...', 'error');
    setTimeout(() => {
      addToast('Cache purged successfully', 'success');
    }, 2000);
  };

  const revokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    addToast('Device session revoked', 'info');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={18} /> },
    { id: 'ml', label: 'Machine Learning', icon: <Zap size={18} /> },
    { id: 'api', label: 'API & Integrations', icon: <Database size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="page-container" style={{ padding: '2.5rem', maxWidth: '1200px', paddingBottom: '6rem' }}>
      
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1>Settings</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage platform configuration and machine learning parameters
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Settings Navigation Sidebar */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: activeTab === tab.id ? 'var(--panel-bg-hover)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ color: activeTab === tab.id ? 'var(--accent-color)' : 'inherit' }}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'general' && (
              <motion.div key="general" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--accent-color)" /> Profile Information
                  </h3>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--panel-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)', border: '2px solid var(--border-color)' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <FileDropzone 
                        title="Upload Company Logo" 
                        description="Drag and drop a new logo or avatar (PNG, JPG)" 
                        acceptedTypes="image/*"
                        onUploadSuccess={(file) => {
                          addToast('Profile avatar updated successfully!', 'success');
                          // In a real app, we would update the user context with the new image URL here
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" className="glass-input" value={name} onChange={(e) => markDirty(setName, e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="glass-input" value={email} onChange={(e) => markDirty(setEmail, e.target.value)} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Company Name</label>
                      <div className="input-icon-wrapper" style={{ width: '100%' }}>
                        <Building size={16} />
                        <input type="text" className="glass-input" style={{ width: '100%' }} value={company} onChange={(e) => markDirty(setCompany, e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="var(--accent-color)" /> Display & Regional
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Timezone</label>
                      <select className="glass-input" value={timezone} onChange={(e) => markDirty(setTimezone, e.target.value)} style={{ appearance: 'none' }}>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">GMT / BST</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Base Currency</label>
                      <div className="input-icon-wrapper" style={{ width: '100%' }}>
                        <DollarSign size={16} />
                        <select className="glass-input" style={{ width: '100%' }} value={currency} onChange={(e) => markDirty(setCurrency, e.target.value)}>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Date Format</label>
                      <select className="glass-input" value={dateFormat} onChange={(e) => markDirty(setDateFormat, e.target.value)} style={{ appearance: 'none', width: '100%' }}>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} color="var(--accent-color)" /> Notification Routing
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Configure where system alerts and ML anomaly reports are delivered.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Email Alerts</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Send critical alerts to {email}</div>
                      </div>
                      <label className="switch-container">
                        <input type="checkbox" className="switch-input" checked={emailAlerts} onChange={(e) => markDirty(setEmailAlerts, e.target.checked)} />
                        <span className="switch"></span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>SMS Notifications</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Send text messages for SEV-1 supply chain disruptions.</div>
                      </div>
                      <label className="switch-container">
                        <input type="checkbox" className="switch-input" checked={smsAlerts} onChange={(e) => markDirty(setSmsAlerts, e.target.checked)} />
                        <span className="switch"></span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Slack / Teams Integration</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Push automated ML retraining reports to the #mlops channel.</div>
                      </div>
                      <label className="switch-container">
                        <input type="checkbox" className="switch-input" checked={slackAlerts} onChange={(e) => markDirty(setSlackAlerts, e.target.checked)} />
                        <span className="switch"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ml' && (
              <motion.div key="ml" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={18} color="var(--accent-color)" /> Prediction Parameters
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>Critical Stockout Threshold</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Trigger an alert when inventory falls below this percentage of average demand.</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.1rem' }}>{threshold}%</div>
                      </div>
                      <input 
                        type="range" min="5" max="50" value={threshold} 
                        onChange={(e) => markDirty(setThreshold, e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="var(--accent-color)" /> Automation Triggers
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Auto-PO Generation</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px' }}>Automatically generate Purchase Orders nightly based on LightGBM forecast predictions.</div>
                      </div>
                      <label className="switch-container">
                        <input type="checkbox" className="switch-input" checked={autoPO} onChange={(e) => markDirty(setAutoPO, e.target.checked)} />
                        <span className="switch"></span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Model Drift Alerts</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px' }}>Receive immediate notifications if the prediction engine accuracy falls below 85%.</div>
                      </div>
                      <label className="switch-container">
                        <input type="checkbox" className="switch-input" checked={driftAlerts} onChange={(e) => markDirty(setDriftAlerts, e.target.checked)} />
                        <span className="switch"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div key="api" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={18} color="var(--accent-color)" /> ERP Integration
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Production API Endpoint</label>
                      <input type="text" className="glass-input" value={apiUrl} onChange={(e) => markDirty(setApiUrl, e.target.value)} style={{ width: '100%', maxWidth: '500px' }} />
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>The secure URL where FORESIGHT will push generated purchase orders.</div>
                    </div>
                    
                    <div className="form-group">
                      <label>API Key</label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                          <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input 
                            type={apiKeyVisible ? "text" : "password"} 
                            className="glass-input" 
                            value="YOUR_API_KEY_HERE_123456789" 
                            readOnly 
                            style={{ width: '100%', paddingLeft: '2.5rem', fontFamily: 'monospace' }} 
                          />
                        </div>
                        <button className="btn btn-secondary" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                          {apiKeyVisible ? 'Hide' : 'Reveal'}
                        </button>
                        <button className="btn btn-secondary" onClick={handleRollKey}>Roll Key</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} color="var(--accent-color)" /> Authentication
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px' }}>Require an authentication code in addition to your password.</div>
                    </div>
                    <label className="switch-container">
                      <input type="checkbox" className="switch-input" checked={twoFactor} onChange={(e) => markDirty(setTwoFactor, e.target.checked)} />
                      <span className="switch"></span>
                    </label>
                  </div>
                  <div className="form-group" style={{ maxWidth: '400px' }}>
                    <label>Change Password</label>
                    <input type="password" placeholder="Current Password" className="glass-input" style={{ marginBottom: '0.5rem', width: '100%' }} />
                    <input type="password" placeholder="New Password" className="glass-input" style={{ width: '100%' }} />
                    <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => addToast('Password changed successfully', 'success')}>Update Password</button>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Laptop size={18} color="var(--accent-color)" /> Active Sessions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sessions.map(session => (
                      <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--text-secondary)' }}>
                            {session.icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {session.device}
                              {session.current && <span style={{ fontSize: '0.65rem', background: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Current</span>}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{session.location} • {session.time}</div>
                          </div>
                        </div>
                        {!session.current && (
                          <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => revokeSession(session.id)}>
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertOctagon size={18} /> Danger Zone
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Destructive actions related to your FORESIGHT deployment. These actions are irreversible.
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Purge ML Cache</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Clear all cached forecast predictions and model weights.</div>
                    </div>
                    <button className="btn" style={{ background: 'var(--danger)', color: 'white', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={handlePurge}>
                      Purge Cache
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Floating Unsaved Changes Bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--panel-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-color)',
              padding: '1rem 1.5rem',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--accent-color) inset',
              zIndex: 100
            }}
          >
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>You have unsaved changes</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn" 
                style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                onClick={() => setIsDirty(false)}
              >
                Discard
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}
              >
                {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
