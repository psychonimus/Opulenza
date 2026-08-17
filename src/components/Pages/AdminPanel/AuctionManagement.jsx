import React, { useState, useEffect } from 'react'
import { MdSearch, MdEdit, MdDelete, MdAddCircleOutline, MdChevronLeft, MdChevronRight, MdGavel } from 'react-icons/md'

import { getApprovedListing } from '../../../services/sellingServices/getSellListings/getSellListings'
import { FaCheckCircle } from "react-icons/fa";







const CATEGORIES = [{
  id: 0,
  name: 'All'
}, {
  id: 1,
  name: 'Watches'
}, {
  id: 2,
  name: 'Whisky'
}, {
  id: 3,
  name: 'Cigars'
}, {
  id: 4,
  name: 'Pens'
}, {
  id: 5,
  name: 'Yachts'
}]

const statusColor = {
  Live: { bg: '#dcfce7', color: '#15803d' },
  Ended: { bg: '#f3f4f6', color: '#6b7280' },
  Scheduled: { bg: '#dbeafe', color: '#1d4ed8' },
}

const AuctionManagement = () => {
  const [search, setSearch] = useState('')
  // const filtered = auctions.filter(a =>
  //   a.title.toLowerCase().includes(search.toLowerCase())
  // )

  const [selectedCat, setSelectedCat] = useState(0)   // pending selection
  const [appliedCat, setAppliedCat] = useState('All')   // applied filter
  const [currentPage, setCurrentPage] = useState(1)
  const [dataResult, setDataResult] = useState([])
  const [IsApproved, setIsApproved] = useState(false)

  const PAGE_SIZE = 10;


  const handleApply = () => {
    getApprovedListing(selectedCat)
      .then((res) => {

        setDataResult(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        throw error;
      })

  }


  // Filter by applied category + search
  const filtered = (dataResult ?? []).filter(l => {
    const matchesCat = appliedCat === 'All' || l.category === appliedCat
    const matchesSearch = search.trim() === ''
      ? true
      : Object.values(l).some(v =>
        String(v ?? '').toLowerCase().includes(search.toLowerCase())
      )
    return matchesCat && matchesSearch
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages))


  // console.log('paginated', paginated)

  // Reset page on search change
  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }




  useEffect(() => {
    handleApply();
  }, [])


  return (
    <div className="ap-page" data-lenis-prevent="true">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Auction Management</h1>
          <p className="ap-page-subtitle">Monitor active auctions, bids, and scheduling.</p>
        </div>
        <button className="ap-btn ap-btn--primary"><MdGavel size={16} /> Create Auction</button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: 'Live Auctions', value: '32', color: '#15803d' },
          { label: 'Scheduled', value: '14', color: '#1d4ed8' },
          { label: 'Ended Today', value: '8', color: '#6b7280' },
          { label: 'Total Bids (7d)', value: '1,482', color: '#3b5bdb' },
        ].map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="ap-category-filter">
        <span className="ap-category-filter__label">Category</span>
        <div className="ap-category-filter__chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`ap-category-chip${selectedCat === cat.id ? ' ap-category-chip--active' : ''}`}
              onClick={() => setSelectedCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          className="ap-btn ap-btn--primary ap-category-filter__apply"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>

      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input className="ap-search__input" placeholder="Search auctions…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Action</th>
              {
                dataResult?.length > 0 && (
                  <>
                    {Object.keys(dataResult[0])
                      .filter((item) => item !== "details")
                      .map((item, id) => (
                        <th key={id}>{item}</th>
                      ))}

                    {Object.keys(dataResult[0]?.details || {}).map((item, id) => (
                      <th key={`details-${id}`}>{item}</th>
                    ))}
                  </>
                )
              }

            </tr>
          </thead>
          <tbody data-lenis-prevent="true">
            {dataResult?.length > 0 ? dataResult.map((l, key) => (
              <tr key={key}>
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn" onClick={() => { setIsApproved(true), handleApproval(l) }}><FaCheckCircle size={15} /></button>
                    <button className="ap-icon-btn ap-icon-btn--danger"><MdDelete size={15} /></button>
                  </div>
                </td>

                {/* {
                  Object.keys(l).map((item, id) => (
                    <td key={id}>{l[item]||JSON.stringify(l[item?.details])}</td>
                  ))

                } */}

                {Object.keys(l)
        .filter((item) => item !== "details")
        .map((item, id) => (
          <td key={id}>
            {l[item] || "-"}
          </td>
        ))}

      {/* Details fields */}
      {Object.keys(l.details || {}).map((item, id) => (
        <td key={`details-${id}`}>
          {l.details[item] || "-"}
        </td>
      ))}


              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="ap-empty">No listings found.</td>
              </tr>
            )}
          </tbody>
        </table>


      </div>

      {/* Pagination */}
      <div className="ap-pagination">
        <span className="ap-pagination__info">
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} listings
        </span>
        <div className="ap-pagination__controls">
          <button
            className="ap-pagination__btn"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            <MdChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`ap-pagination__btn${safePage === p ? ' ap-pagination__btn--active' : ''}`}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="ap-pagination__btn"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
          >
            <MdChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuctionManagement
