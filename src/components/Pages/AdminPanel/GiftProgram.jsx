import React, { useEffect, useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdCardGiftcard } from 'react-icons/md'
import { getGiftingList } from '../../../services/giftForm/GiftForm';



const statusColor = {
  Claimed: { bg: '#dcfce7', color: '#15803d' },
  Delivered: { bg: '#dbeafe', color: '#1d4ed8' },
  Pending: { bg: '#fef3c7', color: '#b45309' },
}

const GiftProgram = () => {

  const [giftList, setGiftList] = useState([]);

  const getGiftListings = () => {
    getGiftingList()
      .then((res) => {
        setGiftList(res?.data?.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  console.log(giftList)



  useEffect(() => {
    getGiftListings();
  }, [])




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
            <tr><th>Gift Id</th><th>Member Id</th><th>Full Name</th><th>Address</th><th>City</th><th>State</th><th>Country</th><th>Postal Code</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {giftList.map(g => (
              <tr key={g.id}>
                <td className="ap-user-cell__name">{g.gifts?.welcomeGiftId}</td>
                <td className="ap-table__muted">{g?.gifts?.memberId}</td>
                <td className="ap-table__muted">{g?.gifts?.fullName}</td>
                <td className="ap-table__value">{g?.gifts?.address}</td>
                <td className="ap-table__muted">{g.gifts?.city}</td>
                <td className="ap-table__muted">{g.gifts?.state}</td>
                <td className="ap-table__muted">{g.gifts?.country}</td>
                <td className="ap-table__muted">{g.gifts?.postalCode}</td>
                <td className="ap-table__muted">{g.gifts?.phoneNumber}</td>
                <td><span className="ap-badge" style={statusColor[g?.gifts?.isDelivered === true ? "Delivered" : "Pending"]}>{g.gifts?.isDelivered === true ? "Delivered" : "Pending"}</span></td>
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
