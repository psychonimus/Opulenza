import React, { useState } from 'react'
import { MdSave } from 'react-icons/md'

const Toggle = ({ label, desc, defaultOn = true }) => {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => setOn(!on)} style={{
        width: 40, height: 22, borderRadius: 20, border: 'none', cursor: 'pointer', padding: 3,
        background: on ? '#3b5bdb' : '#d1d5db', transition: 'background 0.2s', position: 'relative',
      }}>
        <span style={{
          display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transform: on ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s',
        }} />
      </button>
    </div>
  )
}

const PlatformSettings = () => {
  const [siteName, setSiteName] = useState('Opulenza')
  const [commissionRate, setCommissionRate] = useState('4.5')
  const [supportEmail, setSupportEmail] = useState('support@opulenza.com')

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Platform Settings</h1>
          <p className="ap-page-subtitle">Configure global marketplace settings, fees, and feature toggles.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdSave size={16} /> Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* General Settings */}
        <div className="ap-table-card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>General</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Platform Name', value: siteName, set: setSiteName },
              { label: 'Support Email', value: supportEmail, set: setSupportEmail },
              { label: 'Commission Rate (%)', value: commissionRate, set: setCommissionRate },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
                    fontSize: 13, color: '#111827', background: '#f9fafb', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="ap-table-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Feature Flags</h3>
          <Toggle label="Live Auctions" desc="Allow real-time bidding on listings" defaultOn={true} />
          <Toggle label="Vault Storage" desc="Enable in-house vault deposit feature" defaultOn={true} />
          <Toggle label="Concierge Service" desc="AI-assisted luxury buying concierge" defaultOn={true} />
          <Toggle label="Gift Program" desc="Member loyalty and gifting system" defaultOn={true} />
          <Toggle label="Escrow Auto-Release" desc="Auto-release after delivery confirmation" defaultOn={false} />
          <Toggle label="Maintenance Mode" desc="Disable public access to the platform" defaultOn={false} />
        </div>
      </div>
    </div>
  )
}

export default PlatformSettings
