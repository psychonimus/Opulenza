import React from 'react'
import {
  MdDashboard,
  MdPeople,
  MdStorefront,
  MdListAlt,
  MdVerifiedUser,
  MdRequestPage,
  MdGavel,
  MdHandshake,
  MdAccountBalance,
  MdLocalShipping,
  MdLock,
  MdReport,
  MdCampaign,
  MdCardGiftcard,
  MdBarChart,
  MdKey,
  MdSettings,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md'

const navGroups = [
  {
    label: 'OPERATIONS',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
      { id: 'user-management', label: 'User Management', icon: MdPeople },
      { id: 'seller-management', label: 'Seller Management', icon: MdStorefront },
      { id: 'listing-management', label: 'Listing Management', icon: MdListAlt },
      { id: 'authentication', label: 'Authentication', icon: MdVerifiedUser },
      { id: 'valuation-requests', label: 'Valuation Requests', icon: MdRequestPage },
    ],
  },
  {
    label: 'COMMERCE',
    items: [
      { id: 'auction-management', label: 'Auction Management', icon: MdGavel },
      { id: 'offers-negotiations', label: 'Offers & Negotiations', icon: MdHandshake },
      { id: 'escrow-payments', label: 'Escrow & Payments', icon: MdAccountBalance },
      { id: 'logistics', label: 'Logistics', icon: MdLocalShipping },
      { id: 'vault-management', label: 'Vault Management', icon: MdLock },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      { id: 'complaints-disputes', label: 'Complaints & Disputes', icon: MdReport },
      { id: 'marketing-promotions', label: 'Marketing & Promotions', icon: MdCampaign },
      { id: 'gift-program', label: 'Gift Program', icon: MdCardGiftcard },
      { id: 'analytics-reports', label: 'Analytics & Reports', icon: MdBarChart },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'roles-permissions', label: 'Roles & Permissions', icon: MdKey },
      { id: 'platform-settings', label: 'Platform Settings', icon: MdSettings },
    ],
  },
]

const AdminSidebar = ({ activeNav, setActiveNav, collapsed, setCollapsed }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="admin-sidebar__logo">
        {!collapsed && (
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">Opulenza</span>
            <span className="admin-sidebar__brand-sub">Control Center</span>
          </div>
        )}
        <button
          className="admin-sidebar__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="admin-sidebar__search">
          <MdSearch size={15} className="admin-sidebar__search-icon" />
          <input
            type="text"
            placeholder="Search listings, sellers..."
            className="admin-sidebar__search-input"
          />
        </div>
      )}

      {/* Nav Groups */}
      <nav className="admin-sidebar__nav">
        {navGroups.map((group) => (
          <div key={group.label} className="admin-sidebar__group">
            {!collapsed && (
              <span className="admin-sidebar__group-label">{group.label}</span>
            )}
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className={`admin-sidebar__nav-item ${activeNav === item.id ? 'admin-sidebar__nav-item--active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={17} className="admin-sidebar__nav-icon" />
                  {!collapsed && (
                    <span className="admin-sidebar__nav-label">{item.label}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
