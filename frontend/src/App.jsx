import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { UserProvider, useUser } from './context/UserContext';

// Import Auth Components
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Terms from './components/Terms';
import Landing from './components/Landing';

// Import App Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import Alerts from './components/Alerts';
import ModelHealth from './components/ModelHealth';
import Map from './components/Map';
import LiveAnalytics from './components/LiveAnalytics';
import CommandCenter from './components/CommandCenter';

import PremiumBackground from './components/PremiumBackground';
import AICopilot from './components/AICopilot';

function MainApp() {
  const { user, loading } = useUser();
  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/dashboard" element={
          isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/reports" element={
          isAuthenticated ? <Layout><Reports /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/users" element={
          isAuthenticated ? <Layout><UserManagement /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/alerts" element={
          isAuthenticated ? <Layout><Alerts /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/health" element={
          isAuthenticated ? <Layout><ModelHealth /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/map" element={
          isAuthenticated ? <Layout><Map /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/live-analytics" element={
          isAuthenticated ? <Layout><LiveAnalytics /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/command-center" element={
          isAuthenticated ? <Layout><CommandCenter /></Layout> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PremiumBackground />
        <ToastProvider>
          <AICopilot />
          <MainApp />
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
