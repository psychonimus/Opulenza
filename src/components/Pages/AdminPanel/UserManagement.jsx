import React, { useState } from 'react'
import {
  MdSearch, MdFilterList, MdMoreVert, MdEdit, MdDelete,
  MdCheckCircle, MdCancel, MdPersonAdd, MdVerified,
} from 'react-icons/md'

const users = [
  { id: 1, name: 'James Whitmore', email: 'james.w@opulenza.com', role: 'Buyer', status: 'Active', joined: 'Jan 12, 2024', verified: true, spend: '$42,800' },
  { id: 2, name: 'Sophia Chen', email: 'sophia.c@opulenza.com', role: 'Seller', status: 'Active', joined: 'Feb 3, 2024', verified: true, spend: '$128,400' },
  { id: 3, name: 'Marcus Delacroix', email: 'marcus.d@opulenza.com', role: 'Buyer', status: 'Suspended', joined: 'Mar 18, 2024', verified: false, spend: '$6,200' },
  { id: 4, name: 'Elena Vasquez', email: 'elena.v@opulenza.com', role: 'Seller', status: 'Active', joined: 'Apr 5, 2024', verified: true, spend: '$390,000' },
  { id: 5, name: 'Nathaniel Ford', email: 'nathaniel.f@opulenza.com', role: 'Buyer', status: 'Pending', joined: 'May 22, 2024', verified: false, spend: '$0' },
  { id: 6, name: 'Isabelle Laurent', email: 'isabelle.l@opulenza.com', role: 'Buyer', status: 'Active', joined: 'Jun 1, 2024', verified: true, spend: '$75,100' },
  { id: 7, name: 'Ricardo Montoya', email: 'r.montoya@opulenza.com', role: 'Seller', status: 'Active', joined: 'Jun 29, 2024', verified: true, spend: '$210,500' },
  { id: 8, name: 'Priya Nair', email: 'priya.n@opulenza.com', role: 'Buyer', status: 'Pending', joined: 'Jul 14, 2024', verified: false, spend: '$0' },
]

const statusColor = {
  Active: { bg: '#dcfce7', color: '#15803d' },
  Suspended: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const roleColor = {
  Buyer: { bg: '#eff6ff', color: '#1d4ed8' },
  Seller: { bg: '#faf5ff', color: '#7e22ce' },
}

const statCards = [
  { label: 'Total Members', value: '12,842', sub: '+218 this month', color: '#3b5bdb' },
  { label: 'Active Users', value: '11,406', sub: '88.8% of total', color: '#15803d' },
  { label: 'Suspended', value: '312', sub: '2.4% of total', color: '#b91c1c' },
  { label: 'Pending Verification', value: '148', sub: 'Needs review', color: '#b45309' },
]

const UserManagement = () => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || u.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="ap-page">
      {/* Page Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">User Management</h1>
          <p className="ap-page-subtitle">Manage registered members, roles, and account statuses.</p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdPersonAdd size={16} /> Invite User
        </button>
      </div>

      {/* Stat Row */}
      <div className="ap-stat-row">
        {statCards.map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
            <span className="ap-mini-stat__sub">{s.sub}</span>
          </div>
        ))}
      </div>2

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="ap-filter-group">
          {['All', 'Active', 'Suspended', 'Pending'].map(s => (
            <button
              key={s}
              className={`ap-filter-btn ${filterStatus === s ? 'ap-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Total Spend</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="ap-user-cell">
                    <div className="ap-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div className="ap-user-cell__name">{u.name}</div>
                      <div className="ap-user-cell__email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="ap-badge" style={roleColor[u.role]}>{u.role}</span>
                </td>
                <td>
                  <span className="ap-badge" style={statusColor[u.status]}>{u.status}</span>
                </td>
                <td className="ap-table__muted">{u.joined}</td>
                <td className="ap-table__value">{u.spend}</td>
                <td>
                  {u.verified
                    ? <MdCheckCircle size={18} color="#15803d" />
                    : <MdCancel size={18} color="#9ca3af" />}
                </td>
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn" title="Edit"><MdEdit size={15} /></button>
                    <button className="ap-icon-btn ap-icon-btn--danger" title="Delete"><MdDelete size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="ap-empty">No users match your search.</div>
        )}
      </div>
    </div>
  )
}

export default UserManagement