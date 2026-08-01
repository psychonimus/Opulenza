import React, { useState, useEffect } from 'react'
import {
  MdSearch, MdFilterList, MdMoreVert, MdEdit, MdDelete,
  MdCheckCircle, MdCancel, MdPersonAdd, MdVerified,
} from 'react-icons/md'

import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";

import {userData} from '../../../services/getUserData/GetUserData'




// const users = [
//   { id: 1, name: 'James Whitmore', email: 'james.w@opulenza.com', role: 'Buyer', status: 'Active', joined: 'Jan 12, 2024', verified: true, spend: '$42,800' },
//   { id: 2, name: 'Sophia Chen', email: 'sophia.c@opulenza.com', role: 'Seller', status: 'Active', joined: 'Feb 3, 2024', verified: true, spend: '$128,400' },
//   { id: 3, name: 'Marcus Delacroix', email: 'marcus.d@opulenza.com', role: 'Buyer', status: 'Suspended', joined: 'Mar 18, 2024', verified: false, spend: '$6,200' },
//   { id: 4, name: 'Elena Vasquez', email: 'elena.v@opulenza.com', role: 'Seller', status: 'Active', joined: 'Apr 5, 2024', verified: true, spend: '$390,000' },
//   { id: 5, name: 'Nathaniel Ford', email: 'nathaniel.f@opulenza.com', role: 'Buyer', status: 'Pending', joined: 'May 22, 2024', verified: false, spend: '$0' },
//   { id: 6, name: 'Isabelle Laurent', email: 'isabelle.l@opulenza.com', role: 'Buyer', status: 'Active', joined: 'Jun 1, 2024', verified: true, spend: '$75,100' },
//   { id: 7, name: 'Ricardo Montoya', email: 'r.montoya@opulenza.com', role: 'Seller', status: 'Active', joined: 'Jun 29, 2024', verified: true, spend: '$210,500' },
//   { id: 8, name: 'Priya Nair', email: 'priya.n@opulenza.com', role: 'Buyer', status: 'Pending', joined: 'Jul 14, 2024', verified: false, spend: '$0' },
// ]

const statusColor = {
  Active: { bg: '#dcfce7', color: '#15803d' },
  Suspended: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const roleColor = {
  Buyer: { bg: '#eff6ff', color: '#1d4ed8' },
  Seller: { bg: '#faf5ff', color: '#7e22ce' },
}

const statCards = [
  { label: 'Total Members', value: '12,842', sub: '+218 this month', color: '#3b5bdb' },
  { label: 'Active Users', value: '11,406', sub: '88.8% of total', color: '#15803d' },
  { label: 'Suspended', value: '312', sub: '2.4% of total', color: '#b91c1c' },
  { label: 'Pending Verification', value: '148', sub: 'Needs review', color: '#b45309' },
]

const UserManagement = () => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  // const filtered = users.filter(u => {
  //   const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
  //     u.email.toLowerCase().includes(search.toLowerCase())
  //   const matchStatus = filterStatus === 'All' || u.status === filterStatus
  //   return matchSearch && matchStatus
  // })

  const [approvalList, setApprovalList] = useState([]);

  useEffect(() => {
    userData().then(res => {
      setApprovalList(res.data.data);
    })
  }, []);

  return (
    <div className="ap-page">
      {/* Page Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">User Management</h1>
          <p className="ap-page-subtitle">Manage registered members, roles, and account statuses.</p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdPersonAdd size={16} /> Invite User
        </button>
      </div>

      {/* Stat Row */}
      <div className="ap-stat-row">
        {statCards.map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
            <span className="ap-mini-stat__sub">{s.sub}</span>
          </div>
        ))}
      </div>2

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="ap-filter-group">
          {['All', 'Active', 'Suspended', 'Pending'].map(s => (
            <button
              key={s}
              className={`ap-filter-btn ${filterStatus === s ? 'ap-filter-btn--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Member Id</th>
              <th>Member No.</th>
              <th>Membership Type</th>
              <th>Membership Status</th>
              {/* <th>Membership Status</th> */}
              <th>Title</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Display Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Primary Email</th>
              <th>Secondary Email</th>
              <th>Primary Mobile</th>
              <th>Secondary Mobile</th>
              <th>Family Office Name</th>
              <th>Occupation</th>
              <th>Company Name</th>
              <th>Website</th>
              <th>Bio</th>
              <th>Created On</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {approvalList.map((u, id) => (
              <tr key={u.id}>
                <td>
                  <div className="ap-user-cell">
                    <div className="ap-avatar">{id}</div>
                    
                    
                  </div>
                </td>
                <td>
                  <span className="ap-badge" style={roleColor[u.role]}>{u.memberID}</span>
                </td>
                <td>
                  <span className="ap-badge" style={statusColor[u.status]}>{u.memberNo}</span>
                </td>
                <td className="ap-table__muted">{u.membershipType}</td>
                <td className="ap-table__value">{u.membershipStatus}</td>
                <td className="ap-table__value">{u.title}</td>
                <td className="ap-table__value">{u.firstName}</td>
                <td className="ap-table__value">{u.middleName}</td>
                <td className="ap-table__value">{u.lastName}</td>
                <td className="ap-table__value">{u.displayName}</td>
                <td className="ap-table__value">{u.dateOfBirth}</td>
                <td className="ap-table__value">{u.gender}</td>
                <td className="ap-table__value">{u.primaryEmail}</td>
                <td className="ap-table__value">{u.secondaryEmail}</td>
                <td className="ap-table__value">{u.primaryMobile}</td>
                <td className="ap-table__value">{u.secondaryMobile}</td>
                <td className="ap-table__value">{u.familyOfficeName}</td>
                <td className="ap-table__value">{u.occupation}</td>
                <td className="ap-table__value">{u.companyName}</td>
                <td className="ap-table__value">{u.website}</td>
                <td className="ap-table__value">{u.bio}</td>
                <td className="ap-table__value">{u.createdOn}</td>
                
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn" title="Edit"><FaCheckCircle size={15} /></button>
                    <button className="ap-icon-btn ap-icon-btn--danger" title="Delete"><RiCloseCircleFill size={15} /></button>
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

export default UserManagement