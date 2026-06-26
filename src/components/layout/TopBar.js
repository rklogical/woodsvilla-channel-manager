import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/':             { title: 'Dashboard',    sub: 'Overview of your property' },
  '/reservations': { title: 'Reservations', sub: 'All bookings across channels' },
  '/inventory':    { title: 'Inventory',    sub: 'Room availability by date' },
  '/rates':        { title: 'Rate Manager', sub: 'Prices across all channels' },
  '/promotions':   { title: 'Promotions',   sub: 'Deals & special offers' },
  '/channels':     { title: 'OTA Channels', sub: 'Connected booking platforms' },
  '/reports':      { title: 'Reports',      sub: 'Revenue & performance analytics' },
  '/settings':     { title: 'Settings',     sub: 'Hotel configuration' },
};

export default function TopBar() {
  const loc = useLocation();
  const info = titles[loc.pathname] || { title: 'Channel Manager', sub: '' };
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--sidebar-w)', right: 0,
      height: 'var(--topbar-h)',
      background: '#fff', borderBottom: '1px solid var(--gray-200)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 99,
    }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>{info.title}</h1>
        <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{info.sub}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--gray-400)', marginRight: 8 }}>{today}</span>
        <button className="btn btn-sm" title="Refresh"><RefreshCw size={14} /></button>
        <button className="btn btn-sm" title="Notifications"><Bell size={14} /></button>
      </div>
    </header>
  );
}
