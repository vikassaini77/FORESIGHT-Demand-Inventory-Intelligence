import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, TrendingUp, Zap, Box, Database, Shield, Layers } from 'lucide-react';

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', minHeight: '100vh', position: 'relative' }}>
      
      {/* Dynamic Background Mesh Effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(100px)' }}></div>
        <div style={{ position: 'absolute', top: '10%', right: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(120px)' }}></div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px var(--accent-glow)' }}>
            <Activity color="white" size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>FORESIGHT</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
          <a href="#engine" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>The Engine</a>
          <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Sign In</button>
          <button onClick={() => navigate('/signup')} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="badge badge-warning" style={{ marginBottom: '2rem', padding: '8px 16px', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
            <SparklesIcon size={14} style={{ marginRight: '8px' }} /> FORESIGHT Engine 2.0 is now live
          </div>
          
          <h1 style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Predict the Future.<br/>
            <span style={{ background: 'linear-gradient(to right, #fbbf24, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Optimize the Present.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, marginBottom: '3rem' }}>
            The industry-standard dual-engine ML platform for retail. Dynamically optimize pricing and predict inventory stockouts with sub-millisecond latency.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/signup')} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start your free trial <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Abstract 3D Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            marginTop: '5rem', width: '100%', maxWidth: '1000px', height: '480px', 
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', 
            borderRadius: '16px 16px 0 0', border: '1px solid rgba(255,255,255,0.15)', 
            borderBottom: 'none', boxShadow: '0 -30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)', 
            overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* macOS Window Header */}
          <div style={{ height: '32px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ed6a5e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f4bf4f' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#61c554' }}></div>
          </div>

          {/* Mock UI Elements inside the "Dashboard" */}
          <div style={{ display: 'flex', flex: 1, padding: '1.5rem', gap: '1.5rem' }}>
            
            {/* Sidebar Mock */}
            <div style={{ width: '220px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--accent-color)', borderRadius: '6px' }}></div>
                <div style={{ height: '14px', width: '100px', background: 'rgba(255,255,255,0.8)', borderRadius: '4px' }}></div>
              </div>
              {[
                { w: '80%', o: 1 }, { w: '60%', o: 0.4 }, { w: '70%', o: 0.4 }, { w: '50%', o: 0.4 }, { w: '65%', o: 0.4 }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', background: `rgba(255,255,255,${item.o})`, borderRadius: '4px' }}></div>
                  <div style={{ height: '12px', width: item.w, background: `rgba(255,255,255,${item.o * 0.5})`, borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>

            {/* Main Content Area Mock */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* KPI Cards */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flex: 1, height: '120px', background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(0,0,0,0.3))', borderRadius: '12px', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue Predicted</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>$2.4M</div>
                  <div style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>+14.2% vs last month</div>
                  <div style={{ position: 'absolute', right: '-10px', top: '20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(10px)' }}></div>
                </div>
                
                <div style={{ flex: 1, height: '120px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(0,0,0,0.3))', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>Stockout Risk Detected</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>14 items</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>AI resolving via Auto-PO</div>
                </div>
              </div>

              {/* Large Chart Area */}
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Demand Forecast (Next 30 Days)</div>
                
                {/* SVG Graph */}
                <svg viewBox="0 0 500 150" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'calc(100% - 3rem)' }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[20, 60, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}

                  <path d="M0,150 L0,100 C50,110 100,60 150,70 C200,80 250,30 300,40 C350,50 400,20 450,10 L500,0 L500,150 Z" fill="url(#chartGrad)"/>
                  <path d="M0,100 C50,110 100,60 150,70 C200,80 250,30 300,40 C350,50 400,20 450,10 L500,0" fill="none" stroke="var(--accent-color)" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(234, 88, 12, 0.4))"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '8rem 2rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeInWhenVisible>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Built for Scale</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to run a modern, data-driven retail operation, powered by dual LightGBM and XGBoost engines.</p>
            </div>
          </FadeInWhenVisible>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <TrendingUp size={24} color="var(--accent-color)" />, title: 'Demand Forecasting', desc: 'LightGBM-powered time series analysis predicting item-store level stockouts with 94% accuracy.' },
              { icon: <Zap size={24} color="var(--accent-color)" />, title: 'Dynamic Pricing', desc: 'Real-time XGBoost price optimization reacting to competitor trends and internal inventory elasticity.' },
              { icon: <Box size={24} color="var(--accent-color)" />, title: 'Auto-PO Generation', desc: 'Close the loop automatically. The system writes and dispatches Purchase Orders to your ERP nightly.' },
              { icon: <Database size={24} color="var(--accent-color)" />, title: 'Massive Data Ingestion', desc: 'Process millions of rows of historical sales data and holidays instantly through optimized Parquet pipelines.' },
              { icon: <Layers size={24} color="var(--accent-color)" />, title: 'Dual-Engine Architecture', desc: 'Decoupled forecasting and pricing models ensuring no cross-contamination of feature importance.' },
              { icon: <Shield size={24} color="var(--accent-color)" />, title: 'Enterprise Security', desc: 'End-to-end encryption, SAML SSO, and role-based access control out of the box.' },
            ].map((feat, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.1}>
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(234, 88, 12, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>{feat.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(100px)', zIndex: -1 }}></div>
        <FadeInWhenVisible>
          <h2 style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Ready to optimize?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>Join hundreds of retail networks already maximizing their margins with FORESIGHT.</p>
          <button onClick={() => navigate('/signup')} className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem', borderRadius: '12px' }}>Start Building for Free</button>
        </FadeInWhenVisible>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 4rem 2rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} /> FORESIGHT ML by NorthBay
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a>
        </div>
      </footer>

    </div>
  );
}

// Inline Icon
const SparklesIcon = ({ size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
