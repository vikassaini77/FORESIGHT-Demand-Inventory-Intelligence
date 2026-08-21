import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, Mail, Lock, Server, CheckCircle2, Star, Zap, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AuthBackground from './AuthBackground';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (email && password) {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const features = [
    { icon: <Zap size={24} color="var(--accent-color)" />, title: 'Real-time Analytics', desc: 'Process millions of data points instantly with our ultra-fast Edge ML.' },
    { icon: <Shield size={24} color="var(--accent-color)" />, title: 'Enterprise Security', desc: 'Bank-grade encryption and SOC2 compliant infrastructure for your peace of mind.' },
    { icon: <Star size={24} color="var(--accent-color)" />, title: 'Predictive Insights', desc: 'Anticipate supply chain disruptions before they happen using FORESIGHT AI.' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#050505', overflow: 'hidden' }}>
      
      {/* LEFT COLUMN: Visuals / Marketing (Hidden on Mobile) */}
      <div className="login-visual-panel" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', padding: '4rem', zIndex: 1 }}>
        <AuthBackground />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(5,5,5,0.9) 100%)', zIndex: -1 }} />
        
        {/* Brand */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 24px var(--accent-glow)' }}>
            <Activity color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>FORESIGHT</h1>
        </motion.div>

        {/* Feature Carousel */}
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 10, maxWidth: '500px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Intelligence at scale.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3rem' }}>
              Transform your raw data into actionable supply chain intelligence with the world's most advanced retail analytics platform.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{f.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Metrics Widget (FAANG style) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', right: '10%', top: '30%', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid var(--accent-color)', borderTopColor: 'transparent', animation: 'spin 2s linear infinite' }} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>System Status</div>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>Optimal Performance</div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Auth Form */}
      <div style={{ width: '100%', maxWidth: '600px', background: '#050505', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', zIndex: 2, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Log in to access your dashboard.</p>
          </div>
          
          {/* SSO Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <button style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }} onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }} onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00a4ef"/></svg>
              Microsoft
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or continue with email</span>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> {errorMsg}
            </motion.div>
          )}
          
          <motion.form variants={containerVariants} initial="hidden" animate="show" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div variants={itemVariants} style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                  onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required 
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--accent-color)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Forgot Password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                  onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </motion.div>
            
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              style={{ 
                padding: '1.1rem', fontSize: '1.05rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)',
                color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600,
                boxShadow: '0 10px 25px rgba(234, 88, 12, 0.25)',
                transition: 'all 0.2s'
              }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>Sign In to Workspace <ArrowRight size={18} /></>
              )}
            </motion.button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Request Access</Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Add CSS for media query to hide left panel on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .login-visual-panel {
            display: none !important;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;
