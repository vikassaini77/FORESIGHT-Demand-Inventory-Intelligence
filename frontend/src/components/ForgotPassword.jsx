import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <p className="auth-subtitle" style={{ color: '#10b981', marginBottom: '20px' }}>
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="analyst@northbay.com"
                  required 
                />
              </div>
              
              <button type="submit" className="auth-button">Send Reset Link</button>
            </form>
            
            <div className="auth-footer">
              Remember your password? <Link to="/login" className="auth-link">Log In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
