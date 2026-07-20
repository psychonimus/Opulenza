import React, { useState } from 'react'
import { MdSearch, MdEdit, MdDelete, MdAddCircleOutline } from 'react-icons/md'

const listings = [
  { id: 1, title: 'Patek Philippe Nautilus 5711', category: 'Watches', seller: 'Maison d\'Or', price: '$145,000', status: 'Live', views: 2840, created: 'Jul 1, 2024' },
  { id: 2, title: 'Glenfarclas 1953 Single Cask', category: 'Whisky', seller: 'Spirits & Casks', price: '$28,500', status: 'Live', views: 1240, created: 'Jul 3, 2024' },
  { id: 3, title: 'Monte Cristo No.2 Humidor Set', category: 'Cigars', seller: 'Le Petit Fumoir', price: '$3,200', status: 'Pending', views: 310, created: 'Jul 10, 2024' },
  { id: 4, title: 'Sunseeker Predator 74 Yacht', category: 'Yachts', seller: 'Ocean & Sail', price: '$1,800,000', status: 'Live', views: 5820, created: 'Jun 20, 2024' },
  { id: 5, title: 'Montblanc 149 Meisterstück Set', category: 'Pens', seller: 'Inkwell Prestige', price: '$12,400', status: 'Removed', views: 430, created: 'Jun 28, 2024' },
  { id: 6, title: 'Audemars Piguet Royal Oak 15500', category: 'Watches', seller: 'Maison d\'Or', price: '$88,000', status: 'Live', views: 3110, created: 'Jul 12, 2024' },
]

const statusColor = {
  Live: { bg: '#dcfce7', color: '#15803d' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
  Removed: { bg: '#fee2e2', color: '#b91c1c' },
}

const ListingManagement = () => {
  const [search, setSearch] = useState('')
  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.seller.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Listing Management</h1>
          <p className="ap-page-subtitle">Browse, approve, and moderate all marketplace listings.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdAddCircleOutline size={16} /> New Listing</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Total Listings', value: '8,402', color: '#3b5bdb' },
          { label: 'Live', value: '7,814', color: '#15803d' },
          { label: 'Pending Review', value: '482', color: '#b45309' },
          { label: 'Removed', value: '106', color: '#b91c1c' },
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
          <input className="ap-search__input" placeholder="Search listings…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Listing</th><th>Category</th><th>Seller</th><th>Price</th><th>Views</th><th>Created</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td className="ap-user-cell__name" style={{ maxWidth: 220, whiteSpace: 'normal', lineHeight: 1.4 }}>{l.title}</td>
                <td className="ap-table__muted">{l.category}</td>
                <td className="ap-table__muted">{l.seller}</td>
                <td className="ap-table__value">{l.price}</td>
                <td className="ap-table__muted">{l.views.toLocaleString()}</td>
                <td className="ap-table__muted">{l.created}</td>
                <td><span className="ap-badge" style={statusColor[l.status]}>{l.status}</span></td>
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn"><MdEdit size={15} /></button>
                    <button className="ap-icon-btn ap-icon-btn--danger"><MdDelete size={15} /></button>
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

export default ListingManagement
