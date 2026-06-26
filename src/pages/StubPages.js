import React from 'react';
import { Ticket, BarChart2, Settings } from 'lucide-react';

function StubPage({ icon: Icon, title, description, features }) {
  return (
    <div className="page-body">
      <div style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--brand-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon size={30} color="var(--brand)" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 32 }}>{description}</p>
        <div style={{ display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left', maxWidth: 500 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <span style={{ background: 'var(--info-bg)', color: 'var(--info)', fontSize: 12, fontWeight: 500, padding: '6px 16px', borderRadius: 20 }}>
            Coming in Step {title === 'Promotions' ? '5' : title === 'Reports' ? '6' : '7'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Promotions() {
  return <StubPage icon={Ticket} title="Promotions" description="Create deals that push to all OTAs simultaneously"
    features={[
      { title: 'Early bird deals',    desc: 'Discount for advance bookings' },
      { title: 'Last-minute offers',  desc: 'Auto-fill empty rooms' },
      { title: 'Long stay discounts', desc: 'Reward multi-night guests' },
      { title: 'Package builder',     desc: 'Room + breakfast bundles' },
    ]} />;
}

export function Reports() {
  return <StubPage icon={BarChart2} title="Reports & Analytics" description="Revenue, occupancy and channel performance"
    features={[
      { title: 'RevPAR tracking',    desc: 'Revenue per available room' },
      { title: 'Channel ROI',        desc: 'Which OTA earns most net' },
      { title: 'Occupancy trends',   desc: '30/60/90 day forecast' },
      { title: 'Cancellation report',desc: 'Loss analysis by channel' },
    ]} />;
}

export function SettingsPage() {
  return <StubPage icon={Settings} title="Settings" description="Hotel profile, room setup, OTA credentials"
    features={[
      { title: 'Hotel profile',    desc: 'Name, address, amenities' },
      { title: 'Room types',       desc: 'Add, edit, set base rates' },
      { title: 'OTA credentials', desc: 'Connect your API keys' },
      { title: 'Staff accounts',  desc: 'Roles and permissions' },
    ]} />;
}
