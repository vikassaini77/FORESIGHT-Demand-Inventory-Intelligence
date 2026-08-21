import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Menu, Activity, Search, Sun, Moon, Globe, TrendingUp, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { PremiumLoader } from './PremiumLoader';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { user } = useUser();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Model re-training completed', time: '2m ago', type: 'success' },
    { id: 2, text: 'Inventory low for SKU-8992', time: '1h ago', type: 'warning' }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-Time Notification Simulator (WebSockets)
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL + '/ws/alerts');

    ws.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      const newNotif = {
        id: newAlert.id,
        text: newAlert.text,
        time: newAlert.time,
        type: newAlert.type
      };
      
      setNotifications(prev => [newNotif, ...prev].slice(0, 5)); // Keep last 5
      setUnreadCount(prev => prev + 1);
      
      // Fire global toast in real-time
      addToast(newAlert.text, newAlert.type === 'warning' ? 'error' : newAlert.type);
    };

    return () => ws.close();
  }, [addToast]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Search Mock Index
  const searchIndex = [
    { title: 'Q4 Demand Forecast Report', category: 'Report', path: '/reports' },
    { title: 'Pricing Model Health', category: 'Model', path: '/health' },
    { title: 'User Access Settings', category: 'Settings', path: '/settings' },
    { title: 'PO-8821 Delayed Alert', category: 'Alert', path: '/alerts' },
    { title: 'SKU-4412 Inventory Anomaly', category: 'Alert', path: '/alerts' },
    { title: 'Manage Data Scientists', category: 'Users', path: '/users' }
  ];

  const filteredResults = searchIndex.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchResultClick = (path, title) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    addToast(`Navigating to ${title}...`, 'info');
    navigate(path);
  };

  // Fake network delay for skeletons
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // 400ms delay to show skeleton
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    // In a real app, clear tokens here
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Globe, label: '3D Map', path: '/map' },
    { icon: TrendingUp, label: 'Live Analytics', path: '/live-analytics' },
    { icon: Terminal, label: 'Command Center', path: '/command-center' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: Activity, label: 'Model Health', path: '/health' },
    { icon: Bell, label: 'Alerts', path: '/alerts', badge: unreadCount > 0 ? unreadCount : null },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>N</div>
            <h2>FORESIGHT ML</h2>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="user-widget" onClick={() => navigate('/profile')}>
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </motion.div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          
          <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <div className="input-icon-wrapper" style={{ width: '100%' }}>
              <Search size={18} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search reports, models, alerts..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Glassmorphic Search Dropdown */}
            <AnimatePresence>
              {isSearchOpen && searchQuery.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'var(--panel-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 100
                  }}
                >
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result, i) => (
                      <div 
                        key={i}
                        onClick={() => handleSearchResultClick(result.path, result.title)}
                        style={{
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          cursor: 'pointer',
                          borderBottom: i !== filteredResults.length - 1 ? '1px solid var(--border-color)' : 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{result.title}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)' }}>{result.category}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            
            {/* Real-Time Notification Bell */}
            <div ref={notifContainerRef} style={{ position: 'relative' }}>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) setUnreadCount(0); // Mark as read when opening
                }}
                className="btn btn-secondary"
                style={{ padding: '0.6rem', borderRadius: '50%', position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: '-4px', right: '-4px',
                      background: 'var(--danger)', color: 'white',
                      fontSize: '0.65rem', fontWeight: 'bold',
                      width: '18px', height: '18px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--panel-bg)'
                    }}
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.button>

              {/* Notification Dropdown Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                      width: '320px', background: 'var(--panel-bg)',
                      backdropFilter: 'blur(30px)', border: '1px solid var(--border-color)',
                      borderRadius: '16px', boxShadow: '0 15px 50px rgba(0,0,0,0.5)',
                      overflow: 'hidden', zIndex: 101
                    }}
                  >
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Notifications</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', cursor: 'pointer' }} onClick={() => setNotifications([])}>Clear All</span>
                    </div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} style={{
                            padding: '1rem', borderBottom: '1px solid var(--border-color)',
                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                            background: notif.type === 'error' || notif.type === 'warning' ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                          }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', background: notif.type === 'error' || notif.type === 'warning' ? 'var(--danger)' : notif.type === 'success' ? 'var(--success)' : 'var(--accent-color)' }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{notif.text}</p>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{notif.time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          No new notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ padding: '0.6rem', borderRadius: '50%' }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={16} /> Logout
            </motion.button>
          </div>
        </header>

        {/* Dynamic Page Content with Framer Motion */}
        <div className="page-container">
          {isLoading ? (
            <PremiumLoader text="Loading Dashboard..." />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

export default Layout;
