import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Box, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addToast } = useToast();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      type: 'text', 
      text: 'Hello. I am FORESIGHT, your AI Command Center. I am currently monitoring 42 global nodes. How can I assist you today?' 
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleActionClick = (actionName) => {
    addToast(`Executing command: ${actionName}...`, 'info');
    setTimeout(() => {
      addToast(`${actionName} completed successfully.`, 'success');
    }, 1500);
  };

  // Mock NLP Engine
  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('inventory') || lowerInput.includes('stock') || lowerInput.includes('sku')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'widget',
        widgetType: 'inventory',
        text: 'I detected a critical shortage in our NY Facility. Here is the current status:'
      };
    }
    
    if (lowerInput.includes('forecast') || lowerInput.includes('predict') || lowerInput.includes('q4')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'widget',
        widgetType: 'forecast',
        text: 'Based on current ML models, here is the projected Q4 demand spike:'
      };
    }
    
    if (lowerInput.includes('shipment') || lowerInput.includes('delay') || lowerInput.includes('truck')) {
      return {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'widget',
        widgetType: 'shipment',
        text: 'Alert: Shipment PO-8821 is currently delayed by 4 hours due to weather.'
      };
    }

    return {
      id: Date.now() + 1,
      sender: 'ai',
      type: 'text',
      text: "I've logged that request. My models are continuously optimizing the network. Would you like me to run a full diagnostic?"
    };
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMsg = { id: Date.now(), sender: 'user', type: 'text', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and voice response
    setTimeout(() => {
      const response = generateAIResponse(newMsg.text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1800);
  };

  // Render Rich UI Widgets inside the chat
  const renderWidget = (msg) => {
    if (msg.widgetType === 'inventory') {
      return (
        <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--danger)', padding: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '0.5rem' }}>
            <AlertTriangle size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>SKU-4412 Critical</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>Current Stock: 14 units (Below 50 minimum)</p>
          <button 
            onClick={() => handleActionClick('Emergency Restock SKU-4412')}
            style={{ width: '100%', padding: '0.5rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Zap size={14} /> RESTOCK NOW
          </button>
        </div>
      );
    }
    
    if (msg.widgetType === 'forecast') {
      return (
        <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '1rem' }}>
            <TrendingUp size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Q4 Demand Prediction</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', marginBottom: '0.5rem' }}>
            {[40, 60, 45, 90, 75].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ flex: 1, background: h > 80 ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)', borderRadius: '4px 4px 0 0' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <span>Oct</span><span>Nov</span><span style={{color: 'var(--accent-color)'}}>Dec</span>
          </div>
        </div>
      );
    }

    if (msg.widgetType === 'shipment') {
      return (
        <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            <Box size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>PO-8821 Status</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>ETA: 14:00 (Delayed)</span>
            <span style={{ padding: '2px 6px', background: 'rgba(234, 88, 12, 0.2)', color: 'var(--accent-color)', borderRadius: '4px' }}>In Transit</span>
          </div>
          <button 
            onClick={() => handleActionClick('Reroute PO-8821')}
            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            REROUTE SHIPMENT
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Floating Orb / Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-color), #fbbf24)',
          border: '2px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 8px 32px var(--accent-glow)',
          zIndex: 9999
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isOpen ? <X color="white" size={28} /> : <Sparkles color="white" size={28} />}
        </motion.div>
      </motion.button>

      {/* Advanced AI Command Center Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '400px',
              height: '600px',
              background: 'rgba(15, 23, 42, 0.75)', // Deep glass
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9998
            }}
          >
            {/* Animated Header (Voice/Thinking visualizer) */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, rgba(234, 88, 12, 0.05), transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Sparkles size={18} color="var(--accent-color)" />
                  {/* Outer pulse ring */}
                  <motion.div 
                    animate={isTyping ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0 }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: '2px solid var(--accent-color)' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#fff', letterSpacing: '0.5px' }}>FORESIGHT</h3>
                  <span style={{ fontSize: '0.75rem', color: isTyping ? 'var(--accent-color)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isTyping ? 'Processing intent...' : 'Command Center Ready'}
                  </span>
                </div>
              </div>
              
              {/* Voice Waveform visualizer */}
              {isTyping && (
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '20px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['4px', '16px', '4px'] }}
                      transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: '3px', background: 'var(--accent-color)', borderRadius: '2px' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {messages.map(msg => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-color), #ea580c)' : 'rgba(255,255,255,0.03)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(234, 88, 12, 0.2)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                  
                  {/* Render Widget if it's a rich response */}
                  {msg.type === 'widget' && renderWidget(msg)}
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Ask FORESIGHT (e.g. 'inventory status')..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ 
                    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', padding: '0.85rem 1rem', color: '#fff', outline: 'none',
                    fontSize: '0.9rem', transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <button 
                type="submit" 
                disabled={!input.trim()} 
                style={{ 
                  background: input.trim() ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
                  border: 'none', borderRadius: '50%', width: '46px', height: '46px', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  color: input.trim() ? '#fff' : 'var(--text-secondary)', 
                  cursor: input.trim() ? 'pointer' : 'not-allowed', 
                  transition: 'all 0.2s',
                  boxShadow: input.trim() ? '0 0 15px var(--accent-glow)' : 'none'
                }}
              >
                <Send size={18} style={{ marginLeft: '2px' }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
