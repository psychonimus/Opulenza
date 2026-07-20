import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import SellerManagement from './SellerManagement'
import ListingManagement from './ListingManagement'
import Authentication from './Authentication'
import ValuationRequests from './ValuationRequests'
import AuctionManagement from './AuctionManagement'
import OffersNegotiations from './OffersNegotiations'
import EscrowPayments from './EscrowPayments'
import Logistics from './Logistics'
import VaultManagement from './VaultManagement'
import ComplaintsDisputes from './ComplaintsDisputes'
import MarketingPromotions from './MarketingPromotions'
import GiftProgram from './GiftProgram'
import AnalyticsReports from './AnalyticsReports'
import RolesPermissions from './RolesPermissions'
import PlatformSettings from './PlatformSettings'
import {
  MdAdd, MdSettings, MdNotifications,
} from 'react-icons/md'
import './AdminPanel.css'

const ROUTE_MAP = {
  'dashboard':           AdminDashboard,
  'user-management':     UserManagement,
  'seller-management':   SellerManagement,
  'listing-management':  ListingManagement,
  'authentication':      Authentication,
  'valuation-requests':  ValuationRequests,
  'auction-management':  AuctionManagement,
  'offers-negotiations': OffersNegotiations,
  'escrow-payments':     EscrowPayments,
  'logistics':           Logistics,
  'vault-management':    VaultManagement,
  'complaints-disputes': ComplaintsDisputes,
  'marketing-promotions':MarketingPromotions,
  'gift-program':        GiftProgram,
  'analytics-reports':   AnalyticsReports,
  'roles-permissions':   RolesPermissions,
  'platform-settings':   PlatformSettings,
}

const AdminPanel = () => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const ActivePage = ROUTE_MAP[activeNav] || AdminDashboard
  const isDashboard = activeNav === 'dashboard'

  return (
    <div className="admin-root">
      <AdminSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main area */}
      <div className={`admin-main ${sidebarCollapsed ? 'admin-main--collapsed' : ''}`}>
        {isDashboard ? (
          /* Dashboard has its own full layout including topbar */
          <AdminDashboard />
        ) : (
          /* All other pages share a common shell */
          <div className="admin-dashboard">
            {/* Shared Top Bar */}
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
                  <MdAdd size={16} /> Quick action
                </button>
                <button className="admin-topbar__icon-btn" title="Settings">
                  <MdSettings size={18} />
                </button>
                <button className="admin-topbar__icon-btn admin-topbar__icon-btn--notif" title="Notifications">
                  <MdNotifications size={18} />
                  <span className="admin-topbar__notif-dot" />
                </button>
                <div className="admin-topbar__avatar">
                  <span className="admin-topbar__avatar-initials">PM</span>
                  <div className="admin-topbar__avatar-info">
                    <span className="admin-topbar__avatar-name">Prename</span>
                    <span className="admin-topbar__avatar-role">Super Admin</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Page content */}
            <div className="admin-content">
              <ActivePage />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
