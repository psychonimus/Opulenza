import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import pensData from '../../../../data/PensData'
import './AllPens.css'

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

                <div className="pen-grid">
                    {pensData.map(pen => (
                        <div className="pen-card" key={pen.id}>

                            {/* Image */}
                            <div className="pen-card__image-container">
                                <img src={pen.image} alt={pen.title} className="pen-card__image" />
                                <div className="pen-card__gradient-overlay" />

                                {pen.badge && (
                                    <div className="pen-card__dossier-badge">
                                        <span className="pen-card__dossier-dot" />
                                        {pen.badge}
                                    </div>
                                )}

                                <div className="pen-card__bid-overlay">
                                    <div className="pen-card__bid-label">CURRENT BID</div>
                                    <div className="pen-card__bid-value">{pen.currentBid}</div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="pen-card__info">
                                <div className="pen-card__header-row">
                                    <h3 className="pen-card__title">
                                        {pen.title} <span className="pen-card__reference">{pen.reference}</span>
                                    </h3>
                                    <button
                                        className={`pen-card__favorite-btn ${favorites[pen.id] ? 'pen-card__favorite-btn--active' : ''}`}
                                        onClick={() => toggleFavorite(pen.id)}
                                        aria-label="Add to wishlist"
                                    >
                                        <svg viewBox="0 0 24 24" fill={favorites[pen.id] ? '#D4AF37' : 'none'} stroke={favorites[pen.id] ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="pen-card__heart-icon">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="pen-card__description">{pen.description}</p>

                                <div className="pen-card__divider" />

                                <div className="pen-card__details-grid">
                                    {pen.details.map((detail, idx) => (
                                        <div className="pen-card__detail-item" key={idx}>
                                            <div className="pen-card__detail-label">{detail.label}</div>
                                            <div className={`pen-card__detail-value ${detail.isGold ? 'pen-card__detail-value--accent' : ''}`}>
                                                {detail.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pen-card__divider" />

                                <div className="pen-card__footer">
                                    <div className="pen-card__closes-container">
                                        <div className="pen-card__closes-label">CLOSES IN</div>
                                        <CountdownTimer
                                            days={pen.initialTime.days}
                                            hours={pen.initialTime.hours}
                                            minutes={pen.initialTime.minutes}
                                            seconds={pen.initialTime.seconds}
                                        />
                                    </div>
                                    <Link to={`/pen/${pen.id}`} style={{ textDecoration: 'none' }}>
                                        <button className="pen-card__bid-btn">PLACE A BID</button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllPens
