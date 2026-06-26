import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, BedDouble, Calendar, IndianRupee, Users, Globe } from 'lucide-react';

// ── Mock data (replace with dashboardAPI.getStats() in production) ──────────
const revenueData = [
  { day: 'Mon', revenue: 42000, bookings: 4 },
  { day: 'Tue', revenue: 38000, bookings: 3 },
  { day: 'Wed', revenue: 55000, bookings: 6 },
  { day: 'Thu', revenue: 61000, bookings: 7 },
  { day: 'Fri', revenue: 89000, bookings: 9 },
  { day: 'Sat', revenue: 124000, bookings: 12 },
  { day: 'Sun', revenue: 98000, bookings: 10 },
];

const channelData = [
  { channel: 'Booking.com', bookings: 42, revenue: 186000 },
  { channel: 'Direct',      bookings: 28, revenue: 145000 },
  { channel: 'Expedia',     bookings: 16, revenue: 72000 },
  { channel: 'MakeMyTrip',  bookings: 14, revenue: 58000 },
];

const recentBookings = [
  { id: '#1842', guest: 'Rahul Sharma',    room: 'Deluxe 204', checkIn: '22 Jun', source: 'Booking.com', status: 'checked_in',  amount: 12600 },
  { id: '#1841', guest: 'Priya Mehta',     room: 'Suite 301',  checkIn: '21 Jun', source: 'Expedia',     status: 'checked_in',  amount: 28500 },
  { id: '#1840', guest: 'Arun Kumar',      room: 'Standard 112',checkIn: '23 Jun', source: 'Direct',     status: 'confirmed',   amount: 7500 },
  { id: '#1839', guest: 'Sunita Verma',    room: 'Deluxe 208', checkIn: '24 Jun', source: 'MakeMyTrip', status: 'confirmed',   amount: 12600 },
  { id: '#1838', guest: 'James Wilson',    room: 'Suite 305',  checkIn: '20 Jun', source: 'Direct',     status: 'checked_out', amount: 19000 },
];

const statusBadge = {
  confirmed:    <span className="badge badge-blue">Confirmed</span>,
  checked_in:   <span className="badge badge-green">Checked in</span>,
  checked_out:  <span className="badge badge-gray">Checked out</span>,
  cancelled:    <span className="badge badge-red">Cancelled</span>,
};

// ── Metric card ──────────────────────────────────────────────────────────────
function Metric({ label, value, sub, up = true, icon: Icon, color = '#1a56db' }) {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="metric-label">{label}</div>
          <div className="metric-value">{value}</div>
          <div className={`metric-sub ${up ? '' : 'down'}`}>{sub}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

// ── Availability mini-calendar ───────────────────────────────────────────────
const calDays = [
  { d: 1,  s: 'avail'   }, { d: 2,  s: 'avail'   }, { d: 3,  s: 'partial'  },
  { d: 4,  s: 'full'    }, { d: 5,  s: 'full'     }, { d: 6,  s: 'full'     },
  { d: 7,  s: 'partial' }, { d: 8,  s: 'avail'    }, { d: 9,  s: 'avail'    },
  { d: 10, s: 'avail'   }, { d: 11, s: 'partial'  }, { d: 12, s: 'full'     },
  { d: 13, s: 'full'    }, { d: 14, s: 'full'      }, { d: 15, s: 'partial'  },
  { d: 16, s: 'avail'   }, { d: 17, s: 'avail'    }, { d: 18, s: 'partial'  },
  { d: 19, s: 'full'    }, { d: 20, s: 'full'      }, { d: 21, s: 'partial'  },
  { d: 22, s: 'avail'   }, { d: 23, s: 'avail'    }, { d: 24, s: 'avail'    },
  { d: 25, s: 'avail'   }, { d: 26, s: 'partial'   }, { d: 27, s: 'avail'   },
  { d: 28, s: 'avail'   }, { d: 29, s: 'avail'    }, { d: 30, s: 'avail'    },
];
const calColors = { full: '#fde8e8', partial: '#fef3c7', avail: '#def7ec' };
const calText   = { full: '#c81e1e', partial: '#c27803', avail: '#057a55' };

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [syncing, setSyncing] = useState(false);

  const fmtINR = n => '₹' + (n >= 100000
    ? (n/100000).toFixed(1) + 'L'
    : n >= 1000 ? (n/1000).toFixed(0) + 'k' : n);

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Good morning, Woodsvilla Residency 👋</h1>
          <p>Your resort overview for today — Booking.com, MMT, Goibibo, Expedia & Agoda synced.</p>
        </div>
        <button
          className={`btn btn-primary ${syncing ? 'disabled' : ''}`}
          onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000); }}
          disabled={syncing}
        >
          {syncing
            ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Syncing…</>
            : <><Globe size={15} /> Sync all OTAs</>}
        </button>
      </div>

      {/* Metrics */}
      <div className="metric-grid">
        <Metric label="Occupancy"       value="74%"     sub="▲ 6% vs last week"   icon={BedDouble}     color="#1a56db" />
        <Metric label="Revenue today"   value="₹1.24L"  sub="▲ ₹18k vs yesterday" icon={IndianRupee}   color="#0e9f6e" />
        <Metric label="Available rooms" value="14"      sub="of 54 total"          icon={Calendar}      color="#c27803" />
        <Metric label="Check-ins today" value="8"       sub="3 pending"            icon={Users}         color="#7e3af2" />
        <Metric label="ADR"             value="₹4,200"  sub="▲ ₹320 vs last week"  icon={TrendingUp}    color="#e02424" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Revenue chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue — last 7 days</span>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a56db" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => '₹'+v/1000+'k'} />
                <Tooltip formatter={v => ['₹'+v.toLocaleString('en-IN'), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#1a56db" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Bookings by channel</span>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channelData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#1a56db" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

        {/* Recent bookings */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent reservations</span>
            <a href="/reservations" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>View all →</a>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Booking</th><th>Guest</th><th>Room</th>
                <th>Check-in</th><th>Source</th><th>Amount</th><th>Status</th>
              </tr></thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gray-500)' }}>{b.id}</td>
                    <td style={{ fontWeight: 500 }}>{b.guest}</td>
                    <td>{b.room}</td>
                    <td>{b.checkIn}</td>
                    <td><span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{b.source}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{b.amount.toLocaleString('en-IN')}</td>
                    <td>{statusBadge[b.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Availability calendar */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Availability — July 2025</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 12 }}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', padding: '2px 0' }}>{d}</div>
              ))}
              {/* offset for July starting on Tuesday */}
              <div /><div />
              {calDays.map(({ d, s }) => (
                <div key={d} style={{
                  textAlign: 'center', fontSize: 11, fontWeight: 500,
                  padding: '5px 2px', borderRadius: 5, cursor: 'pointer',
                  background: calColors[s], color: calText[s],
                }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              {[['avail','Available'],['partial','Partial'],['full','Full']].map(([s,l]) => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: calColors[s], display: 'inline-block' }} />
                  <span style={{ color: 'var(--gray-500)' }}>{l}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
