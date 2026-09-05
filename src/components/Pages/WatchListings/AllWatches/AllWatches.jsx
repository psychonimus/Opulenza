import React, { useState, useEffect } from 'react'
import './AllWatches.css'
import { Link } from 'react-router-dom'
// import watchData from '../../data/WatchData'
import watchData from '../../../../data/WatchData'
import { getApprovedListing, updateWishListItem } from '../../../../services/sellingServices/getSellListings/getSellListings'

// const watchData = [
//   {
//     id: 1,
//     image: '/images/pattek-phillipe.jpg',
//     title: 'Patek Philippe',
//     reference: 'Ref. 2499, First Series',
//     description: 'From a Geneva estate. Single ownership since 1962.',
//     badge: 'SEALED DOSSIER',
//     currentBid: '$2.84M',
//     detailedpage: "/detailedPage",
//     details: [
//       { label: 'OWNERSHIP', value: 'European Collection' },
//       { label: 'ACQUIRED', value: '1962' },
//       { label: 'STATUS', value: 'Identity Withheld' },
//       { label: 'VIEWING', value: '12 Members' },
//       { label: 'SCARCITY', value: '1 of 4 known' },
//       { label: 'RETURN', value: '+287%', isGold: true },
//     ],
//     initialTime: { hours: 2, minutes: 14, seconds: 33 }
//   },
//   {
//     id: 2,
//     image: '/images/pattek-phillipe-2.jpg',
//     title: 'Patek Philippe',
//     reference: 'Ref. 2499, First Series',
//     description: 'From a Geneva estate. Single ownership since 1962.',
//     badge: 'SEALED DOSSIER',
//     currentBid: '$2.84M',
//     details: [
//       { label: 'OWNERSHIP', value: 'European Collection' },
//       { label: 'ACQUIRED', value: '1962' },
//       { label: 'STATUS', value: 'Identity Withheld' },
//       { label: 'VIEWING', value: '12 Members' },
//       { label: 'SCARCITY', value: '1 of 4 known' },
//       { label: 'RETURN', value: '+287%', isGold: true },
//     ],
//     initialTime: { hours: 2, minutes: 14, seconds: 33 }
//   }
// ]

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

const CountdownTimer = ({ endDateStr }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endDateStr))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDateStr))
    }, 1000)

    return () => clearInterval(timer)
  }, [endDateStr])

  const formatNum = (num) => String(num).padStart(2, '0')

  return (
    <div className="watch-card__timer">
      <span className="watch-card__timer-num">{formatNum(timeLeft.days)}</span>
      <span className="watch-card__timer-separator">:</span>
      <span className="watch-card__timer-num">{formatNum(timeLeft.hours)}</span>
      <span className="watch-card__timer-separator">:</span>
      <span className="watch-card__timer-num">{formatNum(timeLeft.minutes)}</span>
      <span className="watch-card__timer-separator">:</span>
      <span className="watch-card__timer-num">{formatNum(timeLeft.seconds)}</span>
    </div>
  )
}

const AllWatches = () => {
  const [favorites, setFavorites] = useState({})
  const [watches, setWatches] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleWishList = (itemId) => {
    const currentItem = watches.find(c => c.itemId === itemId)
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
    setWatches(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: newStatus, IsWishList: newStatus } : c))

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
        setWatches(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: currentFav, IsWishList: currentFav } : c))
      })
  }

  const getWatchListings = (page = currentPage) => {
    setLoading(true)
    getApprovedListing(3, page)
      .then((res) => {
        const list =
          res?.data?.data ||
          res?.data?.items ||
          res?.data?.paginated ||
          (Array.isArray(res?.data) ? res.data : [])
        setWatches(Array.isArray(list) ? list : [])

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
        setWatches([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getWatchListings(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="watch-listing-page">
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

        {watches.length === 0 ? (
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
            <p className="listings-empty-state__sub">Our curators are sourcing exceptional timepieces. Check back soon or submit your own for consideration.</p>
            <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
          </div>
        ) : (
          <div className="watch-grid">
            {
              watches.map((watch) => {

                const isFav = favorites[watch.itemId] !== undefined
                  ? favorites[watch.itemId]
                  : !!(watch.isWishList ?? watch.IsWishList);

                return (
                  <div className="watch-card" key={watch.itemId || watch.id}>
                    {/* Image Section */}
                    <div className="watch-card__image-container">
                      <img src={watch.details?.thumbnail || watch.details?.image1} alt={watch.details?.brand} className="watch-card__image" />
                      <div className="watch-card__gradient-overlay"></div>
                    </div>

                    {/* Info Section */}
                    <div className="watch-card__info">
                      <div className="watch-card__header-row">
                        <h3 className="watch-card__title">
                          {watch.details?.brand} <br /><span className="watch-card__reference">{watch.details?.model}</span>
                        </h3>
                        <button
                          className={`watch-card__favorite-btn ${isFav ? 'watch-card__favorite-btn--active' : ''}`}
                          onClick={() => handleWishList(watch.itemId)}
                          aria-label="Add to wishlist"
                        >
                          <svg viewBox="0 0 24 24" fill={isFav ? '#D4AF37' : 'none'} stroke={isFav ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      <p className="watch-card__description">{watch.details?.editionName}</p>

                      <div className="watch-card__divider"></div>

                      {/* Details Grid */}
                      <div className="watch-card__details-grid">
                        <div>
                          <div className="watch-card__bid-label">CURRENT BID</div>
                          <div className="watch-card__bid-value">${watch.currentPrice}</div>
                        </div>
                        <div className="watch-card__closes-container">
                          <div className="watch-card__closes-label">CLOSES IN</div>
                          <CountdownTimer endDateStr={watch.auctionEndDate} />
                        </div>
                      </div>

                      <div className="watch-card__divider"></div>

                      {/* Card Footer with Countdown and Place Bid */}
                      <div className="watch-card__footer">
                        <Link to={`/watch/${watch.itemId}`} style={{ textDecoration: "none" }}><button className="watch-card__bid-btn" >
                          {watch.canUserBid ? "BID NOW" : "VIEW BIDDING"}
                        </button></Link>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )}

        {/* Watch Pagination */}
        {watches.length > 0 && (
          <div className="watch-pagination">
            <button
              type="button"
              className="watch-pagination__btn watch-pagination__btn--nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              aria-label="Previous Page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="watch-pagination__arrow">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="watch-pagination__pages">
              {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`watch-pagination__btn watch-pagination__btn--page ${currentPage === page ? 'watch-pagination__btn--active' : ''}`}
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
              className="watch-pagination__btn watch-pagination__btn--nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.max(1, totalPages) || loading}
              aria-label="Next Page"
            >
              <span>Next</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="watch-pagination__arrow">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* <div className="watch-grid">
          {watchData.map(watch => (
            <div className="watch-card" key={watch.id}>
              
              <div className="watch-card__image-container">
                <img src={watch.image} alt={watch.title} className="watch-card__image" />
                <div className="watch-card__gradient-overlay"></div>

                
                <div className="watch-card__bid-overlay">
                  <div className="watch-card__bid-label">CURRENT BID</div>
                  <div className="watch-card__bid-value">{watch.currentBid}</div>
                </div>
              </div>

              
              <div className="watch-card__info">
                <div className="watch-card__header-row">
                  <h3 className="watch-card__title">
                    {watch.title} <span className="watch-card__reference">{watch.reference}</span>
                  </h3>
                  <button
                    className={`watch-card__favorite-btn ${favorites[watch.id] ? 'watch-card__favorite-btn--active' : ''}`}
                    onClick={() => toggleFavorite(watch.id)}
                    aria-label="Add to wishlist"
                  >
                    <svg viewBox="0 0 24 24" fill={favorites[watch.id] ? '#D4AF37' : 'none'} stroke={favorites[watch.id] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <p className="watch-card__description">{watch.description}</p>

                <div className="watch-card__divider"></div>

                
                <div className="watch-card__details-grid">
                  {watch.details.map((detail, idx) => (
                    <div className="watch-card__detail-item" key={idx}>
                      <div className="watch-card__detail-label">{detail.label}</div>
                      <div className={`watch-card__detail-value ${detail.isGold ? 'watch-card__detail-value--gold' : ''}`}>
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="watch-card__divider"></div>

                
                <div className="watch-card__footer">
                  <div className="watch-card__closes-container">
                    <div className="watch-card__closes-label">CLOSES IN</div>
                    <CountdownTimer
                      days={watch.initialTime.days}
                      hours={watch.initialTime.hours}
                      minutes={watch.initialTime.minutes}
                      seconds={watch.initialTime.seconds}
                    />
                  </div>
                  <Link to={`/watch/${watch.id}`} style={{ textDecoration: "none" }}><button className="watch-card__bid-btn" >
                    PLACE A BID
                  </button></Link>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>


    </div>

  )
}

export default AllWatches