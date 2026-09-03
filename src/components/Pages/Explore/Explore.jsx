import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../Header/Header'
import watchData from '../../../data/WatchData'
import WhiskyData from '../../../data/WhiskyData'
import CigarData from '../../../data/CigarData'
import PensData from '../../../data/PensData'
import YachtData from '../../../data/YachtData'
import './Explore.css'
import { getApprovedListing } from '../../../services/sellingServices/getSellListings/getSellListings'

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
    <div className="explore-card__timer">
      <span className="explore-card__timer-num">{formatNum(timeLeft.days)}</span>
      <span className="explore-card__timer-separator">:</span>
      <span className="explore-card__timer-num">{formatNum(timeLeft.hours)}</span>
      <span className="explore-card__timer-separator">:</span>
      <span className="explore-card__timer-num">{formatNum(timeLeft.minutes)}</span>
      <span className="explore-card__timer-separator">:</span>
      <span className="explore-card__timer-num">{formatNum(timeLeft.seconds)}</span>
    </div>
  )
}

const Explore = () => {
  const [favorites, setFavorites] = useState({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  const [cigarData, setCigarData] = useState([]);
  const [whiskyData, setWhiskyData] = useState([]);
  const [caskData, setCaskData] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [penData, setPenData] = useState([]);
  const [yachtData, setYachtData] = useState([]);


  const getCigarData = () => {

    getApprovedListing(1)
      .then((res) => {
        setCigarData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const getWhiskyListings = () => {

    getApprovedListing(2)
      .then((res) => {
        setWhiskyData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const getCasksListings = () => {

    getApprovedListing(6)
      .then((res) => {
        setCaskData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const getWatchListings = () => {

    getApprovedListing(3)
      .then((res) => {
        setWatchData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getPensListings = () => {

    getApprovedListing(4)
      .then((res) => {
        setPenData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const getYachtListings = () => {

    getApprovedListing(5)
      .then((res) => {
        setYachtData(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  useEffect(() => {
    getCigarData()
    getWhiskyListings()
    getCasksListings()
    getWatchListings()
    getPensListings()
    getYachtListings()
  }, [])

  const toggleFavorite = (key) => {
    setFavorites(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Combine all items and shuffle them randomly so that they are mixed together in the "ALL" tab
  const allItems = useMemo(() => {
    const watches = (watchData || []).map(item => ({ ...item, category: 'WATCHES', link: `/watch/${item.itemId}` }))
    const whiskies = (whiskyData || []).map(item => ({ ...item, category: 'WHISKIES', link: `/whisky/${item.itemId}` }))
    const casks = (caskData || []).map(item => ({ ...item, category: 'CASK', link: `/cask/${item.itemId}` }))
    const cigars = (cigarData || []).map(item => ({ ...item, category: 'CIGARS', link: `/cigar/${item.itemId}` }))
    const pens = (penData || []).map(item => ({ ...item, category: 'PENS', link: `/pen/${item.itemId}` }))
    const yachts = (yachtData || []).map(item => ({ ...item, category: 'YACHTS', link: `/yacht/${item.itemId}` }))
    const combined = [...watches, ...whiskies, ...casks, ...cigars, ...pens, ...yachts]

    // Stable Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined
  }, [watchData, whiskyData, caskData, cigarData, penData, yachtData])

  // Filter items based on active category
  const filteredItems = activeCategory === 'All'
    ? allItems
    : allItems.filter(item => {
        const itemCat = (item.categoryName || item.category || '').toLowerCase();
        const activeCat = activeCategory.toLowerCase();
        if (activeCat === 'watches' && (itemCat.includes('watch') || itemCat.includes('clock'))) return true;
        if (activeCat === 'whisky' && (itemCat.includes('whisky') || itemCat.includes('whiskies'))) return true;
        if (activeCat === 'cask' && itemCat.includes('cask')) return true;
        if (activeCat === 'cigars' && (itemCat.includes('cigar') || itemCat.includes('cigars'))) return true;
        if (activeCat === 'luxury pens' && (itemCat.includes('pen') || itemCat.includes('pens'))) return true;
        if (activeCat === 'yachts' && (itemCat.includes('yacht') || itemCat.includes('yachts'))) return true;
        return itemCat.includes(activeCat) || activeCat.includes(itemCat);
      })

  const totalPages = Math.max(1, Math.ceil((filteredItems?.length || 0) / PAGE_SIZE))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return (filteredItems || []).slice(start, start + PAGE_SIZE)
  }, [filteredItems, currentPage, PAGE_SIZE])

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
      const filterSection = document.querySelector('.explore-filters')
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const categories = ['All', 'Cigars', 'Whisky', 'Cask', 'Watches', 'Luxury Pens', 'Yachts']

  return (
    <div className="explore-page">
      {/* Hero / Header Section */}
      <section className="explore-hero">
        <div className="container" style={{ marginTop: '6rem' }}>
          <Header
            topText="EXPLORE"
            mainText="Curated Selection of"
            highlight="Global Rarities"
            center={false}
            eyebrow={true}
          />
          <p className="explore-hero-para text-start">
            Discover a handpicked collection of the world's most coveted assets. From high-complication horology and legendary vintages to artisan writing instruments and magnificent yachts.
          </p>
        </div>
      </section>

      {/* Filter Tabs Section */}
      <section className="explore-filters">
        <div className="container">
          <div className="explore-tabs-container">
            {categories.map(cat => (
              <button
                key={cat}
                className={`explore-tab-btn ${activeCategory === cat ? 'explore-tab-btn--active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
                {activeCategory === cat && <span className="explore-tab-indicator"></span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="explore-grid-section">
        <div className="container">
          {filteredItems?.length === 0 ? (
            <div className="explore-no-results text-center py-5">
              <h3>No assets found in this category.</h3>
            </div>
          ) : (
            <>
              <div className="explore-grid">
                {paginatedItems?.map(item => {
                const uniqueKey = `${item?.categoryName}-${item?.itemId}`
                const catName = item?.categoryName?.toLowerCase() || '';
                const isWatch = catName.includes('watch') || item?.categoryId === 3;
                const isWhisky = catName === 'whisky' || item?.categoryId === 2;
                const isCask = catName.includes('cask') || item?.categoryId === 6;
                const isCigar = catName.includes('cigar') || item?.categoryId === 1;
                const isPen = catName.includes('pen') || item?.categoryId === 4;
                const isYacht = catName.includes('yacht') || item?.categoryId === 5;

                let cardImage = item?.image;
                if (isWatch && item?.details?.thumbnail) cardImage = item.details.thumbnail;
                if (isCigar && item?.details?.thumbnail) cardImage = item.details.thumbnail;
                if ((isWhisky || isCask) && item?.details?.thumbnail) cardImage = item.details.thumbnail;
                if (isPen && item?.details?.thumbnail) cardImage = item.details.thumbnail;

                let cardTitle = item?.title;
                let cardSub = item?.details?.editionName || item?.reference;
                let cardDesc = item?.description;

                if (isWatch) {
                  cardTitle = item?.details?.brand || item?.title;
                  cardSub = item?.details?.model;
                  cardDesc = item?.details?.editionName || item?.description;
                } else if (isCigar) {
                  cardTitle = item?.details?.brand || item?.title;
                  cardSub = item?.details?.editionName;
                  cardDesc = item?.details?.commercialShape || item?.description;
                } else if (isWhisky) {
                  cardTitle = item?.details?.producerName || item?.title;
                  cardSub = item?.details?.bottlingName;
                  cardDesc = item?.details?.storageCondition || item?.description;
                } else if (isCask) {
                  cardTitle = item?.details?.caskType || item?.title;
                  cardSub = item?.details?.distillesy;
                  cardDesc = item?.details?.storageCondition || item?.description;
                } else if (isPen) {
                  cardTitle = item?.details?.brand || item?.title;
                  cardSub = item?.details?.penType;
                  cardDesc = item?.details?.limitedEditionRegistry || item?.description;
                } else if (isYacht) {
                  cardTitle = item?.title;
                  cardSub = item?.details?.builder;
                  cardDesc = item?.description;
                }

                return (
                  <div className="explore-card" key={uniqueKey}>
                    {/* Image Container */}
                    <div className="explore-card__image-container">
                      <img src={cardImage} alt={cardTitle} className="explore-card__image" />
                      <div className="explore-card__gradient-overlay"></div>

                      {/* Dossier Category Badge */}
                      <div className="explore-card__category-badge">
                        <span className="explore-card__category-dot"></span>
                        {item?.badge || item?.categoryName}
                      </div>

                      {/* Current Bid Overlay */}
                      <div className="explore-card__bid-overlay">
                        <div className="explore-card__bid-label">CURRENT BID</div>
                        <div className="explore-card__bid-value">${item.currentPrice}</div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="explore-card__info">
                      <div className="explore-card__header-row">
                        <h3 className="explore-card__title">
                          {cardTitle} {cardSub && <span className="explore-card__reference">{cardSub}</span>}
                        </h3>
                        <button
                          className={`explore-card__favorite-btn ${favorites[uniqueKey] ? 'explore-card__favorite-btn--active' : ''}`}
                          onClick={() => toggleFavorite(uniqueKey)}
                          aria-label="Add to wishlist"
                        >
                          <svg viewBox="0 0 24 24" fill={favorites[uniqueKey] ? '#D4AF37' : 'none'} stroke={favorites[uniqueKey] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="explore-card__heart-icon">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      <p className="explore-card__description">{cardDesc}</p>

                      <div className="explore-card__divider"></div>

                      {/* Details Grid */}
                      <div className="explore-card__details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                        {isWatch && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">CASE SIZE</div>
                              <div className="explore-card__detail-value">{item.details?.caseSize || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">YEAR</div>
                              <div className="explore-card__detail-value">{item.details?.year || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">REF NUMBER</div>
                              <div className="explore-card__detail-value">{item.details?.referenceNumber || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">CONDITION</div>
                              <div className="explore-card__detail-value">{item.details?.condition || "—"}</div>
                            </div>
                          </>
                        )}
                        {isCigar && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">ORIGIN</div>
                              <div className="explore-card__detail-value">{item.details?.origin || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">LENGTH</div>
                              <div className="explore-card__detail-value">{item.details?.length || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">BOX YEAR</div>
                              <div className="explore-card__detail-value">{item.details?.boxYear || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">SHAPE</div>
                              <div className="explore-card__detail-value">{item.details?.commercialShape || "—"}</div>
                            </div>
                          </>
                        )}
                        {isWhisky && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">DISTILLERY STATUS</div>
                              <div className="explore-card__detail-value">{item.details?.distilleryStatus || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">VINTAGE</div>
                              <div className="explore-card__detail-value">{item.details?.vintageYear || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">AGE</div>
                              <div className="explore-card__detail-value">{item.details?.age ? `${item.details.age} Years` : "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">STRENGTH</div>
                              <div className="explore-card__detail-value">{item.details?.proof ? `${item.details.proof}% ABV` : "—"}</div>
                            </div>
                          </>
                        )}
                        {isCask && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">DISTILLERY</div>
                              <div className="explore-card__detail-value">{item.details?.distillesy || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">CASK TYPE</div>
                              <div className="explore-card__detail-value">{item.details?.caskType || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">VINTAGE</div>
                              <div className="explore-card__detail-value">{item.details?.vintageYear || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">CAPACITY</div>
                              <div className="explore-card__detail-value">{item.details?.capacity || "—"}</div>
                            </div>
                          </>
                        )}
                        {isPen && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">TYPE</div>
                              <div className="explore-card__detail-value">{item.details?.penType || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">YEAR</div>
                              <div className="explore-card__detail-value">{item.details?.manifacturingYear || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">BODY MATERIAL</div>
                              <div className="explore-card__detail-value">{item.details?.bodyMaterial || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">CONDITION</div>
                              <div className="explore-card__detail-value">{item.details?.condition || "—"}</div>
                            </div>
                          </>
                        )}
                        {isYacht && (
                          <>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">BUILDER</div>
                              <div className="explore-card__detail-value">{item.details?.builder || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">LENGTH</div>
                              <div className="explore-card__detail-value">{item.details?.length || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">YEAR</div>
                              <div className="explore-card__detail-value">{item.details?.year || "—"}</div>
                            </div>
                            <div className="explore-card__detail-item">
                              <div className="explore-card__detail-label">MATERIAL</div>
                              <div className="explore-card__detail-value">{item.details?.material || "—"}</div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="explore-card__divider"></div>

                      {/* Card Footer with Countdown and Place Bid */}
                      <div className="explore-card__footer">
                        <div className="explore-card__closes-container">
                          <div className="explore-card__closes-label">CLOSES IN</div>
                          {item.initialTime || item.auctionEndDate ? (
                            <CountdownTimer
                              days={item.initialTime?.days}
                              hours={item.initialTime?.hours}
                              minutes={item.initialTime?.minutes}
                              seconds={item.initialTime?.seconds}
                              endDate={item.auctionEndDate}
                            />
                          ) : (
                            <div className="explore-card__timer">--:--:--:--</div>
                          )}
                        </div>
                        <Link to={item.link} style={{ textDecoration: 'none' }}>
                          <button className="explore-card__bid-btn">
                            PLACE A BID
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredItems?.length > 0 && (
                <div className="explore-pagination">
                  <button
                    type="button"
                    className="explore-pagination__btn explore-pagination__btn--nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="explore-pagination__arrow">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="explore-pagination__pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`explore-pagination__btn explore-pagination__btn--page ${currentPage === page ? 'explore-pagination__btn--active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="explore-pagination__btn explore-pagination__btn--nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="explore-pagination__arrow">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Explore
