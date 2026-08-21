import React from 'react';
import { motion } from 'framer-motion';

export function PremiumLoader({ text = "Processing data..." }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '3rem',
      height: '100%',
      width: '100%'
    }}>
      <div style={{ position: 'relative', width: '60px', height: '60px', marginBottom: '1.5rem' }}>
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-color)',
            borderRightColor: 'var(--accent-color)',
            opacity: 0.8
          }}
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '8px', left: '8px', right: '8px', bottom: '8px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderBottomColor: '#8b5cf6',
            borderLeftColor: '#8b5cf6',
            opacity: 0.8
          }}
        />

        {/* Center Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '24px', left: '24px',
            width: '12px', height: '12px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.9rem', 
          fontWeight: 500, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export function MiniSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: 'currentColor',
        borderRightColor: 'currentColor',
        display: 'inline-block'
      }}
    />
  );
}
