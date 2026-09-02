import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import { AddBid } from '../../../../services/biddingServices/BiddingServices'
import './DetailedPenPage.css'

const DetailedPenPage = () => {
    const { id } = useParams()
    const [pen, setPen] = useState(null)
    const [pensList, setPensList] = useState([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState('history')

    // Bidding States
    const [currentBid, setCurrentBid] = useState(0)
    const [bids, setBids] = useState([])
    const [biddersCount, setBiddersCount] = useState(10)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isAutoBidding, setIsAutoBidding] = useState(false)

    // Magnifier state
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

    useEffect(() => {
        setLoading(true)
        getApprovedListing(4)
            .then((res) => {
                const list = res?.data?.data || []
                setPensList(list)
                const found = list.find(p => p.itemId === Number(id))
                if (found) {
                    const mappedPen = {
                        id: found.itemId,
                        itemId: found.itemId,
                        title: found.details?.brand || found.categoryName || "Premium Pen",
                        reference: found.details?.penType || "",
                        description: `Brand: ${found.details?.brand || 'N/A'} | Type: ${found.details?.penType || 'N/A'}`,
                        detailedDescription: `This is an exceptional ${found.details?.brand || 'writing instrument'} (${found.details?.penType || 'N/A'}). Body material: ${found.details?.bodyMaterial || 'N/A'}, Manufacturing year: ${found.details?.manifacturingYear || 'N/A'}, Condition: ${found.details?.condition || 'N/A'}, Limited Edition Registry: ${found.details?.limitedEditionRegistry || 'N/A'}.`,
                        image: found.details?.thumbnail || found.details?.image1,
                        angles: [found.details?.image2, found.details?.image3, found.details?.image4, found.details?.image5].filter(Boolean),
                        currentBidNumber: found.currentPrice || found.orignalPrice || found.expectedPrice || 1000,
                        bidIncrement: found.bidIncreament || 200,
                        currency: found.currency || 'USD',
                        auctionEndDate: found.auctionEndDate,
                        activeBidders: 10,
                        liveActivity: [
                            {
                                id: 1,
                                member: 'MEMBER #7***3',
                                timeAgo: '2 minutes ago',
                                timestamp: Date.now() - 120000,
                                amount: `$${found.currentPrice || found.orignalPrice || found.expectedPrice || 1000}`,
                                amountNumber: found.currentPrice || found.orignalPrice || found.expectedPrice || 1000
                            }
                        ],
                        details: [
                            { label: 'BRAND', value: found.details?.brand || '—' },
                            { label: 'TYPE', value: found.details?.penType || '—' },
                            { label: 'YEAR', value: found.details?.manifacturingYear || '—' },
                            { label: 'BODY MATERIAL', value: found.details?.bodyMaterial || '—' },
                        ],
                        ownershipHistory: {
                            title: 'Provenance & History',
                            description: `Meticulously preserved writing instrument of the ${found.details?.brand || 'N/A'} series. It is in ${found.details?.condition || 'pristine'} condition.`,
                            timeline: [
                                { period: found.details?.manifacturingYear || 'N/A', detail: 'Manufactured / Registered' },
                                { period: 'PRESENT', detail: 'Opulenza Authenticated Vault Custody' }
                            ]
                        },
                        authentication: `Every writing instrument undergoes physical validation. Original capped casing: ${found.details?.capped ? 'Verified' : 'N/A'}, Nib: ${found.details?.nib ? 'Verified' : 'N/A'}, Box & papers: ${found.details?.boxAndPapers ? 'Verified' : 'N/A'}.`,
                        conditionReport: {
                            label: ['BODY MATERIAL', 'CONDITION', 'LIMITED EDITION REGISTRY', 'CAPPED STATUS'],
                            value: [
                                found.details?.bodyMaterial || 'N/A',
                                found.details?.condition || 'N/A',
                                found.details?.limitedEditionRegistry || 'N/A',
                                found.details?.capped ? 'Pristine' : 'N/A'
                            ]
                        }
                    }
                    setPen(mappedPen)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    useEffect(() => {
        if (pen) {
            setCurrentBid(pen.currentBidNumber)
            setBids(pen.liveActivity || [])
            setBiddersCount(pen.activeBidders || 10)
            setMainImage(pen.image)
            setActiveThumbIdx(0)
            setCustomBidAmount(pen.currentBidNumber + pen.bidIncrement)
            setTimeLeft(pen.auctionEndDate ? calculateTimeLeft(pen.auctionEndDate) : { days: 1, hours: 4, minutes: 18, seconds: 40 })
        }
    }, [pen])

    useEffect(() => {
        if (!pen || !pen.auctionEndDate) return
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(pen.auctionEndDate))
        }, 1000)
        return () => clearInterval(timer)
    }, [pen])

    // Auto-bid simulation background loop
    useEffect(() => {
        let simInterval;
        if (isAutoBidding && pen) {
            simInterval = setInterval(() => {
                if (Math.random() < 0.35) {
                    const increment = pen.bidIncrement;
                    setCurrentBid(prev => {
                        const newAmt = prev + increment;
                        const newBidObj = {
                            id: Date.now(),
                            member: `MEMBER #${Math.floor(Math.random() * 9 + 1)}***${Math.floor(Math.random() * 9 + 1)}`,
                            timeAgo: 'Just now',
                            timestamp: Date.now(),
                            amount: formatCurrency(newAmt),
                            amountNumber: newAmt
                        };
                        setBids(prevList => [newBidObj, ...prevList]);
                        setBiddersCount(bc => bc + 1);
                        return newAmt;
                    });
                }
            }, 7000);
        }

        return () => {
            if (simInterval) clearInterval(simInterval);
        };
    }, [isAutoBidding, pen?.bidIncrement, pen]);

    // Handle loading state
    if (loading) {
        return (
            <div className="pen-not-found">
                <div className="container text-center py-5">
                    <span className="ap-spin" style={{ color: '#d6a54d' }}>Loading details...</span>
                </div>
            </div>
        )
    }

    if (!pen) {
        return (
            <div className="pen-not-found">
                <div className="container text-center py-5">
                    <h2 className="pen-error-title">Pen Not Found</h2>
                    <p className="pen-error-desc">The writing instrument you are looking for does not exist or has been archived.</p>
                    <Link to="/penListings" className="pen-back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        )
    }

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatNum = (num) => String(num).padStart(2, '0')

    const thumbnails = [pen.image, ...(pen.angles || [])]

    const handlePlaceBidClick = () => {
        setCustomBidAmount(currentBid + pen.bidIncrement)
        setBidError('')
        setShowBidModal(true)
    }

    const submitCustomBid = (e) => {
        e.preventDefault()
        const amt = Number(customBidAmount)
        const minRequired = currentBid + pen.bidIncrement
        if (isNaN(amt) || amt < minRequired) {
            setBidError(`Bid must be at least ${formatCurrency(minRequired)}`)
            return
        }

        const payload = {
            ItemId: pen.itemId,
            BidAmount: amt,
            Currency: pen.currency
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
            <section className="pen-detailed-page">
                <div className="pen-detailed-page__bg-overlay" />
                <div className="container pen-detailed-page__container">

                    {/* Breadcrumb */}
                    <div className="pen-detailed-page__breadcrumb">
                        <Link to="/penListings" className="pen-breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pen-breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Writing Instruments
                        </Link>
                    </div>

                    {/* Toast */}
                    {successMessage && (
                        <div className="pen-toast-notification">
                            <div className="pen-toast-content">
                                <span className="pen-toast-dot" />
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Two-column grid */}
                    <div className="pen-detailed-page__grid">

                        {/* ── Left ─────────────────────────────────────── */}
                        <div className="pen-detailed-page__gallery-and-info">

                            {/* Main Image */}
                            <div
                                className="pen-detailed-page__main-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={pen.title} className="pen-detailed-page__main-image" />
                                <div className="pen-detailed-page__image-glow" />

                                {magnifier.visible && (
                                    <div
                                        className="pen-detailed-page__magnifier-lens"
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
                            <h1 className="pen-detailed-page__title">
                                {pen.title} <span className="pen-detailed-page__reference">{pen.reference}</span>
                            </h1>

                            {/* Description */}
                            <p className="pen-detailed-page__description">
                                {pen.detailedDescription || pen.description}
                            </p>

                            {/* Spec strip */}
                            <div className="pen-meta-strip">
                                {pen.details.map((d, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="pen-meta-item">
                                            <span className="pen-meta-label">{d.label}</span>
                                            <span className="pen-meta-value">{d.value}</span>
                                        </div>
                                        {idx < pen.details.length - 1 && <div className="pen-meta-divider" />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Thumbnails */}
                            <div className="pen-detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`pen-detailed-page__thumb-item ${activeThumbIdx === idx ? 'pen-detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => { setMainImage(thumb); setActiveThumbIdx(idx) }}
                                    >
                                        <img src={thumb} alt={`View ${idx + 1}`} className="pen-detailed-page__thumb-img" />
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* ── Right: Bid Sidebar ────────────────────────── */}
                        <div className="pen-detailed-page__sidebar">
                            <div className="pen-detailed-page__card">

                                {/* Timer */}
                                <div className="pen-timer-section">
                                    <span className="pen-timer-title">TIME REMAINING</span>
                                    <div className="pen-timer-row">
                                        <div className="pen-timer-block">
                                            <span className="pen-timer-number">{formatNum(timeLeft.days)}</span>
                                            <span className="pen-timer-label">DAYS</span>
                                        </div>
                                        <span className="pen-timer-separator">:</span>
                                        <div className="pen-timer-block">
                                            <span className="pen-timer-number">{formatNum(timeLeft.hours)}</span>
                                            <span className="pen-timer-label">HRS</span>
                                        </div>
                                        <span className="pen-timer-separator">:</span>
                                        <div className="pen-timer-block">
                                            <span className="pen-timer-number">{formatNum(timeLeft.minutes)}</span>
                                            <span className="pen-timer-label">MIN</span>
                                        </div>
                                        <span className="pen-timer-separator">:</span>
                                        <div className="pen-timer-block">
                                            <span className="pen-timer-number">{formatNum(timeLeft.seconds)}</span>
                                            <span className="pen-timer-label">SEC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pen-sidebar-divider" />

                                {/* Current Bid & Reserve */}
                                <div className="pen-bid-status">
                                    <div className="pen-bid-status-col">
                                        <span className="pen-panel-label">CURRENT BID</span>
                                        <span className="pen-panel-value pen-panel-value--large">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="pen-bid-status-col pen-text-right">
                                        <span className="pen-panel-label">RESERVE</span>
                                        <span className={`pen-panel-value pen-panel-value--reserve ${pen.reserveMet || currentBid >= (pen.currentBidNumber * 1.05) ? 'pen-reserve-met' : ''}`}>
                                            {pen.reserveMet || currentBid >= (pen.currentBidNumber * 1.05) ? (
                                                <>
                                                    <svg className="pen-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    MET
                                                </>
                                            ) : 'NOT MET'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pen-sidebar-divider" />

                                {/* Increment & Bidders */}
                                <div className="pen-bid-specs">
                                    <div className="pen-spec-col">
                                        <span className="pen-panel-label">BID INCREMENT:</span>
                                        <span className="pen-panel-value">{formatCurrency(pen.bidIncrement)}</span>
                                    </div>
                                    <div className="pen-spec-col pen-text-right">
                                        <span className="pen-panel-value">{biddersCount} ACTIVE</span>
                                        <span className="pen-panel-label">BIDDERS</span>
                                    </div>
                                </div>

                                {/* Place Bid */}
                                <button className="pen-place-bid-btn" onClick={handlePlaceBidClick}>
                                    PLACE BID
                                </button>

                                {/* Secondary Buttons */}
                                <div className="pen-action-row">
                                    {/* <button
                                        className={`pen-action-btn-secondary ${isAutoBidding ? 'pen-action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
                                    >
                                        <svg className="pen-action-icon" viewBox="0 0 24 24" fill={isAutoBidding ? '#040810' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                        {isAutoBidding ? 'AUTO BID ACTIVE' : 'AUTO BID'}
                                    </button> */}
                                    <button
                                        className={`pen-action-btn-secondary ${isFavorited ? 'pen-action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsFavorited(!isFavorited)}
                                    >
                                        <svg className="pen-action-icon" viewBox="0 0 24 24" fill={isFavorited ? '#d6a54d' : 'none'} stroke={isFavorited ? '#d6a54d' : 'currentColor'} strokeWidth="2">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        {isFavorited ? 'Added to watchlist' : 'Add to watchlist'}
                                    </button>
                                </div>

                                <div className="pen-sidebar-divider" />

                                {/* Live Activity */}
                                <div className="pen-live-activity">
                                    <div className="pen-live-activity-header">
                                        <span className="pen-live-activity-title">LIVE ACTIVITY</span>
                                        <span className="pen-live-pulse" />
                                    </div>
                                    <div className="pen-live-activity-list">
                                        {bids.map((bid, index) => (
                                            <div className="pen-live-bid-item" key={bid.id || index}>
                                                <div className="pen-bid-user-info">
                                                    <span className="pen-bid-username">{index + 1}. {bid.member}</span>
                                                    <span className="pen-bid-timestamp">{bid.timeAgo || 'Just now'}</span>
                                                </div>
                                                <div className="pen-bid-amount-value">{bid.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Tabs */}
                    <div className="pen-tabs-container">
                        <div className="pen-tabs-header">
                            <button
                                className={`pen-tab-link-btn ${activeTab === 'history' ? 'pen-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                OWNERSHIP HISTORY
                                {activeTab === 'history' && <span className="pen-tab-indicator" />}
                            </button>
                            <button
                                className={`pen-tab-link-btn ${activeTab === 'auth' ? 'pen-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('auth')}
                            >
                                AUTHENTICATION
                                {activeTab === 'auth' && <span className="pen-tab-indicator" />}
                            </button>
                            <button
                                className={`pen-tab-link-btn ${activeTab === 'condition' ? 'pen-tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('condition')}
                            >
                                CONDITION REPORT
                                {activeTab === 'condition' && <span className="pen-tab-indicator" />}
                            </button>
                        </div>

                        <div className="pen-tabs-content">

                            {activeTab === 'history' && (
                                <div className="pen-tab-panel-grid pen-fade-in">
                                    <div className="pen-tab-panel-info">
                                        <h3 className="pen-tab-panel-heading">{pen.ownershipHistory?.title || 'Provenance & History'}</h3>
                                        <p className="pen-tab-panel-text">
                                            {pen.ownershipHistory?.description || 'This writing instrument has been meticulously preserved and comes with full provenance documentation.'}
                                        </p>
                                    </div>
                                    <div className="pen-tab-panel-interactive">
                                        <div className="pen-ownership-timeline">
                                            {(pen.ownershipHistory?.timeline || []).map((item, idx) => (
                                                <div className="pen-timeline-card" key={idx}>
                                                    <span className="pen-timeline-period">{item.period}</span>
                                                    <p className="pen-timeline-detail">{item.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="pen-view-registry-btn">VIEW FULL REGISTRY</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'auth' && (
                                <div className="pen-tab-panel-grid pen-fade-in">
                                    <div className="pen-tab-panel-info">
                                        <h3 className="pen-tab-panel-heading">Certified Authenticity</h3>
                                        <p className="pen-tab-panel-text">
                                            {pen.authentication || 'Every writing instrument on Opulenza undergoes rigorous physical evaluation, serial number verification, and expert inspection by independent specialists.'}
                                        </p>
                                    </div>
                                    <div className="pen-tab-panel-interactive">
                                        <div className="pen-auth-checks-list">
                                            {[
                                                'Serial number confirmed from factory records',
                                                'Nib hallmark and alloy certification verified',
                                                'Barrel material and finish authenticated',
                                                'Full provenance dossier sealed and certified',
                                            ].map((check, idx) => (
                                                <div className="pen-auth-check-item" key={idx}>
                                                    <svg className="pen-auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                                <div className="pen-tab-panel-grid pen-fade-in">
                                    <div className="pen-tab-panel-info">
                                        <h3 className="pen-tab-panel-heading">Condition Assessment</h3>
                                        <p className="pen-tab-panel-text">
                                            Each component of this writing instrument has been individually graded and inspected by an independent expert. Storage conditions have been verified and documented.
                                        </p>
                                    </div>
                                    <div className="pen-tab-panel-interactive">
                                        <div className="pen-condition-grades-grid">
                                            {(pen.conditionReport?.label || []).map((lbl, idx) => (
                                                <div className="pen-condition-grade-item" key={idx}>
                                                    <span className="pen-condition-lbl">{lbl}</span>
                                                    <span className="pen-condition-val">{pen.conditionReport.value[idx]}</span>
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
                    <div className="pen-bid-modal-overlay pen-fade-in">
                        <div className="pen-bid-modal-card">
                            <button className="pen-close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <div className="pen-modal-header">
                                <span className="pen-modal-auction-badge">AUCTION LIVE</span>
                                <h2 className="pen-modal-title">Place Your Bid</h2>
                            </div>
                            <div className="pen-modal-asset-card">
                                <div className="pen-modal-asset-thumb">
                                    <img src={pen.image} alt={pen.title} />
                                </div>
                                <div className="pen-modal-asset-info">
                                    <span className="pen-modal-asset-label">CURRENT ASSET</span>
                                    <p className="pen-modal-asset-name">{pen.title} <span>{pen.reference}</span></p>
                                </div>
                            </div>
                            <form onSubmit={submitCustomBid} className="pen-modal-form">
                                <div className="pen-modal-bid-row">
                                    <div className="pen-modal-bid-stat">
                                        <span className="pen-modal-bid-stat-label">CURRENT BID</span>
                                        <span className="pen-modal-bid-stat-value">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="pen-modal-bid-stat pen-modal-bid-stat--right">
                                        <span className="pen-modal-bid-stat-label">MIN. NEXT BID</span>
                                        <span className="pen-modal-bid-stat-value pen-modal-bid-stat-value--accent">{formatCurrency(currentBid + pen.bidIncrement)}</span>
                                    </div>
                                </div>
                                <div className="pen-modal-input-section">
                                    <label className="pen-modal-input-label">YOUR BID AMOUNT (USD)</label>
                                    <div className="pen-modal-input-wrapper">
                                        <span className="pen-currency-prefix">$</span>
                                        <input
                                            type="number"
                                            className="pen-modal-bid-input"
                                            value={customBidAmount}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={currentBid + pen.bidIncrement}
                                            step={pen.bidIncrement}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="pen-modal-error-msg">{bidError}</p>}
                                </div>
                                {/* <div className="pen-modal-autobid-row">
                                    <div className="pen-modal-autobid-text">
                                        <span className="pen-modal-autobid-title">Auto Bid</span>
                                        <span className="pen-modal-autobid-sub">OPULENZA WILL BID UP TO YOUR LIMIT</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`pen-modal-toggle${modalAutoBid ? ' pen-modal-toggle--on' : ''}`}
                                        onClick={() => setModalAutoBid(v => !v)}
                                        aria-label="Toggle auto bid"
                                    >
                                        <span className="pen-modal-toggle-knob" />
                                    </button>
                                </div> */}
                                <label className="pen-modal-terms-row">
                                    <input
                                        type="checkbox"
                                        className="pen-modal-terms-check"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span className="pen-modal-terms-text">
                                        I accept the <span className="pen-modal-terms-link">Terms of Service</span> and acknowledge that this bid constitutes a legally binding contract to purchase the asset.
                                    </span>
                                </label>
                                <button type="submit" className="pen-submit-bid-btn" disabled={!termsAccepted}>
                                    CONFIRM BID
                                </button>
                                <div className="pen-modal-secure-footer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>SECURE VAULT ENCRYPTION</span>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Recommended */}
                <div className="container">
                    <div className="pen-recommended-section">
                        <div className="pen-recommended-header">
                            <div className="pen-recommended-title-container">
                                <span className="pen-recommended-subtitle">CURATED FOR YOU</span>
                                <h2 className="pen-recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/penListings" className="pen-view-all-link">
                                VIEW ALL LIVE AUCTIONS
                            </Link>
                        </div>
                        <div className="pen-recommended-grid">
                            {pensList
                                .filter(p => p.itemId !== pen.itemId)
                                .slice(0, 3)
                                .map(rec => {
                                    const recTitle = rec.details?.brand || rec.categoryName || "Premium Pen";
                                    const recReference = rec.details?.penType || "";
                                    const recImage = rec.details?.capped || "";
                                    const recBid = rec.currentPrice || rec.orignalPrice || rec.expectedPrice || 1000;

                                    return (
                                        <Link to={`/pen/${rec.itemId}`} key={rec.itemId} className="pen-recommended-card-link">
                                            <div className="pen-recommended-card">
                                                <div className="pen-recommended-card__image-container">
                                                    <img src={recImage} alt={`${recTitle} ${recReference}`} className="pen-recommended-card__image" />
                                                    <div className="pen-recommended-card__gradient-overlay" />
                                                </div>
                                                <div className="pen-recommended-card__info">
                                                    <h3 className="pen-recommended-card__title">{recTitle} — <em>{recReference}</em></h3>
                                                    <p className="pen-recommended-card__estimate">Current Bid: {formatCurrency(recBid)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default DetailedPenPage
