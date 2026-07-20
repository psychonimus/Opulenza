import React, { useState } from 'react'
import { MdSearch, MdEdit } from 'react-icons/md'

const negotiations = [
  { id: 1, buyer: 'James Whitmore', seller: 'Maison d\'Or', item: 'Patek Philippe Nautilus', listed: '$145,000', offered: '$132,000', status: 'Counter-Offered', date: 'Jul 16, 2024' },
  { id: 2, buyer: 'Isabelle Laurent', seller: 'Spirits & Casks', item: 'Glenfarclas 1953', listed: '$28,500', offered: '$25,000', status: 'Pending', date: 'Jul 17, 2024' },
  { id: 3, buyer: 'Marcus Delacroix', seller: 'Ocean & Sail', item: 'Sunseeker Predator 74', listed: '$1,800,000', offered: '$1,650,000', status: 'Accepted', date: 'Jul 14, 2024' },
  { id: 4, buyer: 'Priya Nair', seller: 'Inkwell Prestige', item: 'Montblanc Heritage Set', listed: '$12,400', offered: '$10,000', status: 'Rejected', date: 'Jul 15, 2024' },
]

const statusColor = {
  'Counter-Offered': { bg: '#dbeafe', color: '#1d4ed8' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
  Accepted: { bg: '#dcfce7', color: '#15803d' },
  Rejected: { bg: '#fee2e2', color: '#b91c1c' },
}

const OffersNegotiations = () => {
  const [search, setSearch] = useState('')
  const filtered = negotiations.filter(n =>
    n.buyer.toLowerCase().includes(search.toLowerCase()) ||
    n.item.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Offers & Negotiations</h1>
          <p className="ap-page-subtitle">Monitor buyer offers and seller counter-negotiations.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Active Offers', value: '214', color: '#3b5bdb' },
          { label: 'Accepted', value: '128', color: '#15803d' },
          { label: 'Pending', value: '58', color: '#b45309' },
          { label: 'Rejected', value: '28', color: '#b91c1c' },
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
          <input className="ap-search__input" placeholder="Search offers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Buyer</th><th>Seller</th><th>Item</th><th>Listed Price</th><th>Offer</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(n => (
              <tr key={n.id}>
                <td className="ap-user-cell__name">{n.buyer}</td>
                <td className="ap-table__muted">{n.seller}</td>
                <td className="ap-table__muted" style={{ maxWidth: 180, whiteSpace: 'normal' }}>{n.item}</td>
                <td className="ap-table__muted">{n.listed}</td>
                <td className="ap-table__value">{n.offered}</td>
                <td className="ap-table__muted">{n.date}</td>
                <td><span className="ap-badge" style={statusColor[n.status]}>{n.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OffersNegotiations
