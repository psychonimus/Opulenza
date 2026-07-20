import React, { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md'

const roles = [
  { id: 1, name: 'Super Admin', users: 2, permissions: 'Full Access', color: '#b91c1c' },
  { id: 2, name: 'Operations Manager', users: 8, permissions: 'Listings, Users, Auctions', color: '#1d4ed8' },
  { id: 3, name: 'Support Agent', users: 24, permissions: 'Disputes, Logistics', color: '#15803d' },
  { id: 4, name: 'Finance Manager', users: 6, permissions: 'Escrow, Payments, Reports', color: '#7e22ce' },
  { id: 5, name: 'Content Moderator', users: 14, permissions: 'Listings, Authentication', color: '#b45309' },
]

const permMatrix = ['Dashboard', 'Users', 'Sellers', 'Listings', 'Auctions', 'Escrow', 'Disputes', 'Reports']
const rolePerms = {
  'Super Admin': [1, 1, 1, 1, 1, 1, 1, 1],
  'Operations Manager': [1, 1, 1, 1, 1, 0, 0, 1],
  'Support Agent': [1, 0, 0, 0, 0, 0, 1, 0],
  'Finance Manager': [1, 0, 0, 0, 0, 1, 1, 1],
  'Content Moderator': [1, 0, 0, 1, 0, 0, 0, 0],
}

const RolesPermissions = () => {
  const [selected, setSelected] = useState('Super Admin')

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Roles & Permissions</h1>
          <p className="ap-page-subtitle">Define staff roles and control access to platform sections.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdAdd size={16} /> New Role</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Role list */}
        <div className="ap-table-card" style={{ padding: 0, overflow: 'hidden' }}>
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => setSelected(r.name)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 18px',
                background: selected === r.name ? '#eef2ff' : 'transparent',
                border: 'none', borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.12s',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: selected === r.name ? '#3b5bdb' : '#111827' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.users} staff members</div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="ap-table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Permissions for: {selected}</h3>
            <button className="ap-icon-btn"><MdEdit size={15} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {permMatrix.map((perm, idx) => {
              const hasAccess = rolePerms[selected]?.[idx]
              return (
                <div key={perm} style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: hasAccess ? '#f0fdf4' : '#f9fafb',
                  border: `1px solid ${hasAccess ? '#bbf7d0' : '#e5e7eb'}`,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <MdCheckCircle size={16} color={hasAccess ? '#15803d' : '#d1d5db'} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: hasAccess ? '#15803d' : '#9ca3af' }}>{perm}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RolesPermissions
