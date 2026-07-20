import React, { useState } from 'react'
import { MdSearch, MdEdit, MdDelete } from 'react-icons/md'

const requests = [
  { id: 1, user: 'Nathaniel Ford', item: 'Patek Philippe Calatrava', category: 'Watch', submitted: 'Jul 17, 2024', estimatedValue: '$62,000', status: 'Pending' },
  { id: 2, user: 'Priya Nair', item: 'Dalmore 50 Year Single Malt', category: 'Whisky', submitted: 'Jul 16, 2024', estimatedValue: '$18,500', status: 'In Progress' },
  { id: 3, user: 'Marcus Delacroix', item: 'Cohiba Behike 52 Box', category: 'Cigar', submitted: 'Jul 14, 2024', estimatedValue: '$4,200', status: 'Completed' },
  { id: 4, user: 'Isabelle Laurent', item: 'Richard Mille RM 27-03', category: 'Watch', submitted: 'Jul 12, 2024', estimatedValue: '$720,000', status: 'Completed' },
  { id: 5, user: 'James Whitmore', item: 'Sunseeker Portofino 40', category: 'Yacht', submitted: 'Jul 10, 2024', estimatedValue: '$540,000', status: 'In Progress' },
]

const statusColor = {
  Completed: { bg: '#dcfce7', color: '#15803d' },
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const ValuationRequests = () => {
  const [search, setSearch] = useState('')
  const filtered = requests.filter(r =>
    r.user.toLowerCase().includes(search.toLowerCase()) ||
    r.item.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Valuation Requests</h1>
          <p className="ap-page-subtitle">Track and manage item valuation submissions from members.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Total Requests', value: '628', color: '#3b5bdb' },
          { label: 'Completed', value: '480', color: '#15803d' },
          { label: 'In Progress', value: '110', color: '#1d4ed8' },
          { label: 'Pending', value: '38', color: '#b45309' },
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
          <input className="ap-search__input" placeholder="Search requests…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Requester</th><th>Item</th><th>Category</th><th>Submitted</th><th>Est. Value</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="ap-user-cell__name">{r.user}</td>
                <td className="ap-table__muted" style={{ maxWidth: 200, whiteSpace: 'normal' }}>{r.item}</td>
                <td className="ap-table__muted">{r.category}</td>
                <td className="ap-table__muted">{r.submitted}</td>
                <td className="ap-table__value">{r.estimatedValue}</td>
                <td><span className="ap-badge" style={statusColor[r.status]}>{r.status}</span></td>
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

export default ValuationRequests
