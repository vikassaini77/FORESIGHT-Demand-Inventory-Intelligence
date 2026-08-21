import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Bell, Activity, Settings, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/alerts', label: 'Alerts', icon: <Bell size={18} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
    { path: '/health', label: 'Model Health', icon: <Activity size={18} /> },
    { path: '/users', label: 'Users', icon: <Users size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>FORESIGHT</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
          Enterprise Edition
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</div>
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === 4 && <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '16px', marginBottom: '8px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administration</div>}
            <NavLink 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>

      <div className="user-widget" onClick={() => navigate('/profile')}>
        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
        <LogOut size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
      </div>
    </aside>
  );
}

export default Sidebar;
