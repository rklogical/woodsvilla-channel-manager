import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, BedDouble, Tag,
  Ticket, Globe, BarChart2, Settings, LogOut, Hotel
} from 'lucide-react';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reservations',icon: Calendar,        label: 'Reservations' },
  { to: '/inventory',   icon: BedDouble,       label: 'Inventory' },
  { to: '/rates',       icon: Tag,             label: 'Rates' },
  { to: '/promotions',  icon: Ticket,          label: 'Promotions' },
  { to: '/channels',    icon: Globe,           label: 'Channels' },
  { to: '/reports',     icon: BarChart2,       label: 'Reports' },
  { to: '/settings',    icon: Settings,        label: 'Settings' },
];

const styles = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 'var(--sidebar-w)',
    background: '#fff',
    borderRight: '1px solid var(--gray-200)',
    display: 'flex', flexDirection: 'column',
    zIndex: 100,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '18px 20px',
    borderBottom: '1px solid var(--gray-100)',
  },
  logoIcon: {
    width: 32, height: 32,
    background: 'var(--brand)', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' },
  logoSub:  { fontSize: 11, color: 'var(--gray-400)' },
  nav: { flex: 1, padding: '12px 0', overflowY: 'auto' },
  footer: {
    padding: '12px 12px',
    borderTop: '1px solid var(--gray-100)',
  },
  userBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 10px', borderRadius: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--brand-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 600, color: 'var(--brand)',
    flexShrink: 0,
  },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'HM';

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Hotel size={18} color="#fff" />
        </div>
        <div>
          <div style={styles.logoText}>ChannelPro</div>
          <div style={styles.logoSub}>Hotel Manager</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 16px', margin: '1px 8px',
              borderRadius: 8, textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
              color: isActive ? 'var(--brand)' : 'var(--gray-600)',
              background: isActive ? 'var(--brand-light)' : 'transparent',
              transition: '.12s',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={styles.footer}>
        <div style={styles.userBox}>
          <div style={styles.avatar}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Hotel Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{user?.role || 'Admin'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 8, border: 'none', background: 'none', color: 'var(--gray-500)', fontSize: 13, cursor: 'pointer' }}
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
