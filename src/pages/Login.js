import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email,    setEmail]    = useState('demo@hotel.com');
  const [password, setPassword] = useState('demo123');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      // Demo login (replace with real authAPI.login() call)
      await new Promise(r => setTimeout(r, 800));
      login({ name: 'Woodsvilla Residency Admin', email, role: 'Admin', hotelId: 'demo-hotel-1' }, 'demo-token-xyz');
      navigate('/');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'var(--brand)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Hotel size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>ChannelPro</h1>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Hotel Channel Manager</p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" value={email} autoFocus
                onChange={e => setEmail(e.target.value)} placeholder="admin@yourhotel.com" />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-input" type={show ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 10, top: 30, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 14, marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</> : 'Sign in'}
            </button>
          </form>
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 12, color: 'var(--gray-500)' }}>
            Demo credentials: <strong>demo@hotel.com</strong> / <strong>demo123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
