import React, { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md'
import { addMember } from '../../../services/addMember/AddMember'

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

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  Email: '',
  MobileNo: '',
  Designation: '',
  Department: '',
  LoginId: '',
  password: '',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7280',
  letterSpacing: '0.05em',
  marginBottom: 5,
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  color: '#111827',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: 7,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const RolesPermissions = () => {
  const [selected, setSelected] = useState('Super Admin')
  const [showNewRole, setShowNewRole] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleClose = () => {
    setShowNewRole(false)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const loginObj = {
      firstName: form.firstName,
      lastName: form.lastName,
      Email: form.Email,
      MobileNo: form.MobileNo,
      Designation: form.Designation,
      Department: form.Department,
      LoginId: form.LoginId,
      password: form.password,
    }
    try {
      // TODO: wire to API
      const res = await addMember(loginObj)
      if(res.status === 200){
        toast.success("Member added successfully")
      }
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Roles &amp; Permissions</h1>
          <p className="ap-page-subtitle">Define staff roles and control access to platform sections.</p>
        </div>
        <button className="ap-btn ap-btn--primary" onClick={() => setShowNewRole(true)}>
          <MdAdd size={16} /> New Role
        </button>
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

      {/* ── New Staff / Role Modal ─────────────────────────────────── */}
      {showNewRole && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid #f0f0f0',
            }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Add New Staff Member</h2>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>Fill in the details to create a staff account.</p>
              </div>
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', lineHeight: 1, padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>

                <div>
                  <label style={labelStyle}>First Name</label>
                  <input style={inputStyle} type="text" placeholder="Tejas" value={form.firstName} onChange={set('firstName')} required />
                </div>

                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input style={inputStyle} type="text" placeholder="Banugade" value={form.lastName} onChange={set('lastName')} required />
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" placeholder="tejas@gmail.com" value={form.Email} onChange={set('Email')} required />
                </div>

                <div>
                  <label style={labelStyle}>Mobile No</label>
                  <input style={inputStyle} type="tel" placeholder="0986543210" value={form.MobileNo} onChange={set('MobileNo')} required />
                </div>

                <div>
                  <label style={labelStyle}>Designation</label>
                  <select style={inputStyle} value={form.Designation} onChange={set('Designation')} required>
                    <option value="">Select designation</option>
                    <option value="Super Administrator">Super Administrator</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Membership Manager">Membership Manager</option>
                    <option value="Asset/Auction Manager">Asset/Auction Manager</option>
                    <option value="Catalog Manager">Catalog Manager</option>
                    <option value="Luxury Concierge">Luxury Concierge</option>
                    <option value="Logistics Manager">Logistics Manager</option>
                    <option value="Warehouse Executive">Warehouse Executive</option>
                    <option value="Legal/Finance Officer">Legal/Finance Officer</option>
                    <option value="Customer Support Executive">Customer Support Executive</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Department</label>
                  <select style={inputStyle} value={form.Department} onChange={set('Department')} required>
                    <option value="">Select department</option>
                    <option value="Administration">Administration</option>
                    <option value="Membership">Membership</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Client Services">Client Services</option>
                    <option value="Operations">Operations</option>
                    <option value="Legal">Legal</option>
                    <option value="Finance">Finance</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Login ID</label>
                  <input style={inputStyle} type="text" placeholder="tejas@gmail.com" value={form.LoginId} onChange={set('LoginId')} required />
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
                </div>

              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '8px 18px', borderRadius: 7, border: '1px solid #e5e7eb',
                    background: '#f9fafb', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ap-btn ap-btn--primary"
                >
                  {submitting ? 'Creating...' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RolesPermissions
