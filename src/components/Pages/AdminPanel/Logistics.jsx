import React, { useState } from 'react'
import { MdSearch, MdLocalShipping, MdEdit } from 'react-icons/md'

const shipments = [
  { id: 'SHP-4401', item: 'Patek Philippe Nautilus 5711', buyer: 'James Whitmore', seller: 'Maison d\'Or', carrier: 'Malca-Amit', tracking: 'MA8821004', status: 'In Transit', eta: 'Jul 20, 2024' },
  { id: 'SHP-4398', item: 'Glenfarclas 1953 Cask', buyer: 'Isabelle Laurent', seller: 'Spirits & Casks', carrier: 'Brinks', tracking: 'BK7710024', status: 'Delivered', eta: 'Jul 15, 2024' },
  { id: 'SHP-4390', item: 'Monte Cristo Humidor Set', buyer: 'Nathaniel Ford', seller: 'Le Petit Fumoir', carrier: 'DHL', tracking: 'DHL9912341', status: 'Processing', eta: 'Jul 22, 2024' },
  { id: 'SHP-4385', item: 'Montblanc Heritage Pen', buyer: 'Priya Nair', seller: 'Inkwell Prestige', carrier: 'FedEx', tracking: 'FX887762', status: 'Delivered', eta: 'Jul 13, 2024' },
  { id: 'SHP-4380', item: 'Audemars Piguet Royal Oak', buyer: 'Marcus Delacroix', seller: 'Maison d\'Or', carrier: 'Malca-Amit', tracking: 'MA8820881', status: 'Delayed', eta: 'Jul 21, 2024' },
]

const statusColor = {
  'In Transit': { bg: '#dbeafe', color: '#1d4ed8' },
  Delivered: { bg: '#dcfce7', color: '#15803d' },
  Processing: { bg: '#fef3c7', color: '#b45309' },
  Delayed: { bg: '#fee2e2', color: '#b91c1c' },
}

const Logistics = () => {
  const [search, setSearch] = useState('')
  const filtered = shipments.filter(s =>
    s.item.toLowerCase().includes(search.toLowerCase()) ||
    s.buyer.toLowerCase().includes(search.toLowerCase()) ||
    s.tracking.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Logistics</h1>
          <p className="ap-page-subtitle">Track all shipments and delivery statuses across the marketplace.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Active Shipments', value: '284', color: '#3b5bdb' },
          { label: 'In Transit', value: '198', color: '#1d4ed8' },
          { label: 'Delivered (7d)', value: '72', color: '#15803d' },
          { label: 'Delayed', value: '14', color: '#b91c1c' },
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
          <input className="ap-search__input" placeholder="Search by item or tracking ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Shipment ID</th><th>Item</th><th>Buyer</th><th>Carrier</th><th>Tracking</th><th>ETA</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td className="ap-table__value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.id}</td>
                <td className="ap-table__muted" style={{ maxWidth: 180, whiteSpace: 'normal' }}>{s.item}</td>
                <td className="ap-user-cell__name">{s.buyer}</td>
                <td className="ap-table__muted">{s.carrier}</td>
                <td className="ap-table__muted" style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.tracking}</td>
                <td className="ap-table__muted">{s.eta}</td>
                <td><span className="ap-badge" style={statusColor[s.status]}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Logistics
