import React, { useState } from 'react';
import { Plus, Search, Download, Eye, CheckSquare, XCircle, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK = [
  { id:'#1842', guest:'Rahul Sharma',  phone:'9876543210', room:'Deluxe 204',  checkIn:'2025-06-22', checkOut:'2025-06-25', nights:3, source:'Booking.com', status:'checked_in',  amount:12600, commission:1890 },
  { id:'#1841', guest:'Priya Mehta',   phone:'9845512300', room:'Suite 301',   checkIn:'2025-06-21', checkOut:'2025-06-24', nights:3, source:'Expedia',     status:'checked_in',  amount:28500, commission:4275 },
  { id:'#1840', guest:'Arun Kumar',    phone:'9711234567', room:'Std 112',     checkIn:'2025-06-23', checkOut:'2025-06-26', nights:3, source:'Direct',      status:'confirmed',   amount:7500,  commission:0 },
  { id:'#1839', guest:'Sunita Verma',  phone:'8800112233', room:'Deluxe 208',  checkIn:'2025-06-24', checkOut:'2025-06-27', nights:3, source:'MakeMyTrip',  status:'confirmed',   amount:12600, commission:1890 },
  { id:'#1838', guest:'James Wilson',  phone:'9900887766', room:'Suite 305',   checkIn:'2025-06-20', checkOut:'2025-06-22', nights:2, source:'Direct',      status:'checked_out', amount:19000, commission:0 },
  { id:'#1837', guest:'Amit Shah',     phone:'9123456789', room:'Std 105',     checkIn:'2025-06-25', checkOut:'2025-06-28', nights:3, source:'Goibibo',     status:'confirmed',   amount:7500,  commission:1125 },
  { id:'#1836', guest:'Neha Joshi',    phone:'9654321098', room:'S.Dlx 209',   checkIn:'2025-06-26', checkOut:'2025-06-29', nights:3, source:'Booking.com', status:'confirmed',   amount:19500, commission:2925 },
  { id:'#1835', guest:'Rajesh Patel',  phone:'9988776655', room:'Deluxe 203',  checkIn:'2025-06-18', checkOut:'2025-06-20', nights:2, source:'Agoda',       status:'checked_out', amount:8400,  commission:1260 },
  { id:'#1834', guest:'Maria Garcia',  phone:'9012345678', room:'Suite 302',   checkIn:'2025-06-15', checkOut:'2025-06-17', nights:2, source:'Expedia',     status:'cancelled',   amount:19000, commission:0 },
];

const STATUS_BADGE = {
  confirmed:    <span className="badge badge-blue">Confirmed</span>,
  checked_in:   <span className="badge badge-green">Checked in</span>,
  checked_out:  <span className="badge badge-gray">Checked out</span>,
  cancelled:    <span className="badge badge-red">Cancelled</span>,
  no_show:      <span className="badge badge-amber">No-show</span>,
};

const SOURCE_DOT = {
  'Booking.com': '#003580', Expedia: '#ffc72c', MakeMyTrip: '#e8192c',
  Goibibo: '#e8192c', Agoda: '#bd4700', Direct: '#0e9f6e',
};

export default function Reservations() {
  const [search,    setSearch]    = useState('');
  const [statusF,   setStatusF]   = useState('all');
  const [sourceF,   setSourceF]   = useState('all');
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({ guestName:'', phone:'', email:'', checkIn:'', checkOut:'', roomType:'Deluxe', adults:2 });
  const [saving,    setSaving]    = useState(false);

  const filtered = MOCK.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.guest.toLowerCase().includes(q) || r.id.includes(q) || r.room.toLowerCase().includes(q);
    const matchS = statusF === 'all' || r.status === statusF;
    const matchSrc = sourceF === 'all' || r.source === sourceF;
    return matchQ && matchS && matchSrc;
  });

  const handleCreate = async () => {
    if (!form.guestName || !form.checkIn || !form.checkOut) { toast.error('Fill in all required fields'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Reservation created! Inventory updated on all OTAs.');
    setSaving(false);
    setShowForm(false);
    setForm({ guestName:'', phone:'', email:'', checkIn:'', checkOut:'', roomType:'Deluxe', adults:2 });
  };

  const handleAction = async (id, action) => {
    await new Promise(r => setTimeout(r, 600));
    const labels = { checked_in:'Checked in', checked_out:'Checked out', cancelled:'Cancelled' };
    toast.success(`${id} marked as ${labels[action]}`);
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div><h1>Reservations</h1><p>{MOCK.length} bookings this month</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Plus size={14} /> New booking
          </button>
        </div>
      </div>

      {/* New booking form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span className="card-title">New reservation</span>
            <button className="btn btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <div className="card-body">
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Guest name *</label>
                <input className="form-input" placeholder="Full name" value={form.guestName}
                  onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="Mobile number" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="guest@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Check-in *</label>
                <input className="form-input" type="date" value={form.checkIn}
                  onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out *</label>
                <input className="form-input" type="date" value={form.checkOut}
                  onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Room type</label>
                <select className="form-select" value={form.roomType}
                  onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))}>
                  {['Standard','Deluxe','Super Deluxe','Suite'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? <><span className="spinner" style={{ width:14,height:14 }} /> Saving…</> : 'Confirm booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {/* Filters */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="form-input" placeholder="Search guest, booking ID, room…"
              style={{ paddingLeft: 32, height: 36 }} value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 140, height: 36 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">All status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked in</option>
            <option value="checked_out">Checked out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="form-select" style={{ width: 160, height: 36 }} value={sourceF} onChange={e => setSourceF(e.target.value)}>
            <option value="all">All channels</option>
            {['Booking.com','Expedia','MakeMyTrip','Goibibo','Agoda','Direct'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking</th><th>Guest</th><th>Room</th>
                <th>Check-in</th><th>Check-out</th><th>Nights</th>
                <th>Channel</th><th>Amount</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gray-400)' }}>{r.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.guest}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{r.phone}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.room}</td>
                  <td style={{ fontSize: 13 }}>{new Date(r.checkIn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</td>
                  <td style={{ fontSize: 13 }}>{new Date(r.checkOut).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</td>
                  <td style={{ textAlign: 'center' }}>{r.nights}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: SOURCE_DOT[r.source] || '#888', flexShrink: 0 }} />
                      {r.source}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>₹{r.amount.toLocaleString('en-IN')}</div>
                    {r.commission > 0 && <div style={{ fontSize: 11, color: 'var(--danger)' }}>-₹{r.commission.toLocaleString('en-IN')} comm.</div>}
                  </td>
                  <td>{STATUS_BADGE[r.status]}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {r.status === 'confirmed' && (
                        <button className="btn btn-sm" onClick={() => handleAction(r.id,'checked_in')} title="Check in">
                          <LogIn size={13} />
                        </button>
                      )}
                      {r.status === 'checked_in' && (
                        <button className="btn btn-sm" onClick={() => handleAction(r.id,'checked_out')} title="Check out">
                          <CheckSquare size={13} />
                        </button>
                      )}
                      {['confirmed','checked_in'].includes(r.status) && (
                        <button className="btn btn-sm" onClick={() => handleAction(r.id,'cancelled')} title="Cancel"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                          <XCircle size={13} />
                        </button>
                      )}
                      <button className="btn btn-sm" title="View"><Eye size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state"><h3>No reservations found</h3><p>Try adjusting your filters</p></div>
          )}
        </div>

        {/* Footer summary */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 20, fontSize: 12, color: 'var(--gray-500)' }}>
          <span>Showing {filtered.length} of {MOCK.length}</span>
          <span>Total revenue: <strong style={{ color: 'var(--gray-800)' }}>₹{MOCK.reduce((s,r) => s + r.amount, 0).toLocaleString('en-IN')}</strong></span>
          <span>Net revenue: <strong style={{ color: 'var(--success)' }}>₹{MOCK.reduce((s,r) => s + r.amount - r.commission, 0).toLocaleString('en-IN')}</strong></span>
        </div>
      </div>
    </div>
  );
}
