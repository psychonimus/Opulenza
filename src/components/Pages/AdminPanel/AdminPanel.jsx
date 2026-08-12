import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import Invitations from './Invitations'
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

import { useUser } from '../../../services/showUserInfo/ShowUserInfo'


const Unauthorized = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: '1.2rem' }}>
    🚫 You do not have permission to view this page.
  </div>
)

const ROUTE_MAP = {
  dashboard: {
    component: AdminDashboard,
    roles: ["SuperAdmin", "SellerManager"]

  },
  "user-management": {
    component: UserManagement,
    roles: ["SuperAdmin"]
  },
  invitations: {
    component: Invitations,
    roles: ["SuperAdmin"]
  },
  "seller-management": {
    component: SellerManagement,
    roles: ["SuperAdmin", "SellerManager"]
  },
  "listing-management": {
    component: ListingManagement,
    roles: ["SuperAdmin", "ListingManager"]
  },
  authentication: {
    component: Authentication,
    roles: ["SuperAdmin"]
  },
  "valuation-requests": {
    component: ValuationRequests,
    roles: ["SuperAdmin", "ValuationTeam"]
  },
  "auction-management": {
    component: AuctionManagement,
    roles: ["SuperAdmin", "AuctionManager"]
  },
  "offers-negotiations": {
    component: OffersNegotiations,
    roles: ["SuperAdmin", "Sales"]
  },
  "escrow-payments": {
    component: EscrowPayments,
    roles: ["SuperAdmin", "Finance"]
  },
  logistics: {
    component: Logistics,
    roles: ["SuperAdmin", "Logistics"]
  },
  "vault-management": {
    component: VaultManagement,
    roles: ["SuperAdmin", "VaultManager"]
  },
  "complaints-disputes": {
    component: ComplaintsDisputes,
    roles: ["SuperAdmin", "Support"]
  },
  "marketing-promotions": {
    component: MarketingPromotions,
    roles: ["SuperAdmin", "Marketing"]
  },
  "gift-program": {
    component: GiftProgram,
    roles: ["SuperAdmin", "Marketing"]
  },
  "analytics-reports": {
    component: AnalyticsReports,
    roles: ["SuperAdmin", "Management"]
  },
  "roles-permissions": {
    component: RolesPermissions,
    roles: ["SuperAdmin"]
  },
  "platform-settings": {
    component: PlatformSettings,
    roles: ["SuperAdmin"]
  }
};

const AdminPanel = () => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // const ActivePage = ROUTE_MAP[activeNav] || AdminDashboard
  const isDashboard = activeNav === 'dashboard'

  // const user = JSON.parse(localStorage.getItem('user'));

  const { userInfo } = useUser()
  const role = userInfo?.role


  

  const currentRoute = ROUTE_MAP[activeNav];

  const hasAccess =
    currentRoute?.roles.includes(role);

  const ActivePage = hasAccess
    ? currentRoute.component
    : Unauthorized;



// console.log("AdminPanel: userInfo:", userInfo);


  return (
    <div className="admin-root">
      <AdminSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        role={role}
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
                  <MdAdd size={16} /> Quick actions
                </button>
                <button className="admin-topbar__icon-btn" title="Settings">
                  <MdSettings size={18} />
                </button>
                <button className="admin-topbar__icon-btn admin-topbar__icon-btn--notif" title="Notifications">
                  <MdNotifications size={18} />
                  <span className="admin-topbar__notif-dot" />
                </button>
                <div className="admin-topbar__avatar">
                  <span className="admin-topbar__avatar-initials">{userInfo?.firstName?.slice(0,1) + userInfo?.lastName?.slice(0,1)}</span>
                  <div className="admin-topbar__avatar-info">
                    <span className="admin-topbar__avatar-name">{userInfo.firstrName}</span>
                    <span className="admin-topbar__avatar-role">{userInfo.role}</span>
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
