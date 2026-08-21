import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Mail, Lock, User, CheckCircle2, ShieldCheck, Database, Server, Cpu, Building, Briefcase } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AuthBackground from './AuthBackground';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { signup } = useUser();

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let label = '';
    let color = '';
    
    if (pass.length === 0) {
      label = ''; color = 'transparent';
    } else if (score <= 1) {
      label = 'Weak'; color = '#ef4444';
    } else if (score === 2 || score === 3) {
      label = 'Good'; color = '#eab308';
    } else {
      label = 'Strong'; color = '#22c55e';
    }
    
    setPasswordStrength({ score, label, color });
    setPassword(pass);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    
    if (name && email && password && terms) {
      setLoading(true);
      try {
        await signup(name, email, password, company, jobTitle);
        setStep(2);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setErrorMsg(err.response?.data?.detail || 'Registration failed.');
        setLoading(false);
      }
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
    { icon: <Database size={24} color="var(--accent-color)" />, title: 'Unified Data Lake', desc: 'Connect all your inventory and sales channels instantly.' },
    { icon: <Cpu size={24} color="var(--accent-color)" />, title: 'AI-Powered Forecasting', desc: 'Achieve 98% prediction accuracy with our ML engine.' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#050505', overflow: 'hidden' }}>
      
      {/* LEFT COLUMN: Visuals / Marketing (Hidden on Mobile) */}
      <div className="signup-visual-panel" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', padding: '4rem', zIndex: 1 }}>
        <AuthBackground />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(5,5,5,0.9) 100%)', zIndex: -1 }} />
        
        {/* Brand */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 24px var(--accent-glow)' }}>
            <Activity color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>FORESIGHT</h1>
        </motion.div>

        {/* Feature Text */}
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 10, maxWidth: '500px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Deploy your workspace.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3rem' }}>
              Join Fortune 500 retailers who rely on FORESIGHT to optimize their global supply chains.
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
      </div>

      {/* RIGHT COLUMN: Auth Form */}
      <div style={{ width: '100%', maxWidth: '600px', background: '#050505', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', zIndex: 2, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
          
          {step === 1 ? (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Create Account</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Register for an enterprise trial.</p>
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
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or register with email</span>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} /> {errorMsg}
                </motion.div>
              )}
              
              <motion.form variants={containerVariants} initial="hidden" animate="show" onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                      onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                      onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Jane Doe"
                      required 
                    />
                  </div>
                </motion.div>

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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Company</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text" 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                        onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)} 
                        placeholder="Acme Corp"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Job Title</label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text" 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                        onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)} 
                        placeholder="Data Analyst"
                      />
                    </div>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                    {passwordStrength.label && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="password" 
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                      onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                      onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      value={password} 
                      onChange={(e) => checkPasswordStrength(e.target.value)} 
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                  
                  {/* Password Strength Meter */}
                  <div style={{ display: 'flex', gap: '4px', height: '4px', width: '100%' }}>
                    {[1, 2, 3, 4].map(level => (
                      <div 
                        key={level} 
                        style={{ 
                          flex: 1, 
                          borderRadius: '2px', 
                          background: passwordStrength.score >= level ? passwordStrength.color : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s'
                        }} 
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} style={{ position: 'relative' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="password" 
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' }}
                      onFocus={e => { e.target.style.border = '1px solid var(--accent-color)'; e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                      onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.5rem' }}>
                  <div 
                    onClick={() => setTerms(!terms)}
                    style={{ 
                      width: '20px', height: '20px', borderRadius: '6px', border: terms ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                      background: terms ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {terms && <CheckCircle2 size={14} color="#fff" />}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    I agree to the <Link to="/terms" style={{ color: '#fff', textDecoration: 'none' }}>Terms</Link> & <Link to="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</Link>
                  </span>
                </motion.div>
                
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: terms ? 1.01 : 1 }} 
                  whileTap={{ scale: terms ? 0.98 : 1 }} 
                  type="submit" 
                  style={{ 
                    padding: '1.1rem', fontSize: '1.05rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                    background: terms ? 'linear-gradient(135deg, var(--accent-color), #fbbf24)' : 'rgba(255,255,255,0.05)',
                    color: terms ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '12px', cursor: terms ? 'pointer' : 'not-allowed', fontWeight: 600,
                    boxShadow: terms ? '0 10px 25px rgba(234, 88, 12, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  disabled={!terms || loading}
                >
                  {loading ? (
                    <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <>Create Workspace <ArrowRight size={18} /></>
                  )}
                </motion.button>
              </motion.form>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
              </motion.div>
            </>
          ) : (
            // Provisioning State
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}
              >
                <ShieldCheck size={40} color="#4ade80" />
              </motion.div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>Provisioning Workspace</h2>
              
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.5)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #ea580c, #fbbf24)' }}
                />
              </div>
              
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.95rem' }}
              >
                Initializing Machine Learning engines...
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .signup-visual-panel {
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

export default Signup;
