import React, { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdTrendingUp } from 'react-icons/md'

const campaigns = [
  { id: 1, name: 'Summer Vault Showcase', type: 'Email', audience: '8,400 members', opens: '62%', clicks: '18%', revenue: '$480K', status: 'Active', starts: 'Jul 1, 2024' },
  { id: 2, name: 'Whisky Week Promo', type: 'Banner', audience: '3,200 sellers', opens: '—', clicks: '24%', revenue: '$92K', status: 'Active', starts: 'Jul 15, 2024' },
  { id: 3, name: 'Watch Auction Blast', type: 'Push', audience: '12,842 all', opens: '41%', clicks: '12%', revenue: '$1.2M', status: 'Completed', starts: 'Jun 20, 2024' },
  { id: 4, name: 'New Member Welcome', type: 'Email', audience: 'New signups', opens: '74%', clicks: '32%', revenue: '—', status: 'Active', starts: 'Jan 1, 2024' },
  { id: 5, name: 'Black Friday Luxury Drop', type: 'Multi-channel', audience: '12,842 all', opens: '—', clicks: '—', revenue: '—', status: 'Scheduled', starts: 'Nov 28, 2024' },
]

const statusColor = {
  Active: { bg: '#dcfce7', color: '#15803d' },
  Completed: { bg: '#f3f4f6', color: '#6b7280' },
  Scheduled: { bg: '#dbeafe', color: '#1d4ed8' },
}

const MarketingPromotions = () => {
  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Marketing & Promotions</h1>
          <p className="ap-page-subtitle">Create and manage campaigns, banners, and member outreach.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdAdd size={16} /> New Campaign</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Active Campaigns', value: '12', color: '#15803d' },
          { label: 'Avg. Open Rate', value: '58.4%', color: '#3b5bdb' },
          { label: 'Revenue (30d)', value: '$1.8M', color: '#15803d' },
          { label: 'Scheduled', value: '4', color: '#1d4ed8' },
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
            <tr><th>Campaign</th><th>Type</th><th>Audience</th><th>Open Rate</th><th>Clicks</th><th>Revenue</th><th>Launched</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td className="ap-user-cell__name">{c.name}</td>
                <td className="ap-table__muted">{c.type}</td>
                <td className="ap-table__muted">{c.audience}</td>
                <td className="ap-table__value">{c.opens}</td>
                <td className="ap-table__value">{c.clicks}</td>
                <td className="ap-table__value">{c.revenue}</td>
                <td className="ap-table__muted">{c.starts}</td>
                <td><span className="ap-badge" style={statusColor[c.status]}>{c.status}</span></td>
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

export default MarketingPromotions
