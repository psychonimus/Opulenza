import React, { useState, useEffect } from 'react'
import './AllWatches.css'
import { Link } from 'react-router-dom'
// import watchData from '../../data/WatchData'
import watchData from '../../../../data/WatchData'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'

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

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  const [timeLeft, setTimeLeft] = useState({ days, hours, minutes, seconds })




  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
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

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }


  const [watches, setWatches] = useState([])

  const getWatchListings = () => {
    getApprovedListing(3)
      .then((res) => {
        setWatches(res?.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getWatchListings()
  }, [])


  console.log(watches)

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
          {watches.map(watch => (
            <div className="watch-card" key={watch.itemId}>
              {/* Image Section */}
              <div className="watch-card__image-container">
                <img src={watch.details?.images[0]} alt={watch.details?.editionName} className="watch-card__image" />
                <div className="watch-card__gradient-overlay"></div>

                {/* Dossier Badge */}
                {/* <div className="watch-card__dossier-badge">
                  <span className="watch-card__dossier-dot"></span>
                  {watch.badge}
                </div> */}

                {/* Current Bid info overlay */}
                <div className="watch-card__bid-overlay">
                  <div className="watch-card__bid-label">CURRENT BID</div>
                  <div className="watch-card__bid-value">{watch.expectedPrice}</div>
                </div>
              </div>

              {/* Info Section */}
              <div className="watch-card__info">
                <div className="watch-card__header-row">
                  <h3 className="watch-card__title">
                    {watch.details?.brand} <span className="watch-card__reference">{8787}</span>
                  </h3>
                  <button
                    className={`watch-card__favorite-btn ${favorites[watch.itemId] ? 'watch-card__favorite-btn--active' : ''}`}
                    onClick={() => toggleFavorite(watch.itemId)}
                    aria-label="Add to wishlist"
                  >
                    <svg viewBox="0 0 24 24" fill={favorites[watch.id] ? '#D4AF37' : 'none'} stroke={favorites[watch.id] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <p className="watch-card__description">{watch.details?.editionName}</p>

                <div className="watch-card__divider"></div>

                {/* Details Grid */}
                <div className="watch-card__details-grid">
                  {watch.details &&
                    Object.entries(watch.details).map(([key, value]) => (
                      <div className="watch-card__detail-item" key={key}>
                        <div className="watch-card__detail-label">
                          {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                        </div>
                        <div className="watch-card__detail-value">
                          {Array.isArray(value) ? value.join(', ') : String(value ?? '—')}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="watch-card__divider"></div>

                {/* Card Footer with Countdown and Place Bid */}
                <div className="watch-card__footer">
                  <div className="watch-card__closes-container">
                    <div className="watch-card__closes-label">CLOSES IN</div>
                    {/* <CountdownTimer
                      days={watch.initialTime.days}
                      hours={watch.initialTime.hours}
                      minutes={watch.initialTime.minutes}
                      seconds={watch.initialTime.seconds}
                    /> */}
                  </div>
                  <Link to={`/watch/${watch.id}`} style={{ textDecoration: "none" }}><button className="watch-card__bid-btn" >
                    PLACE A BID
                  </button></Link>
                </div>
              </div>
            </div>
          ))}
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