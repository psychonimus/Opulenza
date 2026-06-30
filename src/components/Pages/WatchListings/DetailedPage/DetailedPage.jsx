import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import watchData from '../../../../data/WatchData'

import './DetailedPage.css'

const DetailedPage = () => {
    const { id } = useParams();
    const watch = watchData.find(item => item.id === Number(id));

    // Tab State: 'history' | 'auth' | 'condition'
    const [activeTab, setActiveTab] = useState('history');

    // Bidding States
    const [currentBid, setCurrentBid] = useState(watch ? watch.currentBidNumber : 0);
    const [bids, setBids] = useState(watch ? (watch.liveActivity || []) : []);
    const [biddersCount, setBiddersCount] = useState(watch ? (watch.activeBidders || 10) : 10);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAutoBidding, setIsAutoBidding] = useState(false);

    // Magnifier state
    const magnifierRef = useRef(null);
    const [magnifier, setMagnifier] = useState({
        visible: false,
        x: 0, y: 0,
        bgX: 0, bgY: 0,
        wrapperW: 0, wrapperH: 0,
    });
    const LENS_SIZE = 160;  // lens diameter in px
    const ZOOM = 2.5;       // zoom multiplier

    const handleMagnifierMove = useCallback((e) => {
        const wrapper = magnifierRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Pixel-perfect background-position:
        // Shows the zoomed region centred on (x, y)
        const bgX = -(x * ZOOM - LENS_SIZE / 2);
        const bgY = -(y * ZOOM - LENS_SIZE / 2);
        setMagnifier({
            visible: true,
            x, y,
            bgX, bgY,
            wrapperW: rect.width,
            wrapperH: rect.height,
        });
    }, [LENS_SIZE, ZOOM]);

    const handleMagnifierLeave = useCallback(() => {
        setMagnifier(prev => ({ ...prev, visible: false }));
    }, []);

    // Image gallery state
    const [mainImage, setMainImage] = useState(watch ? watch.image : '');

    // Modal State for custom placing bid
    const [showBidModal, setShowBidModal] = useState(false);
    const [customBidAmount, setCustomBidAmount] = useState(watch ? (watch.currentBidNumber + watch.bidIncrement) : 0);
    const [bidError, setBidError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [modalAutoBid, setModalAutoBid] = useState(false);

    // Dynamic Timer countdown
    const [timeLeft, setTimeLeft] = useState({
        days: watch?.initialTime?.days || 0,
        hours: watch?.initialTime?.hours || 4,
        minutes: watch?.initialTime?.minutes || 18,
        seconds: watch?.initialTime?.seconds || 40
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    clearInterval(timer);
                    return prev;
                }
                let s = prev.seconds - 1;
                let m = prev.minutes;
                let h = prev.hours;
                let d = prev.days;
                if (s < 0) {
                    s = 59;
                    m -= 1;
                }
                if (m < 0) {
                    m = 59;
                    h -= 1;
                }
                if(h < 0 ){
                    h = 23
                    d -= 1
                }
                if(d<0){
                    d = 0
                }
                return { days: d, hours: h, minutes: m, seconds: s };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-bid simulation background loop
    useEffect(() => {
        let simInterval;
        if (isAutoBidding && watch) {
            simInterval = setInterval(() => {
                // 35% chance to place a bid on each tick
                if (Math.random() < 0.35) {
                    const increment = watch.bidIncrement;
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
            }, 7000); // Check every 7 seconds
        }

        return () => {
            if (simInterval) clearInterval(simInterval);
        };
    }, [isAutoBidding, watch?.bidIncrement, watch]);

    // Handle invalid watch ID (Early return after all hooks are declared)
    if (!watch) {
        return (
            <div className="watch-not-found">
                <div className="container text-center py-5">
                    <h2 className="error-title">Timepiece Not Found</h2>
                    <p className="error-desc">The watch listing you are looking for does not exist or has been archived.</p>
                    <Link to="/watchListing" className="back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        );
    }

    // Helper to format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Helper to format number padding
    const formatNum = (num) => String(num).padStart(2, '0');

    // Dynamic Thumbnail image list
    const thumbnails = [
        watch.image,
        ...watch.angles
    ];

    // Place Bid Action handler
    const handlePlaceBidClick = () => {
        setCustomBidAmount(currentBid + watch.bidIncrement);
        setBidError('');
        setShowBidModal(true);
    };

    const submitCustomBid = (e) => {
        e.preventDefault();
        const amt = Number(customBidAmount);
        const minRequired = currentBid + watch.bidIncrement;

        if (isNaN(amt) || amt < minRequired) {
            setBidError(`Bid must be at least ${formatCurrency(minRequired)}`);
            return;
        }

        // Apply new bid
        const newBidObj = {
            id: Date.now(),
            member: `MEMBER #YOU***${Math.floor(Math.random() * 9 + 1)}`,
            timeAgo: 'Just now',
            timestamp: Date.now(),
            amount: formatCurrency(amt),
            amountNumber: amt
        };

        setCurrentBid(amt);
        setBids(prev => [newBidObj, ...prev]);
        setBiddersCount(prev => prev + 1);
        setShowBidModal(false);
        setSuccessMessage(`Bid of ${formatCurrency(amt)} placed successfully!`);

        setTimeout(() => {
            setSuccessMessage('');
        }, 4000);
    };

    return (
        <>
            
            <section className="detailed-page">
                <div className="detailed-page__bg-overlay"></div>
                <div className="container detailed-page__container">

                    {/* Back to listings link */}
                    <div className="detailed-page__breadcrumb">
                        <Link to="/watchListing" className="breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Listings
                        </Link>
                    </div>

                    {successMessage && (
                        <div className="bid-toast-notification">
                            <div className="toast-content">
                                <span className="toast-dot"></span>
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Primary Column Layout */}
                    <div className="detailed-page__grid">

                        {/* Left Column: Image and Description */}
                        <div className="detailed-page__gallery-and-info">

                            {/* Main Image Frame */}
                            <div
                                className="detailed-page__main-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={watch.title} className="detailed-page__main-image" />
                                <div className="detailed-page__image-glow"></div>

                                {/* Circular magnifier lens */}
                                {magnifier.visible && (
                                    <div
                                        className="detailed-page__magnifier-lens"
                                        style={{
                                            width: LENS_SIZE,
                                            height: LENS_SIZE,
                                            left: magnifier.x - LENS_SIZE / 2,
                                            top: magnifier.y - LENS_SIZE / 2,
                                            backgroundImage: `url(${mainImage})`,
                                            // backgroundSize must be in px for the offset math to work
                                            backgroundSize: `${magnifier.wrapperW * ZOOM}px ${magnifier.wrapperH * ZOOM}px`,
                                            backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Watch Title */}
                            <h1 className="detailed-page__title">
                                {watch.title} <span className="detailed-page__reference">{watch.reference}</span>
                            </h1>

                            {/* Description */}
                            <p className="detailed-page__description">
                                {watch.detailedDescription || watch.description}
                            </p>

                            {/* Thumbnail Selector */}
                            <div className="detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`detailed-page__thumb-item ${mainImage === thumb ? 'detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => setMainImage(thumb)}
                                    >
                                        <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="detailed-page__thumb-img" />
                                        {/* {idx === 3 && (
                                            <div className="detailed-page__thumb-overlay">
                                                <span>+12</span>
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right Column: Bid Panel Sidebar */}
                        <div className="detailed-page__sidebar">
                            <div className="detailed-page__card">

                                {/* Time Remaining Timer */}
                                <div className="detailed-page__timer-section">
                                    <span className="detailed-page__timer-title">TIME REMAINING</span>
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

                                <div className="sidebar-divider"></div>

                                {/* Current Bid & Reserve status */}
                                <div className="detailed-page__bid-status">
                                    <div className="bid-status-col">
                                        <span className="panel-label">CURRENT BID</span>
                                        <span className="panel-value panel-value--large">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="bid-status-col text-right">
                                        <span className="panel-label">RESERVE</span>
                                        <span className={`panel-value panel-value--reserve ${watch.reserveMet || currentBid >= (watch.currentBidNumber * 1.05) ? 'reserve-met' : ''}`}>
                                            {watch.reserveMet || currentBid >= (watch.currentBidNumber * 1.05) ? (
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

                                <div className="sidebar-divider"></div>

                                {/* Increment and Bidders */}
                                <div className="detailed-page__bid-specs">
                                    <div className="spec-col">
                                        <span className="panel-label">BID INCREMENT:</span>
                                        <span className="panel-value">{formatCurrency(watch.bidIncrement)}</span>
                                    </div>
                                    <div className="spec-col text-right">
                                        <span className="panel-value">{biddersCount} ACTIVE</span>
                                        <span className="panel-label">BIDDERS</span>
                                    </div>
                                </div>

                                {/* Main Bid Action Button */}
                                <button className="detailed-page__place-bid-btn" onClick={handlePlaceBidClick}>
                                    PLACE BID
                                </button>

                                {/* Secondary Buttons (Auto Bid, Watch) */}
                                <div className="detailed-page__action-row">
                                    <button
                                        className={`action-btn-secondary ${isAutoBidding ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
                                        title="Toggle automatic bidding mode"
                                    >
                                        <svg className="action-icon" viewBox="0 0 24 24" fill={isAutoBidding ? '#000' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                        {isAutoBidding ? 'AUTO BID ACTIVE' : 'AUTO BID'}
                                    </button>
                                    <button
                                        className={`action-btn-secondary ${isFavorited ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsFavorited(!isFavorited)}
                                    >
                                        <svg className="action-icon" viewBox="0 0 24 24" fill={isFavorited ? '#e1af4a' : 'none'} stroke={isFavorited ? '#e1af4a' : 'currentColor'} strokeWidth="2">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        {isFavorited ? 'WATCHING' : 'WATCH'}
                                    </button>
                                </div>

                                <div className="sidebar-divider"></div>

                                {/* Live Activity Logs */}
                                <div className="detailed-page__live-activity">
                                    <div className="live-activity-header">
                                        <span className="live-activity-title">LIVE ACTIVITY</span>
                                        <span className="live-pulse"></span>
                                    </div>
                                    <div className="live-activity-list">
                                        {bids.map((bid, index) => (
                                            <div className="live-bid-item" key={bid.id || index}>
                                                <div className="bid-user-info">
                                                    <span className="bid-username">{index + 1}. {bid.member}</span>
                                                    <span className="bid-timestamp">{bid.timeAgo || 'Just now'}</span>
                                                </div>
                                                <div className="bid-amount-value">
                                                    {bid.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Bottom Section: Tabs Area */}
                    <div className="detailed-page__tabs-container">

                        {/* Tab Navigation Headers */}
                        <div className="detailed-page__tabs-header">
                            <button
                                className={`tab-link-btn ${activeTab === 'history' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                OWNERSHIP HISTORY
                                {activeTab === 'history' && <span className="tab-indicator"></span>}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'auth' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('auth')}
                            >
                                AUTHENTICATION
                                {activeTab === 'auth' && <span className="tab-indicator"></span>}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'condition' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('condition')}
                            >
                                CONDITION REPORT
                                {activeTab === 'condition' && <span className="tab-indicator"></span>}
                            </button>
                        </div>

                        {/* Tab Panels */}
                        <div className="detailed-page__tabs-content">

                            {activeTab === 'history' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">{watch.ownershipHistory?.title || 'Decades of Excellence'}</h3>
                                        <p className="tab-panel-text">
                                            {watch.ownershipHistory?.description || 'This timepiece has been meticulously preserved by collectors, showing excellent chain of custody and stored in secure, climate-controlled environments.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="ownership-timeline">
                                            {watch.ownershipHistory?.timeline?.map((item, idx) => (
                                                <div className="timeline-card" key={idx}>
                                                    <span className="timeline-period">{item.period}</span>
                                                    <p className="timeline-detail">{item.detail}</p>
                                                </div>
                                            )) || (
                                                    <>
                                                        <div className="timeline-card">
                                                            <span className="timeline-period">1962-2024</span>
                                                            <p className="timeline-detail">Private Estate Collection</p>
                                                        </div>
                                                        <div className="timeline-card">
                                                            <span className="timeline-period">2024-PRESENT</span>
                                                            <p className="timeline-detail">Curated Asset Holding</p>
                                                        </div>
                                                    </>
                                                )}
                                        </div>
                                        <button className="view-registry-btn">
                                            VIEW FULL REGISTRY
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'auth' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Certified Authenticity</h3>
                                        <p className="tab-panel-text">
                                            {watch.authentication || 'Every watch listed is subjected to a rigorous physical evaluation, verification of serial numbers against registry catalogs, and movement inspection by our horology experts.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="auth-checks-list">
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Official Manufacturer Archive Extract</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Case & Serial Registration Audit</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Movement Escapement & Amplitude Certified</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Full Provenance Dossier Sealed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'condition' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Condition Assessment</h3>
                                        <p className="tab-panel-text">
                                            {watch.conditionReport || 'This timepiece remains in pristine vintage state. Micro-wear is consistent with carefully stored museum-grade relics.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="condition-grades-grid">
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">CASE</span>
                                                <span className="condition-val">Grade 1.5 (Mint)</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">DIAL & HANDS</span>
                                                <span className="condition-val">Unrestored Tritium</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">GLASS</span>
                                                <span className="condition-val">Original Sapphire</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">MOVEMENT</span>
                                                <span className="condition-val">Serviced (295° Amp)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Custom Interactive Bidding Modal overlay */}
                {showBidModal && (
                    <div className="bid-modal-overlay fade-in-animation" onClick={(e) => { if (e.target === e.currentTarget) setShowBidModal(false) }}>
                        <div className="bid-modal-card">

                            {/* Close */}
                            <button className="close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            {/* Header */}
                            <div className="modal-header">
                                <span className="modal-auction-badge">AUCTION LIVE</span>
                                <h2 className="modal-title">Place Your Bid</h2>
                            </div>

                            {/* Asset Preview Card */}
                            <div className="modal-asset-card">
                                <div className="modal-asset-thumb">
                                    <img src={watch.image} alt={watch.title} />
                                </div>
                                <div className="modal-asset-info">
                                    <span className="modal-asset-label">CURRENT ASSET</span>
                                    <p className="modal-asset-name">{watch.title} <span>{watch.reference}</span></p>
                                    <p className="modal-asset-lot">Lot #{watch.id ? String(watch.id).padStart(3, '0') + String(Math.floor(Math.random() * 900) + 100) : '4421967'} — {watch.year || new Date().getFullYear()} Model</p>
                                </div>
                            </div>

                            <form onSubmit={submitCustomBid} className="modal-form">

                                {/* Current Bid / Min Next Bid */}
                                <div className="modal-bid-row">
                                    <div className="modal-bid-stat">
                                        <span className="modal-bid-stat-label">CURRENT BID</span>
                                        <span className="modal-bid-stat-value">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="modal-bid-stat modal-bid-stat--right">
                                        <span className="modal-bid-stat-label">MIN. NEXT BID</span>
                                        <span className="modal-bid-stat-value modal-bid-stat-value--gold">{formatCurrency(currentBid + watch.bidIncrement)}</span>
                                    </div>
                                </div>

                                {/* Bid Amount Input */}
                                <div className="modal-input-section">
                                    <label className="modal-input-label">YOUR BID AMOUNT (USD)</label>
                                    <div className="modal-input-wrapper">
                                        <span className="currency-prefix">$</span>
                                        <input
                                            type="number"
                                            className="modal-bid-input"
                                            value={customBidAmount}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={currentBid + watch.bidIncrement}
                                            step={watch.bidIncrement}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="modal-error-msg">{bidError}</p>}
                                </div>

                                {/* Auto Bid Toggle */}
                                <div className="modal-autobid-row">
                                    <div className="modal-autobid-text">
                                        <span className="modal-autobid-title">Auto Bid</span>
                                        <span className="modal-autobid-sub">AUREUS WILL BID UP TO YOUR LIMIT</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`modal-toggle${modalAutoBid ? ' modal-toggle--on' : ''}`}
                                        onClick={() => setModalAutoBid(v => !v)}
                                        aria-label="Toggle auto bid"
                                    >
                                        <span className="modal-toggle-knob" />
                                    </button>
                                </div>

                                {/* Terms Checkbox */}
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

                                {/* Confirm Button */}
                                <button
                                    type="submit"
                                    className="submit-bid-btn"
                                    disabled={!termsAccepted}
                                >
                                    CONFIRM BID
                                </button>

                                {/* Secure Vault Footer */}
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


                <div className="container">
                    <div className="recommended-section">
                        <div className="recommended-header">
                            <div className="recommended-title-container">
                                <span className="recommended-subtitle">CURATED FOR YOU</span>
                                <h2 className="recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/watchListing" className="view-all-auctions-link">
                                VIEW ALL LIVE AUCTIONS
                            </Link>
                        </div>

                        <div className="recommended-grid">
                            {watchData
                                .filter(w => w.id !== watch.id)
                                .slice(0, 3)
                                .map(rec => (
                                <Link to={`/watch/${rec.id}`} key={rec.id} className="recommended-card-link">
                                    <div className="recommended-card">
                                        <div className="recommended-card__image-container">
                                            <img src={rec.image} alt={`${rec.title} ${rec.reference}`} className="recommended-card__image" />
                                            <div className="recommended-card__gradient-overlay"></div>
                                        </div>
                                        <div className="recommended-card__info">
                                            <span className="recommended-card__badge">{rec.badge}</span>
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

export default DetailedPage