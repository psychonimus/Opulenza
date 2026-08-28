import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import yachtData from '../../../../data/YachtData'
import './AllYachts.css'

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
    const [timeLeft, setTimeLeft] = useState({ days, hours, minutes, seconds })

    useEffect(() => {
        const timer = setInterval(() => {
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
        }, 1000)
        return () => clearInterval(timer)
    }, [])

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

    const toggleFavorite = (id) => {
        setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
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


                {yachtData.length === 0 ? (
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
                    {yachtData.map(yacht => (
                        <div className="yacht-card" key={yacht.id}>

                            {/* Image */}
                            <div className="yacht-card__image-container">
                                <img src={yacht.image} alt={yacht.title} className="yacht-card__image" />
                                <div className="yacht-card__gradient-overlay" />

                                {yacht.badge && (
                                    <div className="yacht-card__dossier-badge">
                                        <span className="yacht-card__dossier-dot" />
                                        {yacht.badge}
                                    </div>
                                )}

                                <div className="yacht-card__bid-overlay">
                                    <div className="yacht-card__bid-label">CURRENT BID</div>
                                    <div className="yacht-card__bid-value">{yacht.currentBid}</div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="yacht-card__info">
                                <div className="yacht-card__header-row">
                                    <h3 className="yacht-card__title">
                                        {yacht.title} <span className="yacht-card__reference">{yacht.reference}</span>
                                    </h3>
                                    <button
                                        className={`yacht-card__favorite-btn ${favorites[yacht.id] ? 'yacht-card__favorite-btn--active' : ''}`}
                                        onClick={() => toggleFavorite(yacht.id)}
                                        aria-label="Add to wishlist"
                                    >
                                        <svg viewBox="0 0 24 24" fill={favorites[yacht.id] ? '#D4AF37' : 'none'} stroke={favorites[yacht.id] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="yacht-card__heart-icon">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="yacht-card__description">{yacht.description}</p>

                                <div className="yacht-card__divider" />

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

                                <div className="yacht-card__divider" />

                                <div className="yacht-card__footer">
                                    <div className="yacht-card__closes-container">
                                        <div className="yacht-card__closes-label">CLOSES IN</div>
                                        <CountdownTimer
                                            days={yacht.initialTime.days}
                                            hours={yacht.initialTime.hours}
                                            minutes={yacht.initialTime.minutes}
                                            seconds={yacht.initialTime.seconds}
                                        />
                                    </div>
                                    <Link to={`/yacht/${yacht.id}`} style={{ textDecoration: 'none' }}>
                                        <button className="yacht-card__bid-btn">PLACE A BID</button>
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

export default AllYachts
