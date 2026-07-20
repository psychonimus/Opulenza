import React, { useState } from 'react'
import { MdSearch, MdCheckCircle, MdCancel, MdHourglassEmpty } from 'react-icons/md'

const requests = [
  { id: 1, user: 'James Whitmore', item: 'Patek Philippe Nautilus', type: 'Watch', submitted: 'Jul 15, 2024', status: 'Approved', expert: 'Dr. Alain Brunet' },
  { id: 2, user: 'Priya Nair', item: 'Glenfarclas 1953 Cask', type: 'Whisky', submitted: 'Jul 16, 2024', status: 'Pending', expert: 'Unassigned' },
  { id: 3, user: 'Marcus Delacroix', item: 'Montblanc 149 Set', type: 'Pen', submitted: 'Jul 14, 2024', status: 'Rejected', expert: 'Sara Lindt' },
  { id: 4, user: 'Elena Vasquez', item: 'Sunseeker Predator 74', type: 'Yacht', submitted: 'Jul 13, 2024', status: 'Approved', expert: 'Capt. Hugo Ward' },
  { id: 5, user: 'Nathaniel Ford', item: 'Monte Cristo No.2', type: 'Cigar', submitted: 'Jul 17, 2024', status: 'Pending', expert: 'Unassigned' },
]

const statusColor = {
  Approved: { bg: '#dcfce7', color: '#15803d' },
  Rejected: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const statusIcon = { Approved: MdCheckCircle, Rejected: MdCancel, Pending: MdHourglassEmpty }

const Authentication = () => {
  const [search, setSearch] = useState('')
  const filtered = requests.filter(r =>
    r.user.toLowerCase().includes(search.toLowerCase()) ||
    r.item.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Authentication</h1>
          <p className="ap-page-subtitle">Review and manage item authentication requests from buyers and sellers.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Total Requests', value: '2,108', color: '#3b5bdb' },
          { label: 'Approved', value: '1,820', color: '#15803d' },
          { label: 'Pending', value: '148', color: '#b45309' },
          { label: 'Rejected', value: '140', color: '#b91c1c' },
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
            <tr><th>Requester</th><th>Item</th><th>Type</th><th>Submitted</th><th>Expert</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const Icon = statusIcon[r.status]
              return (
                <tr key={r.id}>
                  <td className="ap-user-cell__name">{r.user}</td>
                  <td className="ap-table__muted" style={{ maxWidth: 200, whiteSpace: 'normal' }}>{r.item}</td>
                  <td><span className="ap-badge" style={{ bg: '#eff6ff', color: '#1d4ed8', background: '#eff6ff' }}>{r.type}</span></td>
                  <td className="ap-table__muted">{r.submitted}</td>
                  <td className="ap-table__muted">{r.expert}</td>
                  <td>
                    <span className="ap-badge" style={statusColor[r.status]}>
                      <Icon size={12} /> {r.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Authentication
