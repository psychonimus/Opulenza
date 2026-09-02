import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import yachtData from '../../../../data/YachtData'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import './AllYachts.css'

const CountdownTimer = ({ days, hours, minutes, seconds, endDate }) => {
    const calculateTimeLeft = () => {
        if (endDate) {
            const difference = +new Date(endDate) - +new Date()
            if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }
        return { days: days || 0, hours: hours || 0, minutes: minutes || 0, seconds: seconds || 0 }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setInterval(() => {
            if (endDate) {
                setTimeLeft(calculateTimeLeft())
            } else {
                setTimeLeft(prev => {
                    if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                        clearInterval(timer)
                        return prev
                    }
                    let s = prev.seconds - 1, m = prev.minutes, h = prev.hours, d = prev.days
                    if (s < 0) { s = 59; m -= 1 }
                    if (m < 0) { m = 59; h -= 1 }
                    if (h < 0) { h = 23; d -= 1 }
                    if (d < 0) { d = 0 }
                    return { days: d, hours: h, minutes: m, seconds: s }
                })
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [endDate, days, hours, minutes, seconds])

    const formatNum = (num) => String(num).padStart(2, '0')

    return (
        <div className="yacht-card__timer">
            <span className="yacht-card__timer-num">{formatNum(timeLeft.days)}</span>
            <span className="yacht-card__timer-separator">:</span>
            <span className="yacht-card__timer-num">{formatNum(timeLeft.hours)}</span>
            <span className="yacht-card__timer-separator">:</span>
            <span className="yacht-card__timer-num">{formatNum(timeLeft.minutes)}</span>
            <span className="yacht-card__timer-separator">:</span>
            <span className="yacht-card__timer-num">{formatNum(timeLeft.seconds)}</span>
        </div>
    )
}

const AllYachts = () => {
    const [favorites, setFavorites] = useState({})
    const [yachts, setYachts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const getYachtListings = (page = currentPage) => {
        setLoading(true)
        getApprovedListing(5, page)
            .then((res) => {
                const list =
                    res?.data?.data ||
                    res?.data?.items ||
                    res?.data?.paginated ||
                    (Array.isArray(res?.data) ? res.data : [])

                if (Array.isArray(list) && list.length > 0) {
                    setYachts(list)
                    const totalCount = res?.data?.totalCount || res?.data?.total || res?.data?.totalRecords
                    if (res?.data?.totalPages) {
                        setTotalPages(res?.data.totalPages)
                    } else if (totalCount) {
                        setTotalPages(Math.max(1, Math.ceil(totalCount / 10)))
                    } else {
                        setTotalPages(page + (list.length === 10 ? 1 : 0))
                    }
                } else {
                    setYachts(yachtData || [])
                    setTotalPages(1)
                }
            })
            .catch((err) => {
                console.log(err)
                setYachts(yachtData || [])
                setTotalPages(1)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getYachtListings(currentPage)
    }, [currentPage])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="yacht-listing-page">
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

                {yachts.length === 0 ? (
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
                    <p className="listings-empty-state__sub">Extraordinary vessels are discreetly sourced from private owners. Register your interest or submit your yacht.</p>
                    <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
                  </div>
                ) : (
                <div className="yacht-grid">
                    {yachts.map(yacht => {
                        const itemId = yacht.itemId || yacht.id
                        const image = yacht.details?.frontView || yacht.details?.openBox || yacht.details?.Image1 || yacht.image
                        const title = yacht.details?.brand || yacht.title || 'Luxury Yacht'
                        const reference = yacht.details?.model || yacht.reference || yacht.details?.editionName || ''
                        const description = yacht.details?.description || yacht.description || ''
                        const currentPrice = yacht.currentPrice ? `$${yacht.currentPrice}` : (yacht.currentBid || '$0')

                        return (
                            <div className="yacht-card" key={itemId}>
                                {/* Image */}
                                <div className="yacht-card__image-container">
                                    <img src={image} alt={title} className="yacht-card__image" />
                                    <div className="yacht-card__gradient-overlay" />

                                    {yacht.badge && (
                                        <div className="yacht-card__dossier-badge">
                                            <span className="yacht-card__dossier-dot" />
                                            {yacht.badge}
                                        </div>
                                    )}

                                    <div className="yacht-card__bid-overlay">
                                        <div className="yacht-card__bid-label">CURRENT BID</div>
                                        <div className="yacht-card__bid-value">{currentPrice}</div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="yacht-card__info">
                                    <div className="yacht-card__header-row">
                                        <h3 className="yacht-card__title">
                                            {title} {reference && <span className="yacht-card__reference">{reference}</span>}
                                        </h3>
                                        <button
                                            className={`yacht-card__favorite-btn ${favorites[itemId] ? 'yacht-card__favorite-btn--active' : ''}`}
                                            onClick={() => toggleFavorite(itemId)}
                                            aria-label="Add to wishlist"
                                        >
                                            <svg viewBox="0 0 24 24" fill={favorites[itemId] ? '#D4AF37' : 'none'} stroke={favorites[itemId] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {description && <p className="yacht-card__description">{description}</p>}

                                    <div className="yacht-card__divider" />

                                    {yacht.details && Array.isArray(yacht.details) ? (
                                        <div className="yacht-card__details-grid">
                                            {yacht.details.map((detail, idx) => (
                                                <div className="yacht-card__detail-item" key={idx}>
                                                    <div className="yacht-card__detail-label">{detail.label}</div>
                                                    <div className="yacht-card__detail-value">
                                                        {detail.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : yacht.details && typeof yacht.details === 'object' ? (
                                        <div className="yacht-card__details-grid">
                                            {Object.entries(yacht.details)
                                                .filter(([k, v]) => v && typeof v !== 'object' && !k.toLowerCase().includes('image') && !k.toLowerCase().includes('doc') && !k.toLowerCase().includes('pdf') && !k.toLowerCase().includes('url'))
                                                .slice(0, 6)
                                                .map(([key, val], idx) => (
                                                    <div className="yacht-card__detail-item" key={idx}>
                                                        <div className="yacht-card__detail-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                                                        <div className="yacht-card__detail-value">{String(val)}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : null}

                                    <div className="yacht-card__divider" />

                                    <div className="yacht-card__footer">
                                        <div className="yacht-card__closes-container">
                                            <div className="yacht-card__closes-label">CLOSES IN</div>
                                            <CountdownTimer
                                                days={yacht.initialTime?.days}
                                                hours={yacht.initialTime?.hours}
                                                minutes={yacht.initialTime?.minutes}
                                                seconds={yacht.initialTime?.seconds}
                                                endDate={yacht.auctionEndDate}
                                            />
                                        </div>
                                        <Link to={`/yacht/${itemId}`} style={{ textDecoration: 'none' }}>
                                            <button className="yacht-card__bid-btn">PLACE A BID</button>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
                )}

                {/* Yacht Pagination */}
                {yachts.length > 0 && (
                    <div className="yacht-pagination">
                        <button
                            type="button"
                            className="yacht-pagination__btn yacht-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            aria-label="Previous Page"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="yacht-pagination__arrow">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        <div className="yacht-pagination__pages">
                            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`yacht-pagination__btn yacht-pagination__btn--page ${currentPage === page ? 'yacht-pagination__btn--active' : ''}`}
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
                            className="yacht-pagination__btn yacht-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.max(1, totalPages) || loading}
                            aria-label="Next Page"
                        >
                            <span>Next</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="yacht-pagination__arrow">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllYachts
