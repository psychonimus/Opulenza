import React, { useState } from 'react'
import { MdSearch, MdGavel, MdEdit } from 'react-icons/md'

const auctions = [
  { id: 1, title: 'Patek Philippe Nautilus 5711', seller: 'Maison d\'Or', startBid: '$120,000', currentBid: '$145,000', bids: 24, ends: 'Jul 20, 2024', status: 'Live' },
  { id: 2, title: 'Glenfarclas 1953 Single Cask', seller: 'Spirits & Casks', startBid: '$22,000', currentBid: '$28,500', bids: 11, ends: 'Jul 22, 2024', status: 'Live' },
  { id: 3, title: 'Audemars Piguet Royal Oak', seller: 'Maison d\'Or', startBid: '$75,000', currentBid: '$88,000', bids: 18, ends: 'Jul 18, 2024', status: 'Ended' },
  { id: 4, title: 'Sunseeker Predator 74', seller: 'Ocean & Sail', startBid: '$1,600,000', currentBid: '$1,800,000', bids: 6, ends: 'Jul 25, 2024', status: 'Scheduled' },
  { id: 5, title: 'Montblanc Heritage Pen Set', seller: 'Inkwell Prestige', startBid: '$9,000', currentBid: '$12,400', bids: 9, ends: 'Jul 21, 2024', status: 'Live' },
]

const statusColor = {
  Live: { bg: '#dcfce7', color: '#15803d' },
  Ended: { bg: '#f3f4f6', color: '#6b7280' },
  Scheduled: { bg: '#dbeafe', color: '#1d4ed8' },
}

const AuctionManagement = () => {
  const [search, setSearch] = useState('')
  const filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Auction Management</h1>
          <p className="ap-page-subtitle">Monitor active auctions, bids, and scheduling.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdGavel size={16} /> Create Auction</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Live Auctions', value: '32', color: '#15803d' },
          { label: 'Scheduled', value: '14', color: '#1d4ed8' },
          { label: 'Ended Today', value: '8', color: '#6b7280' },
          { label: 'Total Bids (7d)', value: '1,482', color: '#3b5bdb' },
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
          <input className="ap-search__input" placeholder="Search auctions…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Item</th><th>Seller</th><th>Start Bid</th><th>Current Bid</th><th>Bids</th><th>Ends</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td className="ap-user-cell__name" style={{ maxWidth: 200, whiteSpace: 'normal' }}>{a.title}</td>
                <td className="ap-table__muted">{a.seller}</td>
                <td className="ap-table__muted">{a.startBid}</td>
                <td className="ap-table__value">{a.currentBid}</td>
                <td className="ap-table__muted">{a.bids}</td>
                <td className="ap-table__muted">{a.ends}</td>
                <td><span className="ap-badge" style={statusColor[a.status]}>{a.status}</span></td>
                <td><button className="ap-icon-btn"><MdEdit size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuctionManagement
