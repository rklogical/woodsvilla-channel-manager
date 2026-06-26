import React, { useState } from 'react';
import { Globe, RefreshCw, Check, X, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const CHANNELS = [
  { id:'ch1', name:'Booking.com',  code:'bookingcom', color:'#003580', active:true,  lastSync:'2 min ago',  status:'synced',  bookings:42, revenue:186000, commission:15 },
  { id:'ch2', name:'Expedia',      code:'expedia',    color:'#ffc72c', active:true,  lastSync:'5 min ago',  status:'synced',  bookings:16, revenue:72000,  commission:18 },
  { id:'ch3', name:'MakeMyTrip',   code:'mmt',        color:'#e8192c', active:true,  lastSync:'3 min ago',  status:'synced',  bookings:14, revenue:58000,  commission:12 },
  { id:'ch4', name:'Goibibo',      code:'goibibo',    color:'#e8192c', active:true,  lastSync:'8 min ago',  status:'synced',  bookings:11, revenue:44000,  commission:12 },
  { id:'ch5', name:'Agoda',        code:'agoda',      color:'#bd4700', active:false, lastSync:'Never',      status:'offline', bookings:0,  revenue:0,      commission:15 },
  { id:'ch6', name:'Yatra',        code:'yatra',      color:'#f4a300', active:false, lastSync:'Never',      status:'offline', bookings:0,  revenue:0,      commission:14 },
  { id:'ch7', name:'Airbnb',       code:'airbnb',     color:'#ff385c', active:false, lastSync:'Never',      status:'offline', bookings:0,  revenue:0,      commission:3 },
];

export default function Channels() {
  const [channels, setChannels] = useState(CHANNELS);
  const [syncing, setSyncing]   = useState({});

  const toggle = (id) => {
    setChannels(cs => cs.map(c => c.id === id ? { ...c, active: !c.active } : c));
    const ch = channels.find(c => c.id === id);
    toast.success(`${ch.name} ${ch.active ? 'disconnected' : 'connected'}`);
  };

  const syncNow = async (id) => {
    setSyncing(s => ({ ...s, [id]: true }));
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(s => ({ ...s, [id]: false }));
    setChannels(cs => cs.map(c => c.id === id ? { ...c, lastSync: 'Just now', status: 'synced' } : c));
    toast.success('Sync complete');
  };

  const activeChannels = channels.filter(c => c.active);
  const totalRevenue   = activeChannels.reduce((s, c) => s + c.revenue, 0);
  const totalBookings  = activeChannels.reduce((s, c) => s + c.bookings, 0);

  return (
    <div className="page-body">
      <div className="page-header">
        <div><h1>OTA Channels</h1><p>Manage connections to booking platforms</p></div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add channel</button>
      </div>

      {/* Summary metrics */}
      <div className="metric-grid" style={{ marginBottom: 20 }}>
        <div className="metric-card">
          <div className="metric-label">Active channels</div>
          <div className="metric-value">{activeChannels.length}</div>
          <div className="metric-sub">of {channels.length} available</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total bookings</div>
          <div className="metric-value">{totalBookings}</div>
          <div className="metric-sub">this month</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">OTA revenue</div>
          <div className="metric-value">₹{(totalRevenue/100000).toFixed(1)}L</div>
          <div className="metric-sub">this month</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg commission</div>
          <div className="metric-value">14.4%</div>
          <div className="metric-sub">across all OTAs</div>
        </div>
      </div>

      {/* Channels list */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Connected platforms</span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Rates & inventory sync in real-time</span>
        </div>

        {channels.map((ch, i) => (
          <div key={ch.id} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
            borderBottom: i < channels.length - 1 ? '1px solid var(--gray-100)' : 'none',
            opacity: ch.active ? 1 : 0.6,
          }}>
            {/* Channel logo placeholder */}
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: ch.color + '20', border: `1.5px solid ${ch.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: ch.color,
            }}>
              {ch.name.slice(0,2).toUpperCase()}
            </div>

            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                {ch.active ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="dot dot-green" style={{ width: 7, height: 7 }} />
                    Last synced: {ch.lastSync}
                  </span>
                ) : (
                  <span style={{ color: 'var(--gray-400)' }}>Not connected</span>
                )}
              </div>
            </div>

            {/* Stats */}
            {ch.active && (
              <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{ch.bookings}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>bookings</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>₹{(ch.revenue/1000).toFixed(0)}k</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>revenue</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{ch.commission}%</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>commission</div>
                </div>
              </div>
            )}

            {/* Sync + toggle */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {ch.active && (
                <button className="btn btn-sm" onClick={() => syncNow(ch.id)} disabled={syncing[ch.id]}>
                  {syncing[ch.id]
                    ? <span className="spinner" style={{ width: 13, height: 13 }} />
                    : <RefreshCw size={13} />
                  }
                  {syncing[ch.id] ? 'Syncing…' : 'Sync'}
                </button>
              )}
              <button
                onClick={() => toggle(ch.id)}
                style={{
                  padding: '5px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: ch.active ? 'var(--danger)' : 'var(--brand)',
                  background: ch.active ? 'var(--danger-bg)' : 'var(--brand-light)',
                  color: ch.active ? 'var(--danger)' : 'var(--brand)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {ch.active ? <><X size={12} /> Disconnect</> : <><Plus size={12} /> Connect</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How it works note */}
      <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--brand-light)', borderRadius: 10, fontSize: 13, color: 'var(--brand)', display: 'flex', gap: 10 }}>
        <Globe size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>When you update a rate or inventory, it automatically syncs to all active channels above within seconds. New bookings from any channel are instantly reflected across all others to prevent double-bookings.</span>
      </div>
    </div>
  );
}
