import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import yachtData from '../../../../data/YachtData'
import './DetailedYachtPage.css'

const DetailedYachtPage = () => {
    const { id } = useParams()
    const yacht = yachtData.find(y => y.id === Number(id))

    const [activeTab, setActiveTab] = useState('history')
    const [currentBid, setCurrentBid] = useState(yacht ? yacht.currentBidNumber : 0)
    const [bids, setBids] = useState(yacht ? (yacht.liveActivity || []) : [])
    const [biddersCount, setBiddersCount] = useState(yacht ? (yacht.activeBidders || 10) : 10)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isAutoBidding, setIsAutoBidding] = useState(false)

    const magnifierRef = useRef(null)
    const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0, bgX: 0, bgY: 0, wrapperW: 0, wrapperH: 0 })
    const LENS_SIZE = 160
    const ZOOM = 2.5

    const handleMagnifierMove = useCallback((e) => {
        const wrapper = magnifierRef.current
        if (!wrapper) return
        const rect = wrapper.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const bgX = -(x * ZOOM - LENS_SIZE / 2)
        const bgY = -(y * ZOOM - LENS_SIZE / 2)
        setMagnifier({ visible: true, x, y, bgX, bgY, wrapperW: rect.width, wrapperH: rect.height })
    }, [LENS_SIZE, ZOOM])

    const handleMagnifierLeave = useCallback(() => {
        setMagnifier(prev => ({ ...prev, visible: false }))
    }, [])

    const [mainImage, setMainImage] = useState(yacht ? yacht.image : '')
    const [activeThumbIdx, setActiveThumbIdx] = useState(0)

    const [showBidModal, setShowBidModal] = useState(false)
    const [customBidAmount, setCustomBidAmount] = useState(yacht ? (yacht.currentBidNumber + yacht.bidIncrement) : 0)
    const [bidError, setBidError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [modalAutoBid, setModalAutoBid] = useState(false)

    const [timeLeft, setTimeLeft] = useState({
        days: yacht?.initialTime?.days || 0,
        hours: yacht?.initialTime?.hours || 4,
        minutes: yacht?.initialTime?.minutes || 18,
        seconds: yacht?.initialTime?.seconds || 40
    })

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

    useEffect(() => {
        let simInterval
        if (isAutoBidding && yacht) {
            simInterval = setInterval(() => {
                if (Math.random() < 0.35) {
                    const increment = yacht.bidIncrement
                    setCurrentBid(prev => {
                        const newAmt = prev + increment
                        const newBidObj = {
                            id: Date.now(),
                            member: `MEMBER #${Math.floor(Math.random() * 9 + 1)}***${Math.floor(Math.random() * 9 + 1)}`,
                            timeAgo: 'Just now',
                            timestamp: Date.now(),
                            amount: formatCurrency(newAmt),
                            amountNumber: newAmt
                        }
                        setBids(prevList => [newBidObj, ...prevList])
                        setBiddersCount(bc => bc + 1)
                        return newAmt
                    })
                }
            }, 7000)
        }
        return () => { if (simInterval) clearInterval(simInterval) }
    }, [isAutoBidding, yacht?.bidIncrement, yacht])

    if (!yacht) {
        return (
            <div className="yacht-not-found">
                <div className="container text-center py-5">
                    <h2 className="yacht-error-title">Yacht Not Found</h2>
                    <p className="yacht-error-desc">The superyacht listing you are looking for does not exist or has been archived.</p>
                    <Link to="/yachtListings" className="yacht-back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        )
    }

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatNum = (num) => String(num).padStart(2, '0')

    const thumbnails = [yacht.image, ...(yacht.angles || [])]

    const handlePlaceBidClick = () => {
        setCustomBidAmount(currentBid + yacht.bidIncrement)
        setBidError('')
        setShowBidModal(true)
    }

    const submitCustomBid = (e) => {
        e.preventDefault()
        const amt = Number(customBidAmount)
        const minRequired = currentBid + yacht.bidIncrement
        if (isNaN(amt) || amt < minRequired) {
            setBidError(`Bid must be at least ${formatCurrency(minRequired)}`)
            return
        }
        const newBidObj = {
            id: Date.now(),
            member: `MEMBER #YOU***${Math.floor(Math.random() * 9 + 1)}`,
            timeAgo: 'Just now',
            timestamp: Date.now(),
            amount: formatCurrency(amt),
            amountNumber: amt
        }
        setCurrentBid(amt)
        setBids(prev => [newBidObj, ...prev])
        setBiddersCount(prev => prev + 1)
        setShowBidModal(false)
        setSuccessMessage(`Bid of ${formatCurrency(amt)} placed successfully!`)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    return (
        <>
            <section className="yacht-detailed-page">
                <div className="yacht-detailed-page__bg-overlay" />
                <div className="container yacht-detailed-page__container">

                    {/* Breadcrumb */}
                    <div className="yacht-detailed-page__breadcrumb">
                        <Link to="/yachtListings" className="yacht-breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="yacht-breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Listings
                        </Link>
                    </div>

                    {/* Toast */}
                    {successMessage && (
                        <div className="yacht-toast-notification">
                            <div className="yacht-toast-content">
                                <span className="yacht-toast-dot" />
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Two-column grid */}
                    <div className="yacht-detailed-page__grid">

                        {/* ── Left ─────────────────────────────────────── */}
                        <div className="yacht-detailed-page__gallery-and-info">

                            {/* Main Image */}
                            <div
                                className="yacht-detailed-page__main-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={yacht.title} className="yacht-detailed-page__main-image" />
                                <div className="yacht-detailed-page__image-glow" />

                                {magnifier.visible && (
                                    <div
                                        className="yacht-detailed-page__magnifier-lens"
                                        style={{
                                            width: LENS_SIZE,
                                            height: LENS_SIZE,
                                            left: magnifier.x - LENS_SIZE / 2,
                                            top: magnifier.y - LENS_SIZE / 2,
                                            backgroundImage: `url(${mainImage})`,
                                            backgroundSize: `${magnifier.wrapperW * ZOOM}px ${magnifier.wrapperH * ZOOM}px`,
                                            backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="yacht-detailed-page__title">
                                {yacht.title} <span className="yacht-detailed-page__reference">{yacht.reference}</span>
                            </h1>

                            {/* Description */}
                            <p className="yacht-detailed-page__description">
                                {yacht.detailedDescription || yacht.description}
                            </p>

                            {/* Spec strip */}
                            <div className="yacht-meta-strip">
                                {yacht.details.map((d, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="yacht-meta-item">
                                            <span className="yacht-meta-label">{d.label}</span>
                                            <span className="yacht-meta-value">{d.value}</span>
                                        </div>
                                        {idx < yacht.details.length - 1 && <div className="yacht-meta-divider" />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Thumbnails */}
                            <div className="yacht-detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`yacht-detailed-page__thumb-item ${activeThumbIdx === idx ? 'yacht-detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => { setMainImage(thumb); setActiveThumbIdx(idx) }}
                                    >
                                        <img src={thumb} alt={`View ${idx + 1}`} className="yacht-detailed-page__thumb-img" />
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* ── Right: Bid Sidebar ────────────────────────── */}
                        <div className="yacht-detailed-page__sidebar">
                            <div className="yacht-detailed-page__card">

                                {/* Timer */}
                                <div className="yacht-timer-section">
                                    <span className="yacht-timer-title">TIME REMAINING</span>
                                    <div className="yacht-timer-row">
                                        <div className="yacht-timer-block">
                                            <span className="yacht-timer-number">{formatNum(timeLeft.days)}</span>
                                            <span className="yacht-timer-label">DAYS</span>
                                        </div>
                                        <span className="yacht-timer-separator">:</span>
                                        <div className="yacht-timer-block">
                                            <span className="yacht-timer-number">{formatNum(timeLeft.hours)}</span>
                                            <span className="yacht-timer-label">HRS</span>
                                        </div>
                                        <span className="yacht-timer-separator">:</span>
                                        <div className="yacht-timer-block">
                                            <span className="yacht-timer-number">{formatNum(timeLeft.minutes)}</span>
                                            <span className="yacht-timer-label">MIN</span>
                                        </div>
                                        <span className="yacht-timer-separator">:</span>
                                        <div className="yacht-timer-block">
                                            <span className="yacht-timer-number">{formatNum(timeLeft.seconds)}</span>
                                            <span className="yacht-timer-label">SEC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="yacht-sidebar-divider" />

                                {/* Current Bid & Reserve */}
                                <div className="yacht-bid-status">
                                    <div className="yacht-bid-status-col">
                                        <span className="yacht-panel-label">CURRENT BID</span>
                                        <span className="yacht-panel-value yacht-panel-value--large">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="yacht-bid-status-col yacht-text-right">
                                        <span className="yacht-panel-label">RESERVE</span>
                                        <span className={`yacht-panel-value yacht-panel-value--reserve ${yacht.reserveMet || currentBid >= (yacht.currentBidNumber * 1.02) ? 'yacht-reserve-met' : ''}`}>
                                            {yacht.reserveMet || currentBid >= (yacht.currentBidNumber * 1.02) ? (
                                                <>
                                                    <svg className="yacht-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    MET
                                                </>
                                            ) : 'NOT MET'}
                                        </span>
                                    </div>
                                </div>

                                <div className="yacht-sidebar-divider" />

                                {/* Increment & Bidders */}
                                <div className="yacht-bid-specs">
                                    <div className="yacht-spec-col">
                                        <span className="yacht-panel-label">BID INCREMENT:</span>
                                        <span className="yacht-panel-value">{formatCurrency(yacht.bidIncrement)}</span>
                                    </div>
                                    <div className="yacht-spec-col yacht-text-right">
                                        <span className="yacht-panel-value">{biddersCount} ACTIVE</span>
                                        <span className="yacht-panel-label">BIDDERS</span>
                                    </div>
                                </div>

                                {/* Place Bid */}
                                <button className="yacht-place-bid-btn" onClick={handlePlaceBidClick}>
                                    PLACE BID
                                </button>

                                {/* Secondary Buttons */}
                                <div className="yacht-action-row">
                                    <button
                                        className={`yacht-action-btn-secondary ${isAutoBidding ? 'yacht-action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
                                    >
                                        <svg className="yacht-action-icon" viewBox="0 0 24 24" fill={isAutoBidding ? '#000000' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                        {isAutoBidding ? 'AUTO BID ACTIVE' : 'AUTO BID'}
                                    </button>
                                    <button
                                        className={`yacht-action-btn-secondary ${isFavorited ? 'yacht-action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsFavorited(!isFavorited)}
                                    >
                                        <svg className="yacht-action-icon" viewBox="0 0 24 24" fill={isFavorited ? '#d6a54d' : 'none'} stroke={isFavorited ? '#d6a54d' : 'currentColor'} strokeWidth="2">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        {isFavorited ? 'Added to watchlist' : 'Add to watchlist'}
                                    </button>
                                </div>

                                <div className="yacht-sidebar-divider" />

                                {/* Live Activity */}
                                <div className="yacht-live-activity">
                                    <div className="yacht-live-activity-header">
                                        <span className="yacht-live-activity-title">LIVE ACTIVITY</span>
                                        <span className="yacht-live-pulse" />
                                    </div>
                                    <div className="yacht-live-activity-list">
                                        {bids.map((bid, index) => (
                                            <div className="yacht-live-bid-item" key={bid.id || index}>
                                                <div className="yacht-bid-user-info">
                                                    <span className="yacht-bid-username">{index + 1}. {bid.member}</span>
                                                    <span className="yacht-bid-timestamp">{bid.timeAgo || 'Just now'}</span>
                                                </div>
                                                <div className="yacht-bid-amount-value">{bid.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Tabs */}
                    <div className="yacht-tabs-container">
                        <div className="yacht-tabs-header">
                            <button
                                className={`yacht-tab-link-btn ${activeTab === 'history' ? 'yacht-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                OWNERSHIP HISTORY
                                {activeTab === 'history' && <span className="yacht-tab-indicator" />}
                            </button>
                            <button
                                className={`yacht-tab-link-btn ${activeTab === 'auth' ? 'yacht-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('auth')}
                            >
                                CLASSIFICATION & CERTIFICATION
                                {activeTab === 'auth' && <span className="yacht-tab-indicator" />}
                            </button>
                            <button
                                className={`yacht-tab-link-btn ${activeTab === 'condition' ? 'yacht-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('condition')}
                            >
                                SURVEY & CONDITION
                                {activeTab === 'condition' && <span className="yacht-tab-indicator" />}
                            </button>
                        </div>

                        <div className="yacht-tabs-content">

                            {activeTab === 'history' && (
                                <div className="yacht-tab-panel-grid yacht-fade-in">
                                    <div className="yacht-tab-panel-info">
                                        <h3 className="yacht-tab-panel-heading">{yacht.ownershipHistory?.title || 'Registry History'}</h3>
                                        <p className="yacht-tab-panel-text">
                                            {yacht.ownershipHistory?.description}
                                        </p>
                                    </div>
                                    <div className="yacht-tab-panel-interactive">
                                        <div className="yacht-ownership-timeline">
                                            {(yacht.ownershipHistory?.timeline || []).map((item, idx) => (
                                                <div className="yacht-timeline-card" key={idx}>
                                                    <span className="yacht-timeline-period">{item.period}</span>
                                                    <p className="yacht-timeline-detail">{item.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="yacht-view-registry-btn">REQUEST REGISTRY ACCESS</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'auth' && (
                                <div className="yacht-tab-panel-grid yacht-fade-in">
                                    <div className="yacht-tab-panel-info">
                                        <h3 className="yacht-tab-panel-heading">Seaworthiness & Class Certification</h3>
                                        <p className="yacht-tab-panel-text">
                                            {yacht.authentication}
                                        </p>
                                    </div>
                                    <div className="yacht-tab-panel-interactive">
                                        <div className="yacht-auth-checks-list">
                                            {[
                                                'Lloyds Register / Bureau Veritas Class current',
                                                'International Load Line Certificate active',
                                                'Engine and generator oil diagnostics verified',
                                                'Safe Manning and ISM compliance confirmed',
                                            ].map((check, idx) => (
                                                <div className="yacht-auth-check-item" key={idx}>
                                                    <svg className="yacht-auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    <span>{check}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'condition' && (
                                <div className="yacht-tab-panel-grid yacht-fade-in">
                                    <div className="yacht-tab-panel-info">
                                        <h3 className="yacht-tab-panel-heading">Annual Hull & Machinery Survey</h3>
                                        <p className="yacht-tab-panel-text">
                                            A comprehensive ultrasound thickness scan, sea trial, and engine bore scope inspection were completed recently. Results confirm full operational status of all major marine systems.
                                        </p>
                                    </div>
                                    <div className="yacht-tab-panel-interactive">
                                        <div className="yacht-condition-grades-grid">
                                            {(yacht.conditionReport?.label || []).map((lbl, idx) => (
                                                <div className="yacht-condition-grade-item" key={idx}>
                                                    <span className="yacht-condition-lbl">{lbl}</span>
                                                    <span className="yacht-condition-val">{yacht.conditionReport.value[idx]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* Bid Modal */}
                {showBidModal && (
                    <div className="yacht-bid-modal-overlay yacht-fade-in">
                        <div className="yacht-bid-modal-card">
                            <button className="yacht-close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <div className="yacht-modal-header">
                                <span className="yacht-modal-auction-badge">AUCTION LIVE</span>
                                <h2 className="yacht-modal-title">Place Your Bid</h2>
                            </div>
                            <div className="yacht-modal-asset-card">
                                <div className="yacht-modal-asset-thumb">
                                    <img src={yacht.image} alt={yacht.title} />
                                </div>
                                <div className="yacht-modal-asset-info">
                                    <span className="yacht-modal-asset-label">CURRENT ASSET</span>
                                    <p className="yacht-modal-asset-name">{yacht.title} <span>{yacht.reference}</span></p>
                                    <p className="yacht-modal-asset-lot">Lot #{yacht.id ? String(yacht.id).padStart(3, '0') + String(Math.floor(Math.random() * 900) + 100) : '0012401'}</p>
                                </div>
                            </div>
                            <form onSubmit={submitCustomBid} className="yacht-modal-form">
                                <div className="yacht-modal-bid-row">
                                    <div className="yacht-modal-bid-stat">
                                        <span className="yacht-modal-bid-stat-label">CURRENT BID</span>
                                        <span className="yacht-modal-bid-stat-value">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="yacht-modal-bid-stat yacht-modal-bid-stat--right">
                                        <span className="yacht-modal-bid-stat-label">MIN. NEXT BID</span>
                                        <span className="yacht-modal-bid-stat-value yacht-modal-bid-stat-value--accent">{formatCurrency(currentBid + yacht.bidIncrement)}</span>
                                    </div>
                                </div>
                                <div className="yacht-modal-input-section">
                                    <label className="yacht-modal-input-label">YOUR BID AMOUNT (USD)</label>
                                    <div className="yacht-modal-input-wrapper">
                                        <span className="yacht-currency-prefix">$</span>
                                        <input
                                            type="number"
                                            className="yacht-modal-bid-input"
                                            value={customBidAmount}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={currentBid + yacht.bidIncrement}
                                            step={yacht.bidIncrement}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="yacht-modal-error-msg">{bidError}</p>}
                                </div>
                                <div className="yacht-modal-autobid-row">
                                    <div className="yacht-modal-autobid-text">
                                        <span className="yacht-modal-autobid-title">Auto Bid</span>
                                        <span className="yacht-modal-autobid-sub">OPULENZA WILL BID UP TO YOUR LIMIT</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`yacht-modal-toggle${modalAutoBid ? ' yacht-modal-toggle--on' : ''}`}
                                        onClick={() => setModalAutoBid(v => !v)}
                                        aria-label="Toggle auto bid"
                                    >
                                        <span className="yacht-modal-toggle-knob" />
                                    </button>
                                </div>
                                <label className="yacht-modal-terms-row">
                                    <input
                                        type="checkbox"
                                        className="yacht-modal-terms-check"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span className="yacht-modal-terms-text">
                                        I accept the <span className="yacht-modal-terms-link">Terms of Service</span> and acknowledge that this bid constitutes a legally binding contract to purchase the vessel.
                                    </span>
                                </label>
                                <button type="submit" className="yacht-submit-bid-btn" disabled={!termsAccepted}>
                                    CONFIRM BID
                                </button>
                                <div className="yacht-modal-secure-footer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>SECURE MARITIME ENCRYPTION</span>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Recommended */}
                <div className="container">
                    <div className="yacht-recommended-section">
                        <div className="yacht-recommended-header">
                            <div className="yacht-recommended-title-container">
                                <span className="yacht-recommended-subtitle">CURATED FOR YOU</span>
                                <h2 className="yacht-recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/yachtListings" className="yacht-view-all-link">
                                VIEW ALL LIVE AUCTIONS
                            </Link>
                        </div>
                        <div className="yacht-recommended-grid">
                            {yachtData
                                .filter(y => y.id !== yacht.id)
                                .slice(0, 3)
                                .map(rec => (
                                    <Link to={`/yacht/${rec.id}`} key={rec.id} className="yacht-recommended-card-link">
                                        <div className="yacht-recommended-card">
                                            <div className="yacht-recommended-card__image-container">
                                                <img src={rec.image} alt={`${rec.title} ${rec.reference}`} className="yacht-recommended-card__image" />
                                                <div className="yacht-recommended-card__gradient-overlay" />
                                            </div>
                                            <div className="yacht-recommended-card__info">
                                                <h3 className="yacht-recommended-card__title">{rec.title} — <em>{rec.reference}</em></h3>
                                                <p className="yacht-recommended-card__estimate">Current Bid: {rec.currentBid}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default DetailedYachtPage
