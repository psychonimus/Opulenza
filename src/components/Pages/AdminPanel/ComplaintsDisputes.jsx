import React, { useState } from 'react'
import { MdSearch, MdEdit } from 'react-icons/md'

const disputes = [
  { id: 'DSP-301', buyer: 'Marcus Delacroix', seller: 'Ocean & Sail', item: 'Sunseeker Predator 74', amount: '$1,800,000', reason: 'Item not as described', opened: 'Jul 14, 2024', status: 'Open' },
  { id: 'DSP-298', buyer: 'James Whitmore', seller: 'Maison d\'Or', item: 'Patek Philippe Nautilus', amount: '$145,000', reason: 'Delayed delivery', opened: 'Jul 12, 2024', status: 'Under Review' },
  { id: 'DSP-291', buyer: 'Sophia Chen', seller: 'Spirits & Casks', item: 'Glenfarclas 1953', amount: '$28,500', reason: 'Authentication dispute', opened: 'Jul 8, 2024', status: 'Resolved' },
  { id: 'DSP-287', buyer: 'Priya Nair', seller: 'Le Petit Fumoir', item: 'Monte Cristo Humidor', amount: '$3,200', reason: 'Payment issue', opened: 'Jul 5, 2024', status: 'Resolved' },
  { id: 'DSP-280', buyer: 'Nathaniel Ford', seller: 'Inkwell Prestige', item: 'Montblanc Heritage', amount: '$12,400', reason: 'Counterfeit concern', opened: 'Jun 30, 2024', status: 'Escalated' },
]

const statusColor = {
  Open: { bg: '#fee2e2', color: '#b91c1c' },
  'Under Review': { bg: '#fef3c7', color: '#b45309' },
  Resolved: { bg: '#dcfce7', color: '#15803d' },
  Escalated: { bg: '#fae8ff', color: '#7e22ce' },
}

const ComplaintsDisputes = () => {
  const [search, setSearch] = useState('')
  const filtered = disputes.filter(d =>
    d.buyer.toLowerCase().includes(search.toLowerCase()) ||
    d.item.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Complaints & Disputes</h1>
          <p className="ap-page-subtitle">Resolve buyer-seller disputes and manage escalations.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Open Disputes', value: '08', color: '#b91c1c' },
          { label: 'Under Review', value: '14', color: '#b45309' },
          { label: 'Escalated', value: '03', color: '#7e22ce' },
          { label: 'Resolved (30d)', value: '42', color: '#15803d' },
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
          <input className="ap-search__input" placeholder="Search disputes…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>ID</th><th>Buyer</th><th>Seller</th><th>Item</th><th>Amount</th><th>Reason</th><th>Opened</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td className="ap-table__value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{d.id}</td>
                <td className="ap-user-cell__name">{d.buyer}</td>
                <td className="ap-table__muted">{d.seller}</td>
                <td className="ap-table__muted" style={{ maxWidth: 160, whiteSpace: 'normal' }}>{d.item}</td>
                <td className="ap-table__value">{d.amount}</td>
                <td className="ap-table__muted" style={{ maxWidth: 160, whiteSpace: 'normal', fontSize: 12 }}>{d.reason}</td>
                <td className="ap-table__muted">{d.opened}</td>
                <td><span className="ap-badge" style={statusColor[d.status]}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComplaintsDisputes
