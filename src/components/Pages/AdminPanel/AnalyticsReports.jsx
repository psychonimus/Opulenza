import React from 'react'
import { MdTrendingUp, MdPeople, MdShoppingCart, MdAttachMoney } from 'react-icons/md'

const W = 500
const H = 120
const PAD = { l: 10, r: 10, t: 10, b: 10 }
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const gmvData    = [18, 22, 28, 34, 38, 44, 52, 58, 66, 73, 82, 92]
const usersData  = [30, 35, 40, 46, 54, 62, 70, 76, 82, 87, 92, 98]

const xStep = (W - PAD.l - PAD.r) / (months.length - 1)
function toY(val, max = 100) {
  return PAD.t + (H - PAD.t - PAD.b) * (1 - val / max)
}
function buildPath(data) {
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${PAD.l + i * xStep},${toY(v)}`).join(' ')
}
function buildArea(data) {
  const line = data.map((v, i) => `${PAD.l + i * xStep},${toY(v)}`).join(' L')
  return `M${PAD.l},${H - PAD.b} L${line} L${PAD.l + (data.length-1)*xStep},${H - PAD.b} Z`
}

const MiniChart = ({ data, color, gradId }) => (
  <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 80 }}>
    <defs>
      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </linearGradient>
    </defs>
    <path d={buildArea(data)} fill={`url(#${gradId})`} />
    <path d={buildPath(data)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const metrics = [
  { label: 'Total Revenue', value: '$42.8M', change: '+12% vs last month', color: '#3b5bdb', icon: MdAttachMoney },
  { label: 'New Members', value: '+218', change: 'This month', color: '#15803d', icon: MdPeople },
  { label: 'Orders Placed', value: '1,840', change: '+8% vs last month', color: '#7e22ce', icon: MdShoppingCart },
  { label: 'Avg. Order Value', value: '$23,260', change: '+4% vs last month', color: '#b45309', icon: MdTrendingUp },
]

const topCategories = [
  { name: 'Watches', revenue: '$18.4M', share: 43 },
  { name: 'Yachts', revenue: '$12.2M', share: 28 },
  { name: 'Whisky', revenue: '$6.8M', share: 16 },
  { name: 'Cigars', revenue: '$3.4M', share: 8 },
  { name: 'Pens', revenue: '$2.0M', share: 5 },
]

const AnalyticsReports = () => {
  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Analytics & Reports</h1>
          <p className="ap-page-subtitle">Platform-wide performance, revenue trends, and member insights.</p>
        </div>
        <button className="ap-btn ap-btn--ghost">Export Report</button>
      </div>

      {/* Metric cards */}
      <div className="ap-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {metrics.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="admin-stat-card__label">{m.label}</span>
                <Icon size={18} color={m.color} />
              </div>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>{m.value}</span>
              <span style={{ fontSize: 11, color: '#15803d' }}>↑ {m.change}</span>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="admin-chart">
          <h3 className="admin-chart__title" style={{ marginBottom: 4 }}>GMV Trend</h3>
          <p className="admin-chart__subtitle" style={{ marginBottom: 8 }}>Gross merchandise volume over 12 months</p>
          <MiniChart data={gmvData} color="#3b5bdb" gradId="g1" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#9ca3af', marginTop: 4 }}>
            {months.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="admin-chart">
          <h3 className="admin-chart__title" style={{ marginBottom: 4 }}>Member Growth</h3>
          <p className="admin-chart__subtitle" style={{ marginBottom: 8 }}>Cumulative member registrations</p>
          <MiniChart data={usersData} color="#15803d" gradId="g2" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#9ca3af', marginTop: 4 }}>
            {months.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Top categories */}
      <div className="admin-chart">
        <h3 className="admin-chart__title" style={{ marginBottom: 12 }}>Revenue by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topCategories.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 72, fontSize: 13, color: '#374151', fontWeight: 500 }}>{c.name}</span>
              <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: `${c.share}%`, height: '100%', background: '#3b5bdb', borderRadius: 8, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ width: 60, fontSize: 12, color: '#6b7280', textAlign: 'right' }}>{c.revenue}</span>
              <span style={{ width: 30, fontSize: 11, color: '#9ca3af' }}>{c.share}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsReports
