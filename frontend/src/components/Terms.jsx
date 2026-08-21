import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="auth-container" style={{ padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '800px', width: '100%', textAlign: 'left' }}>
        <h2 style={{ marginBottom: '20px' }}>Terms and Conditions</h2>
        
        <div style={{ color: '#94a3b8', lineHeight: '1.6', maxHeight: '60vh', overflowY: 'auto', paddingRight: '15px' }}>
          <h3>1. Introduction</h3>
          <p>Welcome to Project FORESIGHT. By accessing this platform, you agree to these Terms and Conditions.</p>
          
          <h3>2. Data Privacy & Caching</h3>
          <p>We take your data seriously. All predictive ML data and inventory logs are securely cached and processed in accordance with NorthBay Living corporate policies. Do not share your login credentials.</p>
          
          <h3>3. Acceptable Use</h3>
          <p>The pricing optimization engine and automated purchase order generation tools are for authorized supply chain analysts only. Misuse of the automated ERP integration may result in account termination.</p>

          <h3>4. Liability</h3>
          <p>FORESIGHT ML predictions are based on historical models. NorthBay Living is not liable for stockouts resulting from macroeconomic anomalies not captured in the training data.</p>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <Link to="/signup" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '10px 30px' }}>
            Return to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Terms;
