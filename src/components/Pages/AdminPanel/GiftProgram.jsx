import React, { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdCardGiftcard } from 'react-icons/md'

const gifts = [
  { id: 1, recipient: 'James Whitmore', occasion: 'Milestone Purchase', item: 'Opulenza Gold Card', value: '$5,000', sent: 'Jul 10, 2024', status: 'Claimed' },
  { id: 2, recipient: 'Elena Vasquez', occasion: 'Top Seller Award', item: 'Crystal Decanter Set', value: '$1,200', sent: 'Jul 12, 2024', status: 'Delivered' },
  { id: 3, recipient: 'Sophia Chen', occasion: 'Anniversary', item: 'Leather Portfolio', value: '$380', sent: 'Jul 15, 2024', status: 'Pending' },
  { id: 4, recipient: 'Ricardo Montoya', occasion: 'Referral Reward', item: 'Opulenza Credit $500', value: '$500', sent: 'Jul 8, 2024', status: 'Claimed' },
  { id: 5, recipient: 'Isabelle Laurent', occasion: '1-Year Membership', item: 'Concierge Upgrade', value: '$2,000', sent: 'Jul 5, 2024', status: 'Delivered' },
]

const statusColor = {
  Claimed: { bg: '#dcfce7', color: '#15803d' },
  Delivered: { bg: '#dbeafe', color: '#1d4ed8' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const GiftProgram = () => {
  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Gift Program</h1>
          <p className="ap-page-subtitle">Manage luxury gifting for member milestones, top sellers, and loyalty rewards.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdAdd size={16} /> Send Gift</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Gifts Sent (30d)', value: '184', color: '#3b5bdb' },
          { label: 'Total Value', value: '$128K', color: '#15803d' },
          { label: 'Claimed', value: '142', color: '#15803d' },
          { label: 'Pending', value: '18', color: '#b45309' },
        ].map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr><th>Recipient</th><th>Occasion</th><th>Gift</th><th>Value</th><th>Sent</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {gifts.map(g => (
              <tr key={g.id}>
                <td className="ap-user-cell__name">{g.recipient}</td>
                <td className="ap-table__muted">{g.occasion}</td>
                <td className="ap-table__muted">{g.item}</td>
                <td className="ap-table__value">{g.value}</td>
                <td className="ap-table__muted">{g.sent}</td>
                <td><span className="ap-badge" style={statusColor[g.status]}>{g.status}</span></td>
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

export default GiftProgram
