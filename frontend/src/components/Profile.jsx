import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, Save, Camera, Clock, Smartphone, Key, Bell, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

export default function Profile({ setAuth }) {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  const handleLogout = () => {
    setAuth(false);
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page-container" style={{ padding: '2.5rem' }}>
      
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}
      >
        <div>
          <h1>User Profile</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your FORESIGHT account settings and preferences
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </motion.header>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        
        {/* Left Column: Avatar & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <motion.div variants={itemVariants} className="chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  fontSize: '3rem', fontWeight: 'bold', color: '#fff',
                  boxShadow: '0 8px 24px var(--accent-glow)'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </motion.div>
              <button style={{
                position: 'absolute', bottom: '0', right: '0',
                background: 'var(--panel-bg)', border: '1px solid var(--border-color)',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: 'var(--text-primary)', cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                <Camera size={16} />
              </button>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.name}</h2>
            <div className="badge badge-success" style={{ marginTop: '0.5rem', gap: '4px', padding: '6px 12px' }}>
              <Shield size={14} /> {user.role}
            </div>
            
            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '1.5rem 0' }} />
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>● Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Oct 2023</span>
              </div>
            </div>
          </motion.div>

          {/* Security Summary */}
          <motion.div variants={itemVariants} className="chart-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--accent-color)" /> Security
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'var(--panel-bg-hover)', borderRadius: '8px', color: 'var(--text-secondary)' }}><Key size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Password</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated 3 months ago</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Change</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'var(--panel-bg-hover)', borderRadius: '8px', color: 'var(--text-secondary)' }}><Smartphone size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>2FA Authentication</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Enabled (App)</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Settings Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <motion.div variants={itemVariants} className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Personal Information</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Update your contact details and preferences.</div>
              </div>
              <button 
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setEditForm(user);
                    setIsEditing(true);
                  }
                }}
                className={isEditing ? "btn btn-primary" : "btn btn-secondary"}
              >
                {isEditing ? <><Save size={16} /> Save Changes</> : 'Edit Profile'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label><User size={14} /> Full Name</label>
                {isEditing ? (
                  <input type="text" className="glass-input" style={{ width: '100%' }} value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                ) : (
                  <div style={{ padding: '0.65rem 1rem', background: 'var(--panel-bg-hover)', borderRadius: '8px', border: '1px solid transparent', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.name}</div>
                )}
              </div>
              
              <div className="form-group">
                <label><Mail size={14} /> Email Address</label>
                {isEditing ? (
                  <input type="email" className="glass-input" style={{ width: '100%' }} value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                ) : (
                  <div style={{ padding: '0.65rem 1rem', background: 'var(--panel-bg-hover)', borderRadius: '8px', border: '1px solid transparent', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.email}</div>
                )}
              </div>

              <div className="form-group">
                <label><Smartphone size={14} /> Phone Number</label>
                {isEditing ? (
                  <input type="text" className="glass-input" style={{ width: '100%' }} value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                ) : (
                  <div style={{ padding: '0.65rem 1rem', background: 'var(--panel-bg-hover)', borderRadius: '8px', border: '1px solid transparent', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.phone}</div>
                )}
              </div>

              <div className="form-group">
                <label><Clock size={14} /> Timezone</label>
                {isEditing ? (
                  <select className="glass-select" style={{ width: '100%', paddingLeft: '1rem' }} value={editForm.timezone} onChange={(e) => setEditForm({...editForm, timezone: e.target.value})}>
                    <option value="PST (UTC-8)">PST (UTC-8)</option>
                    <option value="EST (UTC-5)">EST (UTC-5)</option>
                    <option value="UTC (UTC+0)">UTC (UTC+0)</option>
                  </select>
                ) : (
                  <div style={{ padding: '0.65rem 1rem', background: 'var(--panel-bg-hover)', borderRadius: '8px', border: '1px solid transparent', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user.timezone}</div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="chart-card">
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Notification Preferences</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Control how you receive alerts from FORESIGHT ML.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Model Drift Alerts', desc: 'Get notified when accuracy drops below threshold', icon: <Activity size={18} /> },
                { title: 'Inventory Stockouts', desc: 'Daily summary of predicted critical stockouts', icon: <Bell size={18} /> },
                { title: 'System Updates', desc: 'Platform maintenance and feature releases', icon: <Shield size={18} /> },
              ].map((pref, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '10px', background: 'var(--panel-bg-hover)', borderRadius: '10px', color: 'var(--accent-color)' }}>
                      {pref.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{pref.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{pref.desc}</div>
                    </div>
                  </div>
                  <label className="switch-container">
                    <input type="checkbox" className="switch-input" defaultChecked={i !== 2} />
                    <span className="switch"></span>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
