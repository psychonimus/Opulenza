import React, { useState } from 'react'
import { MdSearch, MdEdit } from 'react-icons/md'

const transactions = [
  { id: 'TXN-8821', buyer: 'James Whitmore', seller: 'Maison d\'Or', amount: '$145,000', escrow: 'Held', released: '—', date: 'Jul 16, 2024', status: 'In Escrow' },
  { id: 'TXN-8810', buyer: 'Isabelle Laurent', seller: 'Spirits & Casks', amount: '$28,500', escrow: 'Released', released: 'Jul 15, 2024', date: 'Jul 10, 2024', status: 'Completed' },
  { id: 'TXN-8798', buyer: 'Marcus Delacroix', seller: 'Ocean & Sail', amount: '$1,800,000', escrow: 'Held', released: '—', date: 'Jul 14, 2024', status: 'Disputed' },
  { id: 'TXN-8785', buyer: 'Priya Nair', seller: 'Inkwell Prestige', amount: '$12,400', escrow: 'Released', released: 'Jul 13, 2024', date: 'Jul 8, 2024', status: 'Completed' },
  { id: 'TXN-8771', buyer: 'Nathaniel Ford', seller: 'Le Petit Fumoir', amount: '$3,200', escrow: 'Pending', released: '—', date: 'Jul 17, 2024', status: 'Pending' },
]

const statusColor = {
  'In Escrow': { bg: '#dbeafe', color: '#1d4ed8' },
  Completed: { bg: '#dcfce7', color: '#15803d' },
  Disputed: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const EscrowPayments = () => {
  const [search, setSearch] = useState('')
  const filtered = transactions.filter(t =>
    t.buyer.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Escrow & Payments</h1>
          <p className="ap-page-subtitle">Manage escrow holdings, payment releases, and dispute resolutions.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Escrow Balance', value: '$1.4B', color: '#3b5bdb' },
          { label: 'Pending Release', value: '$48.2M', color: '#b45309' },
          { label: 'Disputed', value: '$12.8M', color: '#b91c1c' },
          { label: 'Released (30d)', value: '$220M', color: '#15803d' },
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
          <input className="ap-search__input" placeholder="Search by TXN ID or buyer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>TXN ID</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Escrow</th><th>Released</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="ap-table__value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.id}</td>
                <td className="ap-user-cell__name">{t.buyer}</td>
                <td className="ap-table__muted">{t.seller}</td>
                <td className="ap-table__value">{t.amount}</td>
                <td className="ap-table__muted">{t.escrow}</td>
                <td className="ap-table__muted">{t.released}</td>
                <td className="ap-table__muted">{t.date}</td>
                <td><span className="ap-badge" style={statusColor[t.status]}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EscrowPayments
