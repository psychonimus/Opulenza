import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cigarData from '../../../../data/CigarData'
import './CigarListingsBody.css'
import { getApprovedListing, updateWishListItem } from '../../../../services/sellingServices/getSellListings/getSellListings'


const CigarListingsBody = () => {


    const [favorites, setFavorites] = useState({})
    const [cigars, setCigars] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleWishList = (itemId) => {
        const currentItem = cigars.find(c => c.itemId === itemId)
        const currentFav = favorites[itemId] !== undefined 
            ? favorites[itemId] 
            : !!(currentItem?.isWishList ?? currentItem?.IsWishList)
        const newStatus = !currentFav

        const dataObject = {
            ItemId: itemId,
            IsWishList: newStatus
        }

        // Optimistically update UI
        setFavorites(prev => ({
            ...prev,
            [itemId]: newStatus
        }))
        setCigars(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: newStatus, IsWishList: newStatus } : c))

        updateWishListItem(dataObject)
            .then((res) => {
                console.log("[Wishlist updated]", res?.data)
            })
            .catch((err) => {
                console.error("[Wishlist update failed]", err)
                // Revert on failure
                setFavorites(prev => ({
                    ...prev,
                    [itemId]: currentFav
                }))
                setCigars(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: currentFav, IsWishList: currentFav } : c))
            })
    }

    const getCigarListings = (page = currentPage) => {
        setLoading(true)
        getApprovedListing(1, page)
            .then((res) => {
                const list =
                    res?.data?.data ||
                    (Array.isArray(res?.data) ? res.data : [])
                setCigars(Array.isArray(list) ? list : [])

                // Sync favorites map
                const favMap = {}
                if (Array.isArray(list)) {
                    list.forEach(item => {
                        if (item.itemId) {
                            favMap[item.itemId] = !!(item.isWishList ?? item.IsWishList)
                        }
                    })
                }
                setFavorites(prev => ({ ...favMap, ...prev }))

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
                setCigars([])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getCigarListings(currentPage)
    }, [currentPage])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }



    return (
        <section className="all-cigar-section">
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

                {cigars.length === 0 ? (
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
                        <p className="listings-empty-state__sub">Our specialists are curating rare cigar collections. Check back soon or list your own humidor.</p>
                        <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
                    </div>
                ) : (
                    <div className="all-cigar-grid">
                        {cigars.map((item) => {
                            const isFav = favorites[item.itemId] !== undefined 
                                ? favorites[item.itemId] 
                                : !!(item.isWishList ?? item.IsWishList);

                            return (
                                <div key={item.itemId || item.id} className="cigar-card">
                                    <div className="cigar-card__image-wrapper">
                                        <img
                                            src={item.details?.thumbnail || item.details?.Image1}
                                            alt={`${item.brand || item.details?.brand || 'Cigar'} ${item.details?.editionName || ''}`}
                                            className="cigar-card__image"
                                        />
                                        <div className="cigar-card__overlay" />
                                    </div>
                                    <div className="cigar-card__body">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h3 className="cigar-card__title">{item.details?.brand}</h3>
                                                <p className="cigar-card__reference">{item.details?.editionName}</p>
                                            </div>
                                            <button
                                                className={`watch-card__favorite-btn ${isFav ? 'watch-card__favorite-btn--active' : ''}`}
                                                onClick={() => handleWishList(item.itemId)}
                                                aria-label="Add to wishlist"
                                            >
                                                <svg viewBox="0 0 24 24" fill={isFav ? '#D4AF37' : 'none'} stroke={isFav ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="cigar-card__desc">{item.details?.commercialShape}</p>
                                        <div className="cigar-card__meta">
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BRAND</span>
                                                <span className="cigar-card__meta-value">{item.details?.brand || '—'}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">ORIGIN</span>
                                                <span className="cigar-card__meta-value">{item.details?.origin || '—'}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">SIZE</span>
                                                <span className="cigar-card__meta-value">{item.details?.length || '—'}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BOX YEAR</span>
                                                <span className="cigar-card__meta-value">{item.details?.boxYear || '—'}</span>
                                            </div>
                                        </div>
                                        <div className="cigar-card__footer">
                                            <div className="cigar-card__bid">
                                                <span className="cigar-card__bid-label">CURRENT BID</span>
                                                <span className="cigar-card__bid-value">${item.currentPrice}</span>
                                            </div>

                                            <Link
                                                to={`/cigar/${item.itemId}`}
                                                className="cigar-card-link"
                                            >
                                                <span className="cigar-card__cta">{item.canUserBid ? "BID NOW" : "VIEW BIDDING"}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {cigars.length > 0 && (
                    <div className="cigar-pagination">
                        <button
                            type="button"
                            className="cigar-pagination__btn cigar-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            aria-label="Previous Page"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cigar-pagination__arrow">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>

                        <div className="cigar-pagination__pages">
                            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`cigar-pagination__btn cigar-pagination__btn--page ${currentPage === page ? 'cigar-pagination__btn--active' : ''}`}
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
                            className="cigar-pagination__btn cigar-pagination__btn--nav"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.max(1, totalPages) || loading}
                            aria-label="Next Page"
                        >
                            <span>Next</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cigar-pagination__arrow">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* <div className="all-cigar-grid">
                    {cigarData.map((item) => {
                        const brand = item.details?.find(d => d.label === 'BRAND')?.value || item.title
                        const origin = item.details?.find(d => d.label === 'ORIGIN')?.value || '—'
                        const size = item.details?.find(d => d.label === 'SIZE')?.value || '—'
                        const rarity = item.details?.find(d => d.label === 'RARITY')?.value || '—'

                        return (
                            <Link
                                to={`/cigar/${item.id}`}
                                key={item.id}
                                className="cigar-card-link"
                            >
                                <div className="cigar-card">
                                    <div className="cigar-card__image-wrapper">
                                        <img
                                            src={item.image}
                                            alt={`${item.title} ${item.reference}`}
                                            className="cigar-card__image"
                                        />
                                        <div className="cigar-card__overlay" />
                                    </div>
                                    <div className="cigar-card__body">
                                        <h3 className="cigar-card__title">{item.title}</h3>
                                        <p className="cigar-card__reference">{item.reference}</p>
                                        <p className="cigar-card__desc">{item.description}</p>
                                        <div className="cigar-card__meta">
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BRAND</span>
                                                <span className="cigar-card__meta-value">{brand}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">ORIGIN</span>
                                                <span className="cigar-card__meta-value">{origin}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">SIZE</span>
                                                <span className="cigar-card__meta-value">{size}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">RARITY</span>
                                                <span className="cigar-card__meta-value">{rarity}</span>
                                            </div>
                                        </div>
                                        <div className="cigar-card__footer">
                                            <div className="cigar-card__bid">
                                                <span className="cigar-card__bid-label">CURRENT BID</span>
                                                <span className="cigar-card__bid-value">{item.currentBid}</span>
                                            </div>
                                            <span className="cigar-card__cta">BID NOW →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div> */}
            </div>
        </section >
    )
}

export default CigarListingsBody