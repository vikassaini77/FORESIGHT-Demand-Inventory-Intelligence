import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AuthBackground() {
  // Massive background words telling the story of the platform
  const backgroundKeywords = [
    "PREDICTIVE PRICING",
    "SUPPLY CHAIN ML",
    "DEMAND FORECASTING",
    "INVENTORY OPTIMIZATION",
    "ANOMALY DETECTION"
  ];

  // Ghost widgets telling the story through mock data
  const ghostWidgets = [
    { title: 'SKU-8921 Pricing Optimized', val: '$14.99', sub: 'Confidence: 98.2%', color: '#fbbf24', icon: TrendingUp, delay: 0, yOffset: '15%' },
    { title: 'Demand Surge Detected', val: '+45%', sub: 'Electronics Category (NY)', color: '#ea580c', icon: Zap, delay: 2, yOffset: '35%' },
    { title: 'Auto-PO Generated', val: '4,200 units', sub: 'Dallas Fulfillment Center', color: '#4ade80', icon: ShieldCheck, delay: 4, yOffset: '60%' },
    { title: 'Supply Route Anomaly', val: 'Route 4A', sub: 'Rerouting via Secondary...', color: '#ef4444', icon: AlertTriangle, delay: 6, yOffset: '80%' },
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      
      {/* 1. Subtle grid base */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
      
      {/* 2. Massive Faint Scrolling Typography */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', opacity: 0.03 }}>
        {backgroundKeywords.map((word, i) => (
          <motion.div
            key={i}
            animate={{ x: i % 2 === 0 ? ['100vw', '-100vw'] : ['-100vw', '100vw'] }}
            transition={{ duration: 30 + (i * 5), repeat: Infinity, ease: 'linear' }}
            style={{ whiteSpace: 'nowrap', fontSize: '8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}
          >
            {word} • {word} • {word}
          </motion.div>
        ))}
      </div>

      {/* 3. The "ML Neural Network" Core (Abstract glowing connections) */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', opacity: 0.2 }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(0,0,0,0) 60%)', filter: 'blur(80px)' }}
        />
      </div>

      {/* 4. Storytelling Floating "Ghost" Widgets */}
      {/* We make these highly transparent so they don't distract from the central login, but act as atmospheric storytelling */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {ghostWidgets.map((widget, i) => {
          const Icon = widget.icon;
          return (
            <motion.div
              key={i}
              initial={{ x: '-20vw', opacity: 0 }}
              animate={{ 
                x: ['-20vw', '110vw'], 
                opacity: [0, 0.8, 0.8, 0],
                y: [0, (i % 2 === 0 ? 50 : -50), 0]
              }}
              transition={{ duration: 25, repeat: Infinity, delay: widget.delay, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: widget.yOffset,
                width: '320px',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${widget.color}22, rgba(0,0,0,0.5))`, border: `1px solid ${widget.color}40`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon color={widget.color} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{widget.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{widget.sub}</div>
                  <div style={{ color: widget.color, fontWeight: 700, fontSize: '0.9rem' }}>{widget.val}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 5. Live ML Data Ticker Tape (Bottom of screen) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ whiteSpace: 'nowrap', display: 'flex', gap: '40px', padding: '0 20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace' }}
        >
          <span>[SYSTEM] Model Retraining Complete: 98.4% Acc</span>
          <span style={{ color: '#4ade80' }}>[PO-8821] Approved by Agent</span>
          <span>[PRICE-OPT] 1,204 SKUs updated in EU-WEST</span>
          <span style={{ color: '#ea580c' }}>[ALERT] Capacity constrained at Facility-9</span>
          <span>[FORECAST] Q3 Demand projections updated</span>
        </motion.div>
      </div>

    </div>
  );
}
