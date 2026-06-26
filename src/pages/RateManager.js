import React, { useState } from 'react';
import { Tag, RefreshCw, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ROOM_TYPES = [
  { id: 'rt-1', name: 'Deluxe Room',  total: 10, plans: { EP: 3500, CP: 4000 } },
  { id: 'rt-2', name: 'Family Suite', total: 10, plans: { EP: 4000, CP: 4500 } },
];

const PLANS = [
  { code: 'EP', label: 'EP — Room Only' },
  { code: 'CP', label: 'CP — With Breakfast' },
];

const DAYS_OF_WEEK = [
  { val: 0, label: 'Sun' },{ val: 1, label: 'Mon' },{ val: 2, label: 'Tue' },
  { val: 3, label: 'Wed' },{ val: 4, label: 'Thu' },{ val: 5, label: 'Fri' },
  { val: 6, label: 'Sat' },
];

const PRESETS = [
  { label: 'Weekend surge +20%', multiplier: 1.20, days: [5, 6] },
  { label: 'Weekday discount -10%', multiplier: 0.90, days: [1,2,3,4] },
  { label: 'Peak season +25%', multiplier: 1.25, days: null },
  { label: 'Last-minute -15%', multiplier: 0.85, days: null },
];

export default function RateManager() {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    roomTypeId: 'rt-1',
    plan:       'EP',
    startDate:  today,
    endDate:    nextMonth,
    rate:       3500,
    days:       [0,1,2,3,4,5,6],
    minStay:    1,
    maxStay:    30,
    updateType: 'fixed',
    percent:    0,
  });
  const [saving,   setSaving]  = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const selectedRoom = ROOM_TYPES.find(r => r.id === form.roomTypeId);

  const toggleDay = d => {
    setForm(f => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d]
    }));
  };

  const applyPreset = preset => {
    const baseRate = selectedRoom?.plans[form.plan] || 3500;
    setForm(f => ({
      ...f,
      rate: Math.round(baseRate * preset.multiplier),
      days: preset.days || [0,1,2,3,4,5,6]
    }));
  };

  const computeRate = () => {
    if (form.updateType === 'percent') {
      const base = selectedRoom?.plans[form.plan] || 0;
      return Math.round(base * (1 + form.percent / 100));
    }
    return form.rate;
  };

  const handleRoomChange = (roomTypeId) => {
    const rt = ROOM_TYPES.find(r => r.id === roomTypeId);
    setForm(f => ({ ...f, roomTypeId, rate: rt?.plans[f.plan] || f.rate }));
  };

  const handlePlanChange = (plan) => {
    const rate = selectedRoom?.plans[plan] || form.rate;
    setForm(f => ({ ...f, plan, rate }));
  };

  const handleSubmit = async () => {
    if (!form.roomTypeId || !form.startDate || !form.endDate) {
      toast.error('Please fill in all required fields'); return;
    }
    if (form.days.length === 0) {
      toast.error('Select at least one day of the week'); return;
    }
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1400));
      setLastSync(new Date());
      toast.success(`Rates updated! Syncing to all OTAs…`);
    } catch {
      toast.error('Failed to update rates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div>
          <h1>Rate Manager</h1>
          <p>Woodsvilla Residency — Update prices across all OTA channels</p>
        </div>
        {lastSync && (
          <span style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> Last synced {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

        {/* Main form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Tag size={16} style={{ verticalAlign: -2, marginRight: 6 }} />Update rates</span>
          </div>
          <div className="card-body">

            {/* Room type */}
            <div className="form-group">
              <label className="form-label">Room type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {ROOM_TYPES.map(r => (
                  <button key={r.id} type="button"
                    onClick={() => handleRoomChange(r.id)}
                    style={{
                      flex: 1, padding: '10px 16px', borderRadius: 8, border: '1.5px solid',
                      borderColor: form.roomTypeId === r.id ? 'var(--brand)' : 'var(--gray-200)',
                      background: form.roomTypeId === r.id ? 'var(--brand-light)' : '#fff',
                      color: form.roomTypeId === r.id ? 'var(--brand)' : 'var(--gray-700)',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                    }}>
                    <div>{r.name}</div>
                    <div style={{ fontSize: 11, opacity: .7, marginTop: 2 }}>{r.total} rooms</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Plan */}
            <div className="form-group">
              <label className="form-label">Meal plan</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {PLANS.map(p => (
                  <button key={p.code} type="button"
                    onClick={() => handlePlanChange(p.code)}
                    style={{
                      flex: 1, padding: '9px 16px', borderRadius: 8, border: '1.5px solid',
                      borderColor: form.plan === p.code ? 'var(--brand)' : 'var(--gray-200)',
                      background: form.plan === p.code ? 'var(--brand-light)' : '#fff',
                      color: form.plan === p.code ? 'var(--brand)' : 'var(--gray-700)',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">From date</label>
                <input className="form-input" type="date" value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">To date</label>
                <input className="form-input" type="date" value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            {/* Rate input */}
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Rate per night (₹)</label>
                <input className="form-input" type="number" value={form.rate}
                  onChange={e => setForm(f => ({ ...f, rate: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Min stay (nights)</label>
                <input className="form-input" type="number" min="1" value={form.minStay}
                  onChange={e => setForm(f => ({ ...f, minStay: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Max stay (nights)</label>
                <input className="form-input" type="number" min="1" value={form.maxStay}
                  onChange={e => setForm(f => ({ ...f, maxStay: parseInt(e.target.value) || 30 }))} />
              </div>
            </div>

            {/* Days of week */}
            <div className="form-group">
              <label className="form-label">Apply to days of week</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DAYS_OF_WEEK.map(({ val, label }) => {
                  const selected = form.days.includes(val);
                  return (
                    <button key={val} type="button" onClick={() => toggleDay(val)}
                      style={{
                        width: 46, height: 36, borderRadius: 8, border: '1px solid',
                        borderColor: selected ? 'var(--brand)' : 'var(--gray-300)',
                        background: selected ? 'var(--brand)' : '#fff',
                        color: selected ? '#fff' : 'var(--gray-600)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>{label}</button>
                  );
                })}
                <button type="button" onClick={() => setForm(f => ({ ...f, days: [0,1,2,3,4,5,6] }))}
                  className="btn btn-sm" style={{ alignSelf: 'center' }}>All</button>
                <button type="button" onClick={() => setForm(f => ({ ...f, days: [5,6] }))}
                  className="btn btn-sm" style={{ alignSelf: 'center' }}>Weekend</button>
              </div>
            </div>

            {/* Preview & Submit */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Rate to be applied</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)' }}>
                  ₹{computeRate().toLocaleString('en-IN')} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--gray-400)' }}>/ night</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                  {selectedRoom?.name} · {form.plan} · {form.days.length} days/week
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}
                style={{ padding: '10px 24px', fontSize: 14 }}>
                {saving
                  ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Updating…</>
                  : <><RefreshCw size={15} /> Update & sync to OTAs</>}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--gray-500)', padding: '8px 12px', background: 'var(--info-bg)', borderRadius: 8 }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--info)' }} />
              Rates will be pushed to Booking.com, MakeMyTrip, Goibibo, Expedia & Agoda simultaneously.
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick presets */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><span className="card-title">Quick presets</span></div>
            <div className="card-body" style={{ padding: 12 }}>
              {PRESETS.map((p, i) => (
                <button key={i} type="button" onClick={() => applyPreset(p)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--gray-200)', background: '#fff', marginBottom: 8, cursor: 'pointer', fontSize: 13, color: 'var(--gray-700)' }}>
                  {p.label}
                  {p.days && <span style={{ fontSize: 11, color: 'var(--gray-400)', display: 'block', marginTop: 2 }}>
                    {p.days.map(d => DAYS_OF_WEEK[d].label).join(', ')} only
                  </span>}
                </button>
              ))}
            </div>
          </div>

          {/* Current rates */}
          <div className="card">
            <div className="card-header"><span className="card-title">Woodsvilla Residency rates</span></div>
            <div style={{ padding: 0 }}>
              {ROOM_TYPES.map((rt, i) => (
                <div key={rt.id} style={{ padding: '12px 16px', borderBottom: i < ROOM_TYPES.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{rt.name}</div>
                  {Object.entries(rt.plans).map(([plan, rate]) => (
                    <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: 'var(--gray-500)' }}>{plan}</span>
                      <span style={{ fontWeight: 600 }}>₹{rate.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
