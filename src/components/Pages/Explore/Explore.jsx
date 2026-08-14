import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../Header/Header'
import watchData from '../../../data/WatchData'
import WhiskyData from '../../../data/WhiskyData'
import CigarData from '../../../data/CigarData'
import PensData from '../../../data/PensData'
import YachtData from '../../../data/YachtData'
import './Explore.css'

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  const [timeLeft, setTimeLeft] = useState({ days, hours, minutes, seconds })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer)
          return prev
        }
        let s = prev.seconds - 1
        let m = prev.minutes
        let h = prev.hours
        let d = prev.days
        if (s < 0) {
          s = 59
          m -= 1
        }
        if (m < 0) {
          m = 59
          h -= 1
        }
        if (h < 0) {
          h = 23
          d -= 1
        }
        if (d < 0) {
          d = 0
        }
        return { days: d, hours: h, minutes: m, seconds: s }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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
  const [activeCategory, setActiveCategory] = useState('ALL')

  const toggleFavorite = (key) => {
    setFavorites(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Combine all items and shuffle them randomly so that they are mixed together in the "ALL" tab
  const allItems = useMemo(() => {
    const watches = watchData.map(item => ({ ...item, category: 'WATCHES', link: `/watch/${item.id}` }))
    const whiskies = WhiskyData.map(item => ({ ...item, category: 'WHISKIES', link: `/whisky/${item.id}` }))
    const cigars = CigarData.map(item => ({ ...item, category: 'CIGARS', link: `/cigar/${item.id}` }))
    const pens = PensData.map(item => ({ ...item, category: 'PENS', link: `/pen/${item.id}` }))
    const yachts = YachtData.map(item => ({ ...item, category: 'YACHTS', link: `/yacht/${item.id}` }))
    const combined = [...watches, ...whiskies, ...cigars, ...pens, ...yachts]
    
    // Stable Fisher-Yates shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined
  }, [])

  // Filter items based on active category
  const filteredItems = activeCategory === 'ALL' 
    ? allItems 
    : allItems.filter(item => item.category === activeCategory)

  const categories = ['ALL', 'WATCHES', 'WHISKIES', 'CIGARS', 'PENS', 'YACHTS']

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
                onClick={() => setActiveCategory(cat)}
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
          {filteredItems.length === 0 ? (
            <div className="explore-no-results text-center py-5">
              <h3>No assets found in this category.</h3>
            </div>
          ) : (
            <div className="explore-grid">
              {filteredItems.map(item => {
                const uniqueKey = `${item.category}-${item.id}`
                return (
                  <div className="explore-card" key={uniqueKey}>
                    {/* Image Container */}
                    <div className="explore-card__image-container">
                      <img src={item.image} alt={item.title} className="explore-card__image" />
                      <div className="explore-card__gradient-overlay"></div>

                      {/* Dossier Category Badge */}
                      <div className="explore-card__category-badge">
                        <span className="explore-card__category-dot"></span>
                        {item.badge || item.category}
                      </div>

                      {/* Current Bid Overlay */}
                      <div className="explore-card__bid-overlay">
                        <div className="explore-card__bid-label">CURRENT BID</div>
                        <div className="explore-card__bid-value">{item.currentBid}</div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="explore-card__info">
                      <div className="explore-card__header-row">
                        <h3 className="explore-card__title">
                          {item.title} <span className="explore-card__reference">{item.reference}</span>
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

                      <p className="explore-card__description">{item.description}</p>

                      <div className="explore-card__divider"></div>

                      {/* Details Grid */}
                      <div className="explore-card__details-grid">
                        {item.details?.slice(0, 4).map((detail, idx) => (
                          <div className="explore-card__detail-item" key={idx}>
                            <div className="explore-card__detail-label">{detail.label}</div>
                            <div className={`explore-card__detail-value ${detail.isGold ? 'explore-card__detail-value--gold' : ''}`}>
                              {detail.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="explore-card__divider"></div>

                      {/* Card Footer with Countdown and Place Bid */}
                      <div className="explore-card__footer">
                        <div className="explore-card__closes-container">
                          <div className="explore-card__closes-label">CLOSES IN</div>
                          {item.initialTime ? (
                            <CountdownTimer
                              days={item.initialTime.days}
                              hours={item.initialTime.hours}
                              minutes={item.initialTime.minutes}
                              seconds={item.initialTime.seconds}
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
          )}
        </div>
      </section>
    </div>
  )
}

export default Explore
