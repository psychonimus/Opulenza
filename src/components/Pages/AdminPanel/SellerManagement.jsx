import React, { useState } from 'react'
import { MdSearch, MdEdit, MdCheckCircle, MdCancel, MdAddBusiness, MdVerified, MdStar } from 'react-icons/md'

const sellers = [
  { id: 1, name: 'Maison d\'Or Watches', owner: 'Elena Vasquez', category: 'Watches', listings: 34, sales: '$1.2M', rating: 4.9, status: 'Verified', since: 'Mar 2023' },
  { id: 2, name: 'Spirits & Casks', owner: 'Ricardo Montoya', category: 'Whisky', listings: 18, sales: '$480K', rating: 4.7, status: 'Verified', since: 'Jun 2023' },
  { id: 3, name: 'Le Petit Fumoir', owner: 'Isabelle Laurent', category: 'Cigars', listings: 9, sales: '$62K', rating: 4.5, status: 'Pending', since: 'Jan 2024' },
  { id: 4, name: 'Ocean & Sail', owner: 'James Whitmore', category: 'Yachts', listings: 4, sales: '$8.9M', rating: 4.8, status: 'Verified', since: 'Nov 2022' },
  { id: 5, name: 'Inkwell Prestige', owner: 'Sophia Chen', category: 'Pens', listings: 22, sales: '$95K', rating: 4.6, status: 'Suspended', since: 'Apr 2024' },
]

const statusColor = {
  Verified: { bg: '#dcfce7', color: '#15803d' },
  Suspended: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const SellerManagement = () => {
  const [search, setSearch] = useState('')
  const filtered = sellers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Seller Management</h1>
          <p className="ap-page-subtitle">Review, verify, and manage luxury marketplace sellers.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdAddBusiness size={16} /> Add Seller</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Total Sellers', value: '1,284', color: '#3b5bdb' },
          { label: 'Verified', value: '1,104', color: '#15803d' },
          { label: 'Pending Review', value: '142', color: '#b45309' },
          { label: 'Suspended', value: '38', color: '#b91c1c' },
        ].map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input className="ap-search__input" placeholder="Search sellers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Store</th><th>Category</th><th>Listings</th><th>Total Sales</th><th>Rating</th><th>Since</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="ap-user-cell">
                    <div className="ap-avatar" style={{ background: '#eef2ff', color: '#3b5bdb' }}>{s.name[0]}</div>
                    <div>
                      <div className="ap-user-cell__name">{s.name}</div>
                      <div className="ap-user-cell__email">{s.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="ap-table__muted">{s.category}</td>
                <td className="ap-table__value">{s.listings}</td>
                <td className="ap-table__value">{s.sales}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13 }}>
                    <MdStar size={14} color="#f59e0b" /> {s.rating}
                  </span>
                </td>
                <td className="ap-table__muted">{s.since}</td>
                <td><span className="ap-badge" style={statusColor[s.status]}>{s.status}</span></td>
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn" title="Edit"><MdEdit size={15} /></button>
                    <button className="ap-icon-btn" title="Verify"><MdVerified size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerManagement
