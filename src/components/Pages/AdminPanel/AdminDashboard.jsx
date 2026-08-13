import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MdFilterList,
  MdFileDownload,
  MdOpenInNew,
  MdNotifications,
  MdSettings,
  MdAdd,
  MdTrendingUp,
  MdWarningAmber,
  MdVolumeOff,
  MdAccountBalanceWallet,
} from 'react-icons/md'

import { useUser, useAuth } from '../../../services/showUserInfo/ShowUserInfo'

// ── Stat Cards data ──────────────────────────────────────────────────────────
const statCards = [
  {
    id: 'members',
    label: 'TOTAL REGISTERED MEMBERS',
    value: '12,842',
    badge: { text: '↑ 4.2%', type: 'up' },
    icon: null,
  },
  {
    id: 'verifications',
    label: 'PENDING VERIFICATIONS',
    value: '148',
    badge: { text: 'High Priority', type: 'warning' },
    icon: null,
  },
  {
    id: 'auctions',
    label: 'LIVE AUCTIONS',
    value: '32',
    badge: null,
    icon: 'toggle',
  },
  {
    id: 'escrow',
    label: 'ESCROW BALANCE',
    value: '$1.4B',
    badge: null,
    icon: 'escrow',
  },
  {
    id: 'audits',
    label: 'PENDING AUDITS',
    value: '14',
    badge: { text: '3 Overdue', type: 'danger' },
    icon: null,
  },
  {
    id: 'claims',
    label: 'ACTIVE CLAIMS',
    value: '08',
    badge: null,
    icon: 'muted',
  },
  {
    id: 'revenue',
    label: 'REVENUE GENERATED',
    value: '$42.8M',
    badge: { text: '↑ 12%', type: 'up' },
    icon: null,
  },
  {
    id: 'violations',
    label: 'OPEN VIOLATIONS',
    value: '02',
    badge: null,
    icon: 'warning',
  },
]

// ── GMV Chart (SVG) ──────────────────────────────────────────────────────────
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const gmvData    = [18, 22, 28, 34, 38, 44, 52, 58, 66, 73, 82, 92]
const escrowData = [12, 15, 20, 25, 28, 33, 38, 43, 48, 54, 60, 68]

const W = 900
const H = 180
const PAD_L = 40
const PAD_R = 20
const PAD_T = 10
const PAD_B = 30

const xStep = (W - PAD_L - PAD_R) / (months.length - 1)

function toY(val) {
  return PAD_T + (H - PAD_T - PAD_B) * (1 - val / 100)
}

function buildPath(data) {
  return data
    .map((v, i) => {
      const x = PAD_L + i * xStep
      const y = toY(v)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
}

function buildArea(data) {
  const linePts = data
    .map((v, i) => `${PAD_L + i * xStep},${toY(v)}`)
    .join(' L')
  const firstX = PAD_L
  const lastX = PAD_L + (data.length - 1) * xStep
  const baseY = H - PAD_B
  return `M${firstX},${baseY} L${linePts} L${lastX},${baseY} Z`
}

const GMVChart = () => {
  const yLabels = ['$8M', '$6M', '$4M', '$2M', '$0M']




  return (
    <div className="admin-chart">
      <div className="admin-chart__header">
        <div>
          <h3 className="admin-chart__title">Gross Merchandise Volume</h3>
          <p className="admin-chart__subtitle">Marketplace revenue and escrow held over the last 12 months.</p>
        </div>
        <div className="admin-chart__legend">
          <span className="admin-chart__legend-item">
            <span className="admin-chart__legend-dot admin-chart__legend-dot--gmv" /> GMV
          </span>
          <span className="admin-chart__legend-item">
            <span className="admin-chart__legend-dot admin-chart__legend-dot--escrow" /> Escrow held
          </span>
        </div>
      </div>

      <div className="admin-chart__body">
        {/* Y-axis labels */}
        <div className="admin-chart__y-axis">
          {yLabels.map((l) => (
            <span key={l} className="admin-chart__y-label">{l}</span>
          ))}
        </div>

        {/* SVG */}
        <div className="admin-chart__svg-wrapper">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="admin-chart__svg"
          >
            <defs>
              <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4a9eff" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="escrowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b0c8e8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#b0c8e8" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((ratio) => {
              const y = PAD_T + (H - PAD_T - PAD_B) * ratio
              return (
                <line
                  key={ratio}
                  x1={PAD_L}
                  y1={y}
                  x2={W - PAD_R}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.6"
                />
              )
            })}

            {/* Escrow area */}
            <path d={buildArea(escrowData)} fill="url(#escrowGrad)" />
            {/* GMV area */}
            <path d={buildArea(gmvData)} fill="url(#gmvGrad)" />

            {/* Escrow line */}
            <path
              d={buildPath(escrowData)}
              fill="none"
              stroke="#b0c8e8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* GMV line */}
            <path
              d={buildPath(gmvData)}
              fill="none"
              stroke="#4a9eff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Month labels on x-axis */}
            {months.map((m, i) => (
              <text
                key={m}
                x={PAD_L + i * xStep}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#9ca3af"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ card }) => {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__label">{card.label}</span>
      <div className="admin-stat-card__bottom">
        <span className="admin-stat-card__value">{card.value}</span>
        {card.badge && (
          <span className={`admin-stat-card__badge admin-stat-card__badge--${card.badge.type}`}>
            {card.badge.type === 'up' && <MdTrendingUp size={12} />}
            {card.badge.type === 'warning' && <MdWarningAmber size={12} />}
            {card.badge.text}
          </span>
        )}
        {card.icon === 'toggle' && (
          <div className="admin-stat-card__icon-wrap">
            <span className="admin-toggle">
              <span className="admin-toggle__track">
                <span className="admin-toggle__knob" />
              </span>
            </span>
          </div>
        )}
        {card.icon === 'escrow' && (
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--escrow">
            <MdAccountBalanceWallet size={18} />
          </div>
        )}
        {card.icon === 'muted' && (
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--muted">
            <MdVolumeOff size={18} />
          </div>
        )}
        {card.icon === 'warning' && (
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--warning">
            <MdWarningAmber size={18} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard Component ──────────────────────────────────────────────────
const AdminDashboard = () => {

  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem('user'));

  const { userInfo } = useUser()
  const user = userInfo


  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <div className="admin-topbar__search">
            <svg className="admin-topbar__search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="#9ca3af" strokeWidth="1.5" />
              <path d="M13 13l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search listings, sellers, auctions, orders..."
              className="admin-topbar__search-input"
            />
          </div>
        </div>
        <div className="admin-topbar__right">
          <button className="admin-topbar__action-btn">
            <MdAdd size={16} />
            Quick action
          </button>
          <button className="admin-topbar__icon-btn" title="Settings">
            <MdSettings size={18} />
          </button>
          <button className="admin-topbar__icon-btn admin-topbar__icon-btn--notif" title="Notifications">
            <MdNotifications size={18} />
            <span className="admin-topbar__notif-dot" />
          </button>
          <div className="admin-topbar__avatar">
            <span className="admin-topbar__avatar-initials">{user?.firstName?.slice(0,1) + user?.lastName?.slice(0,1)}</span>
            <div className="admin-topbar__avatar-info">
              <span className="admin-topbar__avatar-name">{user?.firstName + " " + user?.lastName}</span>
              <span className="admin-topbar__avatar-role">{user?.role}</span>
            </div>
          </div>
          <button className="admin-topbar__logout-btn" onClick={handleLogout} title="Sign out">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="admin-content">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-page-header__left">
            <h1 className="admin-page-header__title">Opulenza</h1>
            <p className="admin-page-header__desc">
              Manage marketplace operations, luxury listings, authentication workflows, auctions, payments, logistics, and
              customer support from a centralized platform.
            </p>
          </div>
          <div className="admin-page-header__actions">
            <button className="admin-btn admin-btn--ghost">
              <MdFilterList size={15} /> Filter
            </button>
            <button className="admin-btn admin-btn--ghost">
              <MdFileDownload size={15} /> Export
            </button>
            <button className="admin-btn admin-btn--primary">
              <MdOpenInNew size={15} /> Open report
            </button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="admin-stats-grid">
          {statCards.map((card) => (
            <StatCard key={card.id} card={card} />
          ))}
        </div>

        {/* GMV Chart */}
        <GMVChart />
      </div>
    </div>
  )
}

export default AdminDashboard
