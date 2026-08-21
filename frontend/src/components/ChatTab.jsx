import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

function ChatTab() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am FORESIGHT, your AI Data Analyst. How can I help you optimize your inventory or sales today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting to the backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chart-card" style={{ maxWidth: '800px', margin: '0 auto', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px' }}>Generative AI Data Analyst</h2>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'user' ? '#3b82f6' : '#1e293b',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '80%',
            border: msg.sender === 'ai' ? '1px solid #334155' : 'none'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#94a3b8' }}>FORESIGHT is typing...</div>
        )}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #334155' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'Which region has the highest stockout risk?')"
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '0 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatTab;
