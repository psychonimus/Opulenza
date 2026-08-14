import React, { useState, useEffect } from 'react'
import { MdSearch, MdEdit, MdDelete, MdAddCircleOutline, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { getSellListing, approveSellListing  } from '../../../services/sellingServices/getSellListings/getSellListings'
import { FaCheckCircle } from "react-icons/fa";



// const CATEGORIES = ['All', 'Watches', 'Whisky', 'Cigars', 'Pens', 'Yachts']
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
  Pending: { bg: '#fef3c7', color: '#b45309' },
  Removed: { bg: '#fee2e2', color: '#b91c1c' },
}

const PAGE_SIZE = 10

const renderCellValue = (val) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return val.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
    }
    return (
      <div style={{ fontSize: '0.75rem', lineHeight: '1.2', textAlign: 'left', minWidth: '150px' }}>
        {Object.entries(val).map(([k, v]) => {
          if (v === null || v === undefined || v === '') return null;
          return (
            <div key={k}>
              <span style={{ color: '#d6a54d', textTransform: 'capitalize' }}>{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </div>
          );
        })}
      </div>
    );
  }
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  return String(val);
};

const ListingManagement = () => {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState(0)   // pending selection
  const [appliedCat, setAppliedCat] = useState('All')   // applied filter
  const [currentPage, setCurrentPage] = useState(1)
  const [dataResult, setDataResult] = useState([])
  const [IsApproved, setIsApproved]  = useState(false)

  



  // Apply filter
  const handleApply = () => {

    getSellListing({selectedCat, currentPage}).then((res) => {
      
      setDataResult(res.data.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  // console.log("the current page is", currentPage);






  // Filter by applied category + search
  const filtered = (dataResult ?? []).filter(l => {
    const matchesCat    = appliedCat === 'All' || l.category === appliedCat
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

  const handleApproval = (l) => {
      setIsApproved(true);
      const app = IsApproved;
      // console.log("app", app)
      const dataObj = {
        itemId : l?.itemId,
        IsApproved : true,
        Reason : "Test"
      }

      approveSellListing(dataObj)
      .then((res)=> {
        console.log(res);
        console.log("Listing approved successfully");
        setIsApproved(false);
        handleApply();
        
      })
      .catch((error)=> {
        console.log(error);
        console.log("Failed to approve listing");
        throw error;
      })
      
  }




  return (
    <div className="ap-page">
      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Listing Management</h1>
          <p className="ap-page-subtitle">Browse, approve, and moderate all marketplace listings.</p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdAddCircleOutline size={16} /> New Listing
        </button>
      </div>

      {/* Stats */}
      <div className="ap-stat-row">
        {[
          { label: 'Total Listings', value: '8,402', color: '#3b5bdb' },
          { label: 'Live', value: '7,814', color: '#15803d' },
          { label: 'Pending Review', value: '482', color: '#b45309' },
          { label: 'Removed', value: '106', color: '#b91c1c' },
        ].map(s => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Category Filter */}
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

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search listings…"
            value={search}
            onChange={handleSearch}
          />
        </div>
        {appliedCat !== 'All' && (
          <span className="ap-active-filter-tag">
            {appliedCat}
            <button className="ap-active-filter-tag__clear" onClick={() => { setSelectedCat('All'); setAppliedCat('All'); setCurrentPage(1) }}>×</button>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Action</th>
              {
                dataResult?.length > 0 && Object.keys(dataResult[0])?.map((item, id) => (
                  <th key={id}>{item}</th>
                ))
              }
              
            </tr>
          </thead>
          <tbody data-lenis-prevent="true">
            {paginated.length > 0 ? paginated.map((l, key) => (
              <tr key={key}>
                <td>
                  <div className="ap-action-group">
                    <button className="ap-icon-btn" onClick={() => {handleApproval(l)}}><FaCheckCircle size={15} /></button>
                    <button className="ap-icon-btn ap-icon-btn--danger"><MdDelete size={15} /></button>
                  </div>
                </td>
                {
                  Object.keys(l).map((item, id) => (
                    <td key={id}>{renderCellValue(l[item])}</td>
                  ))
                }
                
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

export default ListingManagement
