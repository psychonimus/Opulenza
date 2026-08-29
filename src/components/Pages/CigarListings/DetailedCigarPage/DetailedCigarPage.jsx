import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import cigarData from '../../../../data/CigarData'
import { AddBid } from '../../../../services/biddingServices/BiddingServices'
import './DetailedCigarPage.css'

/* ── Cigar-specific enrichments ─────────────────────────────── */


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

const DetailedCigarPage = () => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState('provenance')
    const [currentBid, setCurrentBid] = useState(0)
    const [bids, setBids] = useState([])
    const [biddersCount, setBiddersCount] = useState(10)
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

    const [mainImage, setMainImage] = useState('')
    const [activeThumbIdx, setActiveThumbIdx] = useState(0)

    const [showBidModal, setShowBidModal] = useState(false)
    const [customBidAmount, setCustomBidAmount] = useState(0)
    const [bidError, setBidError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [modalAutoBid, setModalAutoBid] = useState(false)

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        setLoading(true)
        getApprovedListing(1)
            .then((res) => {
                const list = res?.data?.data || []
                const found = list.find(c => c.itemId === Number(id))
                if (found) {
                    const mappedItem = {
                        id: found.itemId,
                        itemId: found.itemId,
                        title: found.details?.brand || found.categoryName || "Cigar",
                        reference: found.details?.editionName || "",
                        description: found.details?.commercialShape || "",
                        detailedDescription: found.details?.commercialShape || "",
                        image: found.details?.openBox || found.details?.boxLidBranding || "",
                        angles: [found.details?.boxLidBranding, found.details?.boxBottom, found.details?.cigarBand].filter(Boolean),
                        currentBidNumber: found.currentPrice || found.expectedPrice || 568,
                        bidIncrement: found.bidIncreament || 500,
                        activeBidders: 10,
                        auctionEndDate: found.auctionEndDate,
                        liveActivity: [
                            { id: 1, member: 'MEMBER #7***3', timeAgo: '2 minutes ago', timestamp: Date.now() - 120000, amount: `$${found.currentPrice || found.expectedPrice || 568}`, amountNumber: found.currentPrice || found.expectedPrice || 568 }
                        ],
                        provenance: {
                            title: found.details?.origin || 'Premium Origin',
                            description: `This exceptional cigar collection has been authenticated and stored in pristine conditions in our vaults.`,
                            timeline: [
                                { period: found.details?.boxYear || 'N/A', detail: 'Acquired and preserved in verified conditions' },
                                { period: 'PRESENT', detail: 'Opulenza Authenticated Custody' }
                            ]
                        },
                        authentication: 'Authenticated and verified. Complete chain of custody documented.',
                        conditionReport: {
                            label: ['WRAPPER', 'ORIGIN', 'BOX YEAR', 'SIZE'],
                            value: [
                                'Pristine wrapper condition',
                                found.details?.origin || '—',
                                found.details?.boxYear || '—',
                                found.details?.length || '—'
                            ]
                        },
                        details: [
                            { label: 'BRAND', value: found.details?.brand },
                            { label: 'ORIGIN', value: found.details?.origin },
                            { label: 'SIZE', value: found.details?.length },
                            { label: 'RARITY', value: found.details?.packagingType || '—' }
                        ]
                    }
                    setItem(mappedItem)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    useEffect(() => {
        if (item) {
            setCurrentBid(item.currentBidNumber)
            setBids(item.liveActivity || [])
            setBiddersCount(item.activeBidders || 10)
            setMainImage(item.image)
            setCustomBidAmount(item.currentBidNumber + item.bidIncrement)
            setTimeLeft(item.auctionEndDate ? calculateTimeLeft(item.auctionEndDate) : { days: 1, hours: 4, minutes: 18, seconds: 40 })
        }
    }, [item])

    useEffect(() => {
        if (!item || !item.auctionEndDate) return
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(item.auctionEndDate))
        }, 1000)
        return () => clearInterval(timer)
    }, [item])

    useEffect(() => {
        let simInterval
        if (isAutoBidding && item) {
            simInterval = setInterval(() => {
                if (Math.random() < 0.35) {
                    const increment = item.bidIncrement
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
    }, [isAutoBidding, item?.bidIncrement, item])

    if (loading) {
        return (
            <div className="cigar-not-found">
                <div className="container text-center py-5">
                    <FaSpinner className="ap-spin" size={32} color="#d6a54d" />
                    <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)' }}>Loading details...</p>
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="cigar-not-found">
                <div className="container text-center py-5">
                    <h2 className="error-title">Cigar Not Found</h2>
                    <p className="error-desc">The cigar listing you are looking for does not exist or has been archived.</p>
                    <Link to="/cigarsListings" className="back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        )
    }

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatNum = (num) => String(num).padStart(2, '0')

    const thumbnails = [item.image, ...(item.angles || [])]

    const brand   = item.details?.find(d => d.label === 'BRAND')?.value  || item.title
    const origin  = item.details?.find(d => d.label === 'ORIGIN')?.value || '—'
    const size    = item.details?.find(d => d.label === 'SIZE')?.value   || '—'
    const rarity  = item.details?.find(d => d.label === 'RARITY')?.value || '—'

    const handlePlaceBidClick = () => {
        setCustomBidAmount(item?.bidIncrement || 0)
        setBidError('')
        setShowBidModal(true)
    }

    const submitCustomBid = (e) => {
        e.preventDefault()
        const amt = Number(customBidAmount)
        const minRequired = item?.bidIncrement || 0
        if (isNaN(amt) || amt < minRequired) {
            setBidError(`Bid must be at least ${formatCurrency(minRequired)}`)
            return
        }

        const payload = {
            ItemId: item.itemId,
            BidAmount: amt,
            Currency : item.currency
        }

        AddBid(payload)
            .then(() => {
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
            })
            .catch((err) => {
                console.error(err)
                setBidError(err?.response?.data?.message || err?.message || 'Failed to place bid. Please try again.')
            })
    }

    return (
        <>
            <section className="cigar-detailed-page">
                <div className="cigar-detailed-page__bg-overlay" />
                <div className="container cigar-detailed-page__container">

                    {/* Breadcrumb */}
                    <div className="detailed-page__breadcrumb">
                        <Link to="/cigarsListings" className="breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Listings
                        </Link>
                    </div>

                    {/* Success Toast */}
                    {successMessage && (
                        <div className="bid-toast-notification">
                            <div className="toast-content">
                                <span className="toast-dot" />
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Two-Column Grid */}
                    <div className="detailed-page__grid">

                        {/* ── Left: Image Gallery & Info ─────────────────── */}
                        <div className="detailed-page__gallery-and-info">

                            {/* Main Image */}
                            <div
                                className="cigar-detailed-page__main-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={item.title} className="cigar-detailed-page__main-image" />
                                <div className="detailed-page__image-glow" />

                                {magnifier.visible && (
                                    <div
                                        className="detailed-page__magnifier-lens"
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
                            <h1 className="detailed-page__title">
                                {item.title} <span className="detailed-page__reference">{item.reference}</span>
                            </h1>

                            {/* Cigar metadata strip */}
                            <div className="cigar-meta-strip">
                                <div className="cigar-meta-item">
                                    <span className="cigar-meta-label">BRAND</span>
                                    <span className="cigar-meta-value">{brand}</span>
                                </div>
                                <div className="cigar-meta-divider" />
                                <div className="cigar-meta-item">
                                    <span className="cigar-meta-label">ORIGIN</span>
                                    <span className="cigar-meta-value">{origin}</span>
                                </div>
                                <div className="cigar-meta-divider" />
                                <div className="cigar-meta-item">
                                    <span className="cigar-meta-label">SIZE</span>
                                    <span className="cigar-meta-value">{size}</span>
                                </div>
                                <div className="cigar-meta-divider" />
                                <div className="cigar-meta-item">
                                    <span className="cigar-meta-label">RARITY</span>
                                    <span className="cigar-meta-value">{rarity}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="detailed-page__description">
                                {item.detailedDescription || item.description}
                            </p>

                            {/* Thumbnails */}
                            <div className="detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`detailed-page__thumb-item ${activeThumbIdx === idx ? 'detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => { setMainImage(thumb); setActiveThumbIdx(idx) }}
                                    >
                                        <img src={thumb} alt={`View ${idx + 1}`} className="detailed-page__thumb-img" />
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* ── Right: Bid Sidebar ─────────────────────────── */}
                        <div className="detailed-page__sidebar">
                            <div className="cigar-detailed-page__card">

                                {/* Countdown Timer */}
                                <div className="detailed-page__timer-section">
                                    <span className="detailed-page__timer-title">AUCTION CLOSES IN</span>
                                    <div className="detailed-page__timer-row">
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.days)}</span>
                                            <span className="timer-label">DAYS</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.hours)}</span>
                                            <span className="timer-label">HRS</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.minutes)}</span>
                                            <span className="timer-label">MIN</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.seconds)}</span>
                                            <span className="timer-label">SEC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar-divider" />

                                {/* Current Bid & Reserve */}
                                <div className="detailed-page__bid-status">
                                    <div className="bid-status-col">
                                        <span className="panel-label">CURRENT BID</span>
                                        <span className="panel-value panel-value--large">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="bid-status-col text-right">
                                        <span className="panel-label">RESERVE</span>
                                        <span className={`panel-value panel-value--reserve ${item.reserveMet || currentBid >= (item.currentBidNumber * 1.05) ? 'reserve-met' : ''}`}>
                                            {item.reserveMet || currentBid >= (item.currentBidNumber * 1.05) ? (
                                                <>
                                                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    MET
                                                </>
                                            ) : 'NOT MET'}
                                        </span>
                                    </div>
                                </div>

                                <div className="sidebar-divider" />

                                {/* Increment & Bidders */}
                                <div className="detailed-page__bid-specs">
                                    <div className="spec-col">
                                        <span className="panel-label">BID INCREMENT:</span>
                                        <span className="panel-value">{formatCurrency(item.bidIncrement)}</span>
                                    </div>
                                    <div className="spec-col text-right">
                                        <span className="panel-value">{biddersCount} ACTIVE</span>
                                        <span className="panel-label">BIDDERS</span>
                                    </div>
                                </div>

                                {/* Place Bid Button */}
                                <button className="cigar-detailed-page__place-bid-btn" onClick={handlePlaceBidClick}>
                                    PLACE BID
                                </button>

                                {/* Secondary Actions */}
                                <div className="detailed-page__action-row">
                                    {/* <button
                                        className={`action-btn-secondary ${isAutoBidding ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
                                    >
                                        <svg className="action-icon" viewBox="0 0 24 24" fill={isAutoBidding ? '#000' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                        {isAutoBidding ? 'AUTO BID ACTIVE' : 'AUTO BID'}
                                    </button> */}
                                    <button
                                        className={`action-btn-secondary ${isFavorited ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsFavorited(!isFavorited)}
                                    >
                                        <svg className="action-icon" viewBox="0 0 24 24" fill={isFavorited ? '#c8a97a' : 'none'} stroke={isFavorited ? '#c8a97a' : 'currentColor'} strokeWidth="2">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        {isFavorited ? 'Added to watchlist' : 'Add to watchlist'}
                                    </button>
                                </div>

                                <div className="sidebar-divider" />

                                {/* Live Activity */}
                                <div className="detailed-page__live-activity">
                                    <div className="live-activity-header">
                                        <span className="live-activity-title">LIVE ACTIVITY</span>
                                        <span className="live-pulse" />
                                    </div>
                                    <div className="live-activity-list">
                                        {bids.map((bid, index) => (
                                            <div className="live-bid-item" key={bid.id || index}>
                                                <div className="bid-user-info">
                                                    <span className="bid-username">{index + 1}. {bid.member}</span>
                                                    <span className="bid-timestamp">{bid.timeAgo || 'Just now'}</span>
                                                </div>
                                                <div className="bid-amount-value">{bid.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Tabs Section */}
                    <div className="detailed-page__tabs-container">
                        <div className="detailed-page__tabs-header">
                            <button
                                className={`tab-link-btn ${activeTab === 'provenance' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('provenance')}
                            >
                                PROVENANCE
                                {activeTab === 'provenance' && <span className="tab-indicator" />}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'auth' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('auth')}
                            >
                                AUTHENTICATION
                                {activeTab === 'auth' && <span className="tab-indicator" />}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'condition' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('condition')}
                            >
                                CONDITION REPORT
                                {activeTab === 'condition' && <span className="tab-indicator" />}
                            </button>
                        </div>

                        <div className="detailed-page__tabs-content">

                            {activeTab === 'provenance' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">{item.provenance?.title || 'Heritage & Origin'}</h3>
                                        <p className="tab-panel-text">
                                            {item.provenance?.description || 'This cigar has been meticulously stored and authenticated, with full provenance documentation available on request.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="ownership-timeline">
                                            {(item.provenance?.timeline || []).map((t, idx) => (
                                                <div className="timeline-card" key={idx}>
                                                    <span className="timeline-period">{t.period}</span>
                                                    <p className="timeline-detail">{t.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="view-registry-btn">VIEW FULL DOSSIER</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'auth' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Certified Authenticity</h3>
                                        <p className="tab-panel-text">
                                            {item.authentication || 'Every cigar listed on Opulenza undergoes a rigorous verification process by independent master tobacconists and factory records cross-referencing.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="auth-checks-list">
                                            {[
                                                'Factory hologram & warranty card verified',
                                                'Band typography & box branding confirmed',
                                                'Independent master tobacconist inspection',
                                                'Full chain-of-custody documentation sealed',
                                            ].map((check, idx) => (
                                                <div className="auth-check-item" key={idx}>
                                                    <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Condition Assessment</h3>
                                        <p className="tab-panel-text">
                                            Each cigar in this lot was individually inspected and graded. Storage conditions have been verified through humidity and temperature logs maintained since acquisition.
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="condition-grades-grid">
                                            {(item.conditionReport?.label || []).map((lbl, idx) => (
                                                <div className="condition-grade-item" key={idx}>
                                                    <span className="condition-lbl">{lbl}</span>
                                                    <span className="condition-val">{item.conditionReport.value[idx]}</span>
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
                    <div className="bid-modal-overlay fade-in-animation">
                        <div className="bid-modal-card">
                            <button className="close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <div className="modal-header">
                                <span className="modal-auction-badge">AUCTION LIVE</span>
                                <h2 className="modal-title">Place Your Bid</h2>
                            </div>
                            <div className="modal-asset-card">
                                <div className="modal-asset-thumb">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="modal-asset-info">
                                    <span className="modal-asset-label">CURRENT ASSET</span>
                                    <p className="modal-asset-name">{item.title} <span>{item.reference}</span></p>
                                     </div>
                            </div>
                            <form onSubmit={submitCustomBid} className="modal-form">
                                <div className="modal-bid-row">
                                    <div className="modal-bid-stat">
                                        <span className="modal-bid-stat-label">CURRENT BID</span>
                                        <span className="modal-bid-stat-value">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="modal-bid-stat modal-bid-stat--right">
                                        <span className="modal-bid-stat-label">MIN. NEXT BID</span>
                                        <span className="modal-bid-stat-value modal-bid-stat-value--gold">${item.bidIncrement}</span>
                                    </div>
                                </div>
                                <div className="modal-input-section">
                                    <label className="modal-input-label">YOUR BID AMOUNT (USD)</label>
                                    <div className="modal-input-wrapper">
                                        <span className="currency-prefix">$</span>
                                        <input
                                            type="number"
                                            className="modal-bid-input"
                                            value={customBidAmount}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={item?.bidIncrement}
                                            step={1}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="modal-error-msg">{bidError}</p>}
                                </div>
                                {/* <div className="modal-autobid-row">
                                    <div className="modal-autobid-text">
                                        <span className="modal-autobid-title">Auto Bid</span>
                                        <span className="modal-autobid-sub">OPULENZA WILL BID UP TO YOUR LIMIT</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`modal-toggle${modalAutoBid ? ' modal-toggle--on' : ''}`}
                                        onClick={() => setModalAutoBid(v => !v)}
                                        aria-label="Toggle auto bid"
                                    >
                                        <span className="modal-toggle-knob" />
                                    </button>
                                </div> */}
                                <label className="modal-terms-row">
                                    <input
                                        type="checkbox"
                                        className="modal-terms-check"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span className="modal-terms-text">
                                        I accept the <span className="modal-terms-link">Terms of Service</span> and acknowledge that this bid constitutes a legally binding contract to purchase the asset.
                                    </span>
                                </label>
                                <button type="submit" className="submit-bid-btn" disabled={!termsAccepted}>
                                    CONFIRM BID
                                </button>
                                <div className="modal-secure-footer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>SECURE VAULT ENCRYPTION</span>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Recommended Cigars */}
                <div className="container">
                    <div className="recommended-section">
                        <div className="recommended-header">
                            <div className="recommended-title-container">
                                <span className="recommended-subtitle">CURATED FOR YOU</span>
                                <h2 className="recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/cigarsListings" className="view-all-auctions-link">
                                VIEW ALL LIVE AUCTIONS
                            </Link>
                        </div>
                        <div className="recommended-grid">
                            {cigarData
                                .filter(c => c.id !== item.id)
                                .slice(0, 3)
                                .map(rec => (
                                    <Link to={`/cigar/${rec.id}`} key={rec.id} className="recommended-card-link">
                                        <div className="recommended-card">
                                            <div className="recommended-card__image-container">
                                                <img src={rec.image} alt={`${rec.title} ${rec.reference}`} className="recommended-card__image" />
                                                <div className="recommended-card__gradient-overlay" />
                                            </div>
                                            <div className="recommended-card__info">
                                                <h3 className="recommended-card__title">{rec.title} — {rec.reference}</h3>
                                                <p className="recommended-card__estimate">Current Bid: {rec.currentBid}</p>
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

export default DetailedCigarPage
