import React, { useState } from 'react'
import { MdSearch, MdLock, MdEdit } from 'react-icons/md'

const vaultItems = [
  { id: 'VLT-001', item: 'Richard Mille RM 27-03', owner: 'Isabelle Laurent', category: 'Watch', value: '$720,000', deposited: 'Jan 12, 2024', vault: 'Geneva Vault A', status: 'Stored' },
  { id: 'VLT-002', item: 'Dalmore 50 Year Cask', owner: 'Ricardo Montoya', category: 'Whisky', value: '$180,000', deposited: 'Mar 8, 2024', vault: 'London Vault B', status: 'Stored' },
  { id: 'VLT-003', item: 'Cohiba Behike Collection', owner: 'Marcus Delacroix', category: 'Cigar', value: '$42,000', deposited: 'May 22, 2024', vault: 'Dubai Vault A', status: 'Reserved' },
  { id: 'VLT-004', item: 'Montblanc 1912 Heritage', owner: 'Sophia Chen', category: 'Pen', value: '$28,000', deposited: 'Jun 5, 2024', vault: 'Singapore Vault', status: 'Out for Auth.' },
  { id: 'VLT-005', item: 'Patek Philippe Ref 1518', owner: 'Elena Vasquez', category: 'Watch', value: '$1,200,000', deposited: 'Feb 14, 2024', vault: 'Geneva Vault A', status: 'Stored' },
]

const statusColor = {
  Stored: { bg: '#dcfce7', color: '#15803d' },
  Reserved: { bg: '#dbeafe', color: '#1d4ed8' },
  'Out for Auth.': { bg: '#fef3c7', color: '#b45309' },
}

const VaultManagement = () => {
  const [search, setSearch] = useState('')
  const filtered = vaultItems.filter(v =>
    v.item.toLowerCase().includes(search.toLowerCase()) ||
    v.owner.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Vault Management</h1>
          <p className="ap-page-subtitle">Manage high-value items stored in Opulenza secure vaults worldwide.</p>
        </div>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Items in Vault', value: '1,240', color: '#3b5bdb' },
          { label: 'Total Value', value: '$4.8B', color: '#15803d' },
          { label: 'Reserved', value: '84', color: '#1d4ed8' },
          { label: 'Out for Auth.', value: '22', color: '#b45309' },
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
          <input className="ap-search__input" placeholder="Search vault items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Vault ID</th><th>Item</th><th>Owner</th><th>Category</th><th>Value</th><th>Location</th><th>Deposited</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td className="ap-table__value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.id}</td>
                <td className="ap-user-cell__name" style={{ maxWidth: 180, whiteSpace: 'normal' }}>{v.item}</td>
                <td className="ap-table__muted">{v.owner}</td>
                <td className="ap-table__muted">{v.category}</td>
                <td className="ap-table__value">{v.value}</td>
                <td className="ap-table__muted">{v.vault}</td>
                <td className="ap-table__muted">{v.deposited}</td>
                <td><span className="ap-badge" style={statusColor[v.status]}>{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VaultManagement
