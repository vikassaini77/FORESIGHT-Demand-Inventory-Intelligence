import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, User, Bot, Loader2, Maximize, Zap, FileText, Map, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import FileDropzone from './FileDropzone';

const CommandCenter = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'FORESIGHT OS Initialized. Global data streams connected. How can I assist your operations today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToast } = useToast();
  const [floorplanStatus, setFloorplanStatus] = useState('idle'); // idle, uploaded

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', { message: userMsg.text });
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, sender: 'bot', text: 'Connection to FORESIGHT mainframe failed.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Predict Q4 Stockouts",
    "Show optimal pricing for Category A",
    "Generate Purchase Orders"
  ];

  return (
    <div className="page-container" style={{ padding: '0', maxWidth: 'none', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
        {/* Left Column: Chat */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', background: 'rgba(5, 5, 5, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(234, 88, 12, 0.1)', borderRadius: '8px', color: 'var(--accent-color)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>FORESIGHT COMMAND CENTER</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
              System Nominal
            </span>
          </div>
        </div>
        <Maximize size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              gap: '16px',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(234, 88, 12, 0.1)',
              color: msg.sender === 'user' ? '#fff' : 'var(--accent-color)',
              border: `1px solid ${msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(234, 88, 12, 0.3)'}`
            }}>
              {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div style={{
              maxWidth: '75%',
              padding: '16px 20px',
              borderRadius: '16px',
              background: msg.sender === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
              color: '#fff',
              border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
              borderTopRightRadius: msg.sender === 'user' ? 0 : '16px',
              borderTopLeftRadius: msg.sender === 'user' ? '16px' : 0,
              fontSize: '0.95rem',
              lineHeight: 1.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(234, 88, 12, 0.1)', color: 'var(--accent-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
              <Bot size={20} />
            </div>
            <div style={{ padding: '16px 20px', borderRadius: '16px', borderTopLeftRadius: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Loader2 size={20} className="spin" color="var(--accent-color)" />
              <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
        
        {/* Suggestion Chips */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {suggestions.map((sug, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(sug)}
              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} color="var(--accent-color)" />
              {sug}
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: '14px', borderRadius: '12px' }}>
            <FileText size={20} />
          </button>
          <input
            type="text"
            className="glass-input"
            placeholder="Query FORESIGHT..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '16px 24px', fontSize: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}
            disabled={isLoading}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            style={{ padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Execute <Send size={18} />
          </button>
        </div>
      </div>
    </div>
      
    {/* Right Column: Spatial Ingestion */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="chart-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Map size={18} color="var(--accent-color)" /> Spatial Analysis Engine
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Upload store floorplans or CAD files to simulate customer foot-traffic and optimize aisle layouts.
          </p>

          <FileDropzone 
            title="Upload Store Layout"
            description="Drag and drop CAD or image files (PNG, JPG)"
            acceptedTypes="image/*, .dwg, .dxf"
            onUploadSuccess={(file) => {
              addToast(`Analyzed spatial dimensions for ${file.name}`, 'success');
              setFloorplanStatus('uploaded');
            }}
          />

          <AnimatePresence>
            {floorplanStatus === 'uploaded' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.2)' }}
              >
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} /> Foot-Traffic Heatmap Generated
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div><span style={{color: 'var(--text-secondary)'}}>High-Traffic Zones:</span> <span style={{fontWeight: '600'}}>Aisle 4, Checkout</span></div>
                  <div><span style={{color: 'var(--text-secondary)'}}>Dead Zones:</span> <span style={{fontWeight: '600'}}>Aisle 9</span></div>
                  <div><span style={{color: 'var(--text-secondary)'}}>Conversion Est:</span> <span style={{fontWeight: '600', color: 'var(--success)'}}>+14.2%</span></div>
                  <div><span style={{color: 'var(--text-secondary)'}}>Bottleneck Risk:</span> <span style={{fontWeight: '600', color: 'var(--warning)'}}>Medium</span></div>
                </div>
                
                <div style={{ marginTop: '1.5rem', height: '120px', background: 'linear-gradient(45deg, rgba(234, 88, 12, 0.2) 0%, rgba(239, 68, 68, 0.4) 50%, rgba(59, 130, 246, 0.2) 100%)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                  {/* Mock Heatmap overlay */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 30%)', mixBlendMode: 'overlay' }}></div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.7rem', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>SIMULATION ACTIVE</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
    </div>
  );
};

export default CommandCenter;
