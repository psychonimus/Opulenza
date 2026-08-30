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

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
    }


    const [pens, setPens] = useState([])


    const getPensListings = () => {
    
        getApprovedListing(4)
          .then((res) => {
            setPens(res?.data.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

    
      useEffect(() => {
        getPensListings()
      }, [])

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
                                <img src={pen?.details?.capped} alt={pen?.details?.brand} className="pen-card__image" />
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
                                        {/* <div className="pen-card__closes-label">CLOSES IN</div>
                                        <CountdownTimer
                                            endDate={pen?.auctionEndDate}
                                        /> */}

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
            </div>
        </div>
    )
}

export default AllPens
