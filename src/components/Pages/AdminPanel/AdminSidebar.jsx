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
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: MdDashboard,
        roles: ['SuperAdmin', 'SellerManager']
      },
      {
        id: 'user-management',
        label: 'User Management',
        icon: MdPeople,
        roles: ['SuperAdmin']
      },
      {
        id: 'seller-management',
        label: 'Seller Management',
        icon: MdStorefront,
        roles: ["SuperAdmin", 'SellerManager']
      },
      {
        id: 'listing-management',
        label: 'Listing Management',
        icon: MdListAlt,
        roles: ['ListingManager']
      },
      {
        id: 'authentication',
        label: 'Authentication',
        icon: MdVerifiedUser,
        roles: ['SuperAdmin']
      },
      {
        id: 'valuation-requests',
        label: 'Valuation Requests',
        icon: MdRequestPage,
        roles: ['SuperAdmin', 'ValuationTeam']
      },
    ],
  },
  {
    label: 'COMMERCE',
    items: [
      {
        id: 'auction-management',
        label: 'Auction Management',
        icon: MdGavel,
        roles: ['SuperAdmin', 'AuctionManager']
      },
      {
        id: 'offers-negotiations',
        label: 'Offers & Negotiations',
        icon: MdHandshake,
        roles: ['SuperAdmin', 'Sales']
      },
      {
        id: 'escrow-payments',
        label: 'Escrow & Payments',
        icon: MdAccountBalance,
        roles: ['SuperAdmin', 'Finance']
      },
      {
        id: 'logistics',
        label: 'Logistics',
        icon: MdLocalShipping,
        roles: ['SuperAdmin', 'Logistics']
      },
      {
        id: 'vault-management',
        label: 'Vault Management',
        icon: MdLock,
        roles: ['SuperAdmin', 'VaultManager']
      },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      {
        id: 'complaints-disputes',
        label: 'Complaints & Disputes',
        icon: MdReport,
        roles: ['SuperAdmin', 'Support']
      },
      {
        id: 'marketing-promotions',
        label: 'Marketing & Promotions',
        icon: MdCampaign,
        roles: ['SuperAdmin', 'Marketing']
      },
      {
        id: 'gift-program',
        label: 'Gift Program',
        icon: MdCardGiftcard,
        roles: ['SuperAdmin', 'Marketing']
      },
      {
        id: 'analytics-reports',
        label: 'Analytics & Reports',
        icon: MdBarChart,
        roles: ['SuperAdmin', 'Management']
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        id: 'roles-permissions',
        label: 'Roles & Permissions',
        icon: MdKey,
        roles: ['SuperAdmin']
      },
      {
        id: 'platform-settings',
        label: 'Platform Settings',
        icon: MdSettings,
        roles: ['SuperAdmin']
      },
    ],
  },
]

const AdminSidebar = ({
  activeNav,
  setActiveNav,
  collapsed,
  setCollapsed,
  role,
}) => {
  return (
    <aside
      className={`admin-sidebar ${
        collapsed ? 'admin-sidebar--collapsed' : ''
      }`}
    >
      {/* Logo */}
      <div className="admin-sidebar__logo">
        {!collapsed && (
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">Opulenza</span>
            <span className="admin-sidebar__brand-sub">
              Control Center
            </span>
          </div>
        )}

        <button
          className="admin-sidebar__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <MdChevronRight size={18} />
          ) : (
            <MdChevronLeft size={18} />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="admin-sidebar__search">
          <MdSearch
            size={15}
            className="admin-sidebar__search-icon"
          />

          <input
            type="text"
            placeholder="Search..."
            className="admin-sidebar__search-input"
          />
        </div>
      )}

      <nav className="admin-sidebar__nav">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(role)
          )

          if (visibleItems.length === 0) return null

          return (
            <div
              key={group.label}
              className="admin-sidebar__group"
            >
              {!collapsed && (
                <span className="admin-sidebar__group-label">
                  {group.label}
                </span>
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.id}
                    className={`admin-sidebar__nav-item ${
                      activeNav === item.id
                        ? 'admin-sidebar__nav-item--active'
                        : ''
                    }`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <Icon
                      size={17}
                      className="admin-sidebar__nav-icon"
                    />

                    {!collapsed && (
                      <span className="admin-sidebar__nav-label">
                        {item.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar