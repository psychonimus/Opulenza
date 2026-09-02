import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import pensData from '../../../../data/PensData'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import './AllPens.css'

const CountdownTimer = ({ endDate }) => {
    const calculateTimeLeft = (endDateStr) => {
        if (!endDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        const difference = +new Date(endDateStr) - +new Date()
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate))

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate))
        }, 1000)
        return () => clearInterval(timer)
    }, [endDate])

    const formatNum = (num) => String(num).padStart(2, '0')

    return (
        <div className="pen-card__timer">
            <span className="pen-card__timer-num">{formatNum(timeLeft.days)}</span>
            <span className="pen-card__timer-separator">:</span>
            <span className="pen-card__timer-num">{formatNum(timeLeft.hours)}</span>
            <span className="pen-card__timer-separator">:</span>
            <span className="pen-card__timer-num">{formatNum(timeLeft.minutes)}</span>
            <span className="pen-card__timer-separator">:</span>
            <span className="pen-card__timer-num">{formatNum(timeLeft.seconds)}</span>
        </div>
    )
}

const AllPens = () => {
    const [favorites, setFavorites] = useState({})
    const [pens, setPens] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const getPensListings = (page = currentPage) => {
        setLoading(true)
        getApprovedListing(4, page)
            .then((res) => {
                const list =
                    res?.data?.data ||
                    res?.data?.items ||
                    res?.data?.paginated ||
                    (Array.isArray(res?.data) ? res.data : [])
                setPens(Array.isArray(list) ? list : [])

                const totalCount = res?.data?.totalCount || res?.data?.total || res?.data?.totalRecords
                if (res?.data?.totalPages) {
                    setTotalPages(res?.data.totalPages)
                } else if (totalCount) {
                    setTotalPages(Math.max(1, Math.ceil(totalCount / 10)))
                } else {
                    setTotalPages(page + (list.length === 10 ? 1 : 0))
                }
            })
            .catch((err) => {
                console.log(err)
                setPens([])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getPensListings(currentPage)
    }, [currentPage])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="pen-listing-page">
            <div className="container">
                {/* Back to listings link */}
                <div className="detailed-page__breadcrumb">
                    <Link to="/bidPage" className="breadcrumb-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Reserves
                    </Link>
                </div>

                {pens?.length === 0 ? (
                  <div className="listings-empty-state">
                    <div className="listings-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <h3 className="listings-empty-state__title">No Listings at the Moment</h3>
                    <p className="listings-empty-state__sub">We are sourcing exceptional writing instruments from private collections. Check back soon.</p>
                    <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
                  </div>
                ) : (
                <div className="pen-grid">
                    {pens?.map(pen => (
                        <div className="pen-card" key={pen?.itemId}>

                            {/* Image */}
                            <div className="pen-card__image-container">
                                <img src={pen?.details?.thumbnail || pen.details?.image1} alt={pen?.details?.brand} className="pen-card__image" />
                                <div className="pen-card__gradient-overlay" />

                                

                                {/* <div className="pen-card__bid-overlay">
                                    <div className="pen-card__bid-label">CURRENT BID</div>
                                    <div className="pen-card__bid-value">{pen?.currentPrice}</div>
                                </div> */}
                            </div>

                            {/* Info */}
                            <div className="pen-card__info">
                                <div className="pen-card__header-row">
                                    <h3 className="pen-card__title">
                                        {pen?.details?.brand} <span className="pen-card__reference">{pen?.details?.penType}</span>
                                    </h3>
                                    <button
                                        className={`pen-card__favorite-btn ${favorites[pen?.itemId] ? 'pen-card__favorite-btn--active' : ''}`}
                                        onClick={() => toggleFavorite(pen?.itemId)}
                                        aria-label="Add to wishlist"
                                    >
                                        <svg viewBox="0 0 24 24" fill={favorites[pen?.itemId] ? '#D4AF37' : 'none'} stroke={favorites[pen?.itemId] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="pen-card__heart-icon">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* <p className="pen-card__description">{pen?.details?.description}</p> */}

                                <div className="pen-card__divider" />

                                <div className="pen-card__details-grid">
                                    {[
                                        { label: 'BRAND', value: pen?.details?.brand },
                                        { label: 'TYPE', value: pen?.details?.penType },
                                        { label: 'MANUFACTURING YEAR', value: pen?.details?.manifacturingYear},
                                        { label: 'LIMITED EDITION', value: pen?.details?.limitedEditionRegistry },
                                        { label: 'BODY MATERIAL', value: pen?.details?.bodyMaterial },
                                        // { label: 'BODY COLOR', value: pen?.details?.bodyColor },
                                        { label: 'CONDITION', value: pen?.details?.condition },
                                        
                                        
                                    ].map((detail, idx) => (
                                        <div className="pen-card__detail-item" key={idx}>
                                            <div className="pen-card__detail-label">{detail.label}</div>
                                            <div className="pen-card__detail-value">
                                                {detail.value || "—"}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pen-card__divider" />

                                <div className="pen-card__footer">
                                    <div className="pen-card__closes-container">
                                        <div className="pen-card__bid-label">CURRENT BID</div>
                                        <div className="pen-card__bid-value">$ {pen?.currentPrice}</div>
                                    </div>
                                    <Link to={`/pen/${pen?.itemId}`} style={{ textDecoration: 'none' }}>
                                        <button className="pen-card__bid-btn">PLACE A BID</button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                )}

                {/* Pen Pagination */}
                {pens?.length > 0 && (
                    <div className="pen-pagination">
                        <button
                            type="button"
                            className="pen-pagination__btn pen-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            aria-label="Previous Page"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pen-pagination__arrow">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        <div className="pen-pagination__pages">
                            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`pen-pagination__btn pen-pagination__btn--page ${currentPage === page ? 'pen-pagination__btn--active' : ''}`}
                                    onClick={() => handlePageChange(page)}
                                    disabled={loading}
                                    aria-label={`Go to page ${page}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="pen-pagination__btn pen-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.max(1, totalPages) || loading}
                            aria-label="Next Page"
                        >
                            <span>Next</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pen-pagination__arrow">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllPens
