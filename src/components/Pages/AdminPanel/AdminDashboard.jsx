import React, { useEffect, useState } from 'react'
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
  MdMenu,
} from 'react-icons/md'

import { GetDashboardStats } from '../../../services/dashboardStats/DashboardStats'

import { useUser, useAuth } from '../../../services/showUserInfo/ShowUserInfo'
import { useScroll } from 'framer-motion'

// ── Stat Cards data ──────────────────────────────────────────────────────────


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



// ── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ card }) => {


  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__label">{card.label}</span>
      <div className="admin-stat-card__bottom">
        <span className="admin-stat-card__value">{card.value}</span>
        
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
const AdminDashboard = ({ onToggleMobileSidebar }) => {

  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem('user'));

  const { userInfo, logout } = useUser()
  const [stats, setStats] = useState([]);
  
  const user = userInfo

  const handleLogout = () => {
    logout()
  }




  const getDBStats = () => {
    GetDashboardStats()
    .then((res)=> {
      setStats(res?.data?.data?.dashboard);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    getDBStats();
  }, []);


  const statCards = [
  {
    id: 'members',
    label: 'TOTAL ACTIVE MEMBERS',
    value: stats.activeMembers,
    // badge: { text: '↑ 4.2%', type: 'up' },
    icon: null,
  },
  {
    id: 'inactive',
    label: 'INACTIVE MEMBERS',
    value: stats.inActiveMembers,
    // badge: { text: 'High Priority', type: 'warning' },
    icon: null,
  },
  {
    id: 'auctions',
    label: 'LIVE AUCTIONS',
    value: stats.liveItems,
    // badge: null,
    // icon: 'toggle',
  },
  {
    id: 'claims',
    label: 'ACTIVE CLAIMS',
    value: stats.giftsClaim,
    // badge: null,
    // icon: 'muted',
  },
  // {
  //   id: 'escrow',
  //   label: 'ESCROW BALANCE',
  //   value: '$1.4B',
  //   badge: null,
  //   icon: 'escrow',
  // },
  // {
  //   id: 'audits',
  //   label: 'PENDING AUDITS',
  //   value: '14',
  //   badge: { text: '3 Overdue', type: 'danger' },
  //   icon: null,
  // },
  
  // {
  //   id: 'revenue',
  //   label: 'REVENUE GENERATED',
  //   value: '$42.8M',
  //   badge: { text: '↑ 12%', type: 'up' },
  //   icon: null,
  // },
  // {
  //   id: 'violations',
  //   label: 'OPEN VIOLATIONS',
  //   value: '02',
  //   badge: null,
  //   icon: 'warning',
  // },
]









  

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <button
            type="button"
            className="admin-topbar__menu-btn"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
          >
            <MdMenu size={22} />
          </button>
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
            <span className="admin-topbar__action-text">Quick action</span>
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
            <span className="admin-topbar__logout-text">Logout</span>
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
        {/* <GMVChart /> */}
      </div>
    </div>
  )
}

export default AdminDashboard
