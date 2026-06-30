import React, { useState, useEffect } from 'react'
import './AllWatches.css'
import { Link } from 'react-router-dom'
// import watchData from '../../data/WatchData'
import watchData from '../../../../data/WatchData'

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
        if(h < 0 ){
          h = 23
          d -= 1
        }
        if(d<0){
          d = 0
        }
        return { days : d , hours: h, minutes: m, seconds: s }
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

  return (
    <div className="watch-listing-page">
      <div className="container">
        <div className="watch-grid">
          {watchData.map(watch => (
            <div className="watch-card" key={watch.id}>
              {/* Image Section */}
              <div className="watch-card__image-container">
                <img src={watch.image} alt={watch.title} className="watch-card__image" />
                <div className="watch-card__gradient-overlay"></div>

                {/* Dossier Badge */}
                {/* <div className="watch-card__dossier-badge">
                  <span className="watch-card__dossier-dot"></span>
                  {watch.badge}
                </div> */}

                {/* Current Bid info overlay */}
                <div className="watch-card__bid-overlay">
                  <div className="watch-card__bid-label">CURRENT BID</div>
                  <div className="watch-card__bid-value">{watch.currentBid}</div>
                </div>
              </div>

              {/* Info Section */}
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

                {/* Details Grid */}
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

                {/* Card Footer with Countdown and Place Bid */}
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
                  <Link to={`/watch/${watch.id}`} style={{textDecoration:"none"}}><button className="watch-card__bid-btn" >
                    PLACE A BID
                  </button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>

  )
}

export default AllWatches