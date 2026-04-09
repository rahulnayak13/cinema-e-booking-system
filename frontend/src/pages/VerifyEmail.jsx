import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../api/auth.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const token = searchParams.get('token');

  const verifyEmailToken = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await verifyEmail(token, email);
      setVerified(true);
      setMessage('✅ Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errMsg = err.message || '';
      // Already verified counts as success
      if (errMsg.toLowerCase().includes('already verified')) {
        setVerified(true);
        setMessage('✅ Your account is already verified. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setVerified(false);
        setMessage('');
        setError(errMsg || 'Verification failed. Please request a new link.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await resendVerificationEmail(email);
      setError('');
      setMessage('✅ Verification email sent! Please check your inbox.');
    } catch (err) {
      setMessage('');
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Email Verification</h2>
        
        {loading && <p style={styles.loading}>Verifying...</p>}
        
        {!loading && message && <p style={styles.success}>{message}</p>}
        
        {!loading && error && <p style={styles.error}>{error}</p>}

        {!verified && !loading && token && !message && (
          <div>
            <p style={styles.info}>Click below to verify your email.</p>
            <button type="button" style={styles.button} onClick={verifyEmailToken}>
              Verify Email
            </button>
          </div>
        )}
        
        {!verified && !loading && !message && !token && (
          <div>
            {!token && <p>Didn't receive the verification email?</p>}
            <form onSubmit={handleResendEmail} style={styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  success: {
    color: '#28a745',
    marginBottom: '1rem',
  },
  info: {
    marginBottom: '1rem',
  },
  error: {
    color: '#dc3545',
    marginBottom: '1rem',
  },
  loading: {
    color: '#007bff',
    marginBottom: '1rem',
  },
};
