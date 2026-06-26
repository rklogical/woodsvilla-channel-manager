import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BedDouble, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

const ROOMS = [
  { id: 'rt-1', name: 'Deluxe Room',          total: 10,  color: '#dbeafe' },
  { id: 'rt-2', name: 'Superior Deluxe Room', total: 10, color: '#dcfce7' },
  { id: 'rt-3', name: 'Family Suite',         total: 10,  color: '#fef3c7' },
  { id: 'rt-4', name: 'Duplex Suite',         total: 2,  color: '#ede9fe' },
];

// Generate fake availability for a month
function genInventory(year, month, roomId) {
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const day   = i + 1;
    const rt    = ROOMS.find(r => r.id === roomId);
    const total = rt?.total || 10;
    const dow   = new Date(year, month, day).getDay();
    const isWeekend = dow === 0 || dow === 6;
    const available = isWeekend
      ? Math.max(0, Math.floor(Math.random() * 3))
      : Math.floor(Math.random() * (total - 2)) + 1;
    return {
      day,
      available,
      total,
      rate: isWeekend ? (roomId === 'rt-4' ? 11000 : 5200) : (roomId === 'rt-4' ? 9500 : 4200),
      stopSell: false,
      blocked: total - available - Math.floor(Math.random() * 2),
    };
  });
}

function cellBg(avail, total) {
  if (avail === 0)             return '#fee2e2';
  if (avail / total < 0.3)     return '#fef3c7';
  if (avail / total < 0.6)     return '#dcfce7';
  return '#f0fdf4';
}
function cellColor(avail, total) {
  if (avail === 0)            return '#c81e1e';
  if (avail / total < 0.3)    return '#c27803';
  return '#065f46';
}

export default function InventoryGrid() {
  const now    = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [activeRoom, setActiveRoom] = useState('rt-2');
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing]   = useState(null);   // { day, field }
  const [saving,  setSaving]    = useState(false);

  const days    = new Date(year, month + 1, 0).getDate();
  const inv     = genInventory(year, month, activeRoom);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
  const rt      = ROOMS.find(r => r.id === activeRoom);

  const prevMonth = () => { if (month === 0) { setYear(y => y-1); setMonth(11); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y+1); setMonth(0); } else setMonth(m => m+1); };

  const toggleSelect = (day) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };
  const selectAll    = () => setSelected(new Set(Array.from({ length: days }, (_, i) => i + 1)));
  const clearSelect  = () => setSelected(new Set());

  const handleBulkStopSell = async (stop) => {
    if (selected.size === 0) { toast.error('Select days first'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`${stop ? 'Stopped' : 'Reopened'} sales for ${selected.size} dates. Syncing to OTAs…`);
    setSaving(false);
    clearSelect();
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div><h1>Inventory Grid</h1><p>Manage room availability and stop-sell by date</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 && (
            <>
              <span style={{ fontSize: 13, alignSelf: 'center', color: 'var(--brand)' }}>
                {selected.size} dates selected
              </span>
              <button className="btn btn-sm btn-danger" onClick={() => handleBulkStopSell(true)} disabled={saving}>
                <Lock size={13} /> Stop sell
              </button>
              <button className="btn btn-sm" onClick={() => handleBulkStopSell(false)} disabled={saving}>
                <Unlock size={13} /> Open sell
              </button>
              <button className="btn btn-sm" onClick={clearSelect}>Clear</button>
            </>
          )}
        </div>
      </div>

      {/* Room type tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {ROOMS.map(r => (
          <button key={r.id} onClick={() => setActiveRoom(r.id)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: '1.5px solid',
              borderColor: activeRoom === r.id ? 'var(--brand)' : 'var(--gray-200)',
              background: activeRoom === r.id ? 'var(--brand-light)' : '#fff',
              color: activeRoom === r.id ? 'var(--brand)' : 'var(--gray-600)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
            {r.name} <span style={{ fontSize: 11, opacity: .7 }}>({r.total} rooms)</span>
          </button>
        ))}
      </div>

      <div className="card">
        {/* Month nav */}
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-sm" onClick={prevMonth}><ChevronLeft size={14} /></button>
            <span style={{ fontSize: 15, fontWeight: 600, minWidth: 160, textAlign: 'center' }}>{monthName}</span>
            <button className="btn btn-sm" onClick={nextMonth}><ChevronRight size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-sm" onClick={selectAll}>Select all</button>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              {[['#fee2e2','#c81e1e','Full'],['#fef3c7','#c27803','Low (<30%)'],['#dcfce7','#065f46','Available']].map(([bg,c,l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: bg, display: 'inline-block', border: `1px solid ${c}30` }} />
                  <span style={{ color: 'var(--gray-500)' }}>{l}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-body" style={{ overflowX: 'auto' }}>
          {/* Day-of-week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 4 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {/* Empty cells for offset */}
            {Array.from({ length: new Date(year, month, 1).getDay() }, (_, i) => (
              <div key={`e${i}`} />
            ))}

            {inv.map(({ day, available, total, rate, stopSell }) => {
              const isSelected = selected.has(day);
              const bg    = stopSell ? '#f3f4f6' : cellBg(available, total);
              const color = stopSell ? 'var(--gray-400)' : cellColor(available, total);
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

              return (
                <div key={day}
                  onClick={() => toggleSelect(day)}
                  style={{
                    borderRadius: 8, padding: '8px 6px', cursor: 'pointer',
                    background: isSelected ? '#1a56db' : bg,
                    border: `2px solid ${isSelected ? '#1e429f' : isToday ? 'var(--brand)' : 'transparent'}`,
                    position: 'relative', minHeight: 72, userSelect: 'none',
                    transition: '.1s',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? '#fff' : 'var(--gray-500)', marginBottom: 3 }}>{day}</div>

                  {stopSell ? (
                    <div style={{ fontSize: 10, color: isSelected ? '#ccc' : 'var(--gray-400)', fontWeight: 500 }}>
                      <Lock size={10} style={{ marginBottom: 2 }} /><br />Stop sell
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 16, fontWeight: 700, color: isSelected ? '#fff' : color, lineHeight: 1 }}>
                        {available}
                      </div>
                      <div style={{ fontSize: 9, color: isSelected ? '#ccc' : 'var(--gray-400)' }}>/ {total} rooms</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: isSelected ? '#93c5fd' : 'var(--gray-500)', marginTop: 4 }}>
                        ₹{(rate/1000).toFixed(1)}k
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 24, fontSize: 12 }}>
          {[
            ['Total rooms', rt?.total],
            ['Avg available', Math.round(inv.reduce((s,d) => s + d.available, 0) / inv.length)],
            ['Fully booked days', inv.filter(d => d.available === 0).length],
            ['Avg rate', '₹' + Math.round(inv.reduce((s,d) => s + d.rate, 0) / inv.length).toLocaleString('en-IN')],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ color: 'var(--gray-400)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 600, color: 'var(--gray-700)' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
