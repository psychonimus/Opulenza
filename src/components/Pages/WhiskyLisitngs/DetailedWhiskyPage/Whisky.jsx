import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import whiskyData from '../../../../data/WhiskyData'
import './Whisky.css'

/* ── Whisky-specific enrichments not present in the base data ── */
const whiskyEnrichments = {
    1: {
        currentBidNumber: 2310000,
        bidIncrement: 25000,
        activeBidders: 18,
        reserveMet: true,
        detailedDescription: 'The Macallan 1926 Fine & Rare is widely considered the holy grail of Scotch whisky. One of only 40 bottles ever released, it was distilled in 1926 and bottled in 1986 after 60 years maturing in a sherry cask. A singular expression of patience, provenance, and mastery.',
        angles: ['/images/whisky/macallan/macallan-main.png', '/images/whisky/macallan/macallan-main.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #9***2', timeAgo: '1 minute ago', timestamp: Date.now() - 60000, amount: '$2,310,000', amountNumber: 2310000 },
            { id: 2, member: 'MEMBER #4***7', timeAgo: '9 minutes ago', timestamp: Date.now() - 540000, amount: '$2,285,000', amountNumber: 2285000 },
            { id: 3, member: 'MEMBER #1***5', timeAgo: '22 minutes ago', timestamp: Date.now() - 1320000, amount: '$2,260,000', amountNumber: 2260000 },
        ],
        provenance: {
            title: 'Sixty Years in the Cask',
            description: 'Distilled at Easter Elchies House on 23 April 1926, the spirit spent 60 years in a single hand-selected sherry hogshead before being decanted in 1986. One of only 40 bottles ever released to the world.',
            timeline: [
                { period: '1926', detail: 'Distilled at Macallan Distillery, Speyside' },
                { period: '1926–1986', detail: 'Matured in Oloroso Sherry cask, Warehouse No. 1' },
                { period: '1986', detail: 'Bottled and certified by The Macallan' },
                { period: '1986–PRESENT', detail: 'Private European Cellar, single ownership' },
            ]
        },
        authentication: 'Authenticated by The Macallan Heritage Archive. Wax seal, label condition, and fill-level are consistent with known Fine & Rare releases. Accompanied by original presentation box and distillery certification letter.',
        conditionReport: {
            label: ['BOTTLE', 'LABEL', 'WAX SEAL', 'FILL LEVEL'],
            value: ['Pristine — no chips or cloudiness', 'Near Mint — original graphics intact', 'Unbroken, original colour', 'Upper shoulder — no ullage'],
        }
    },
    2: {
        currentBidNumber: 1480000,
        bidIncrement: 15000,
        activeBidders: 12,
        reserveMet: true,
        detailedDescription: 'The Dalmore 62-Year-Old decanter is one of the most extraordinary expressions ever released, combining spirit from casks dating as far back as 1868. Presented in a bespoke Caithness crystal decanter, it is a work of art in both form and liquid.',
        angles: ['/images/whisky/dalmore/dalmore.png', '/images/whisky/dalmore/dalmore.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #3***1', timeAgo: '3 minutes ago', timestamp: Date.now() - 180000, amount: '$1,480,000', amountNumber: 1480000 },
            { id: 2, member: 'MEMBER #8***6', timeAgo: '14 minutes ago', timestamp: Date.now() - 840000, amount: '$1,465,000', amountNumber: 1465000 },
            { id: 3, member: 'MEMBER #5***4', timeAgo: '31 minutes ago', timestamp: Date.now() - 1860000, amount: '$1,450,000', amountNumber: 1450000 },
        ],
        provenance: {
            title: 'A Blend of Centuries',
            description: 'Blended from five casks, the oldest containing spirit distilled in 1868. This decanter was commissioned for a private buyer and subsequently passed to one of Europe\'s foremost whisky collections.',
            timeline: [
                { period: '1868', detail: 'Earliest spirit distilled, The Dalmore, Scotland' },
                { period: '1942', detail: 'Final cask distilled and selected for blending' },
                { period: '2002', detail: 'Vatted, decanted, and certified at The Dalmore' },
                { period: '2002–PRESENT', detail: 'Private Cellar Collection, Edinburgh' },
            ]
        },
        authentication: 'Authenticated by The Dalmore Distillery Cellar Master. Crystal decanter, stopper, and casing are all original. Accompanied by the numbered certificate of authenticity signed by Richard Paterson.',
        conditionReport: {
            label: ['DECANTER', 'STOPPER', 'LIQUID', 'PRESENTATION CASE'],
            value: ['Perfect — hand-blown Caithness crystal', 'Original, unchipped and secure', 'Brilliant amber, no cloudiness', 'Mint — original velvet lining intact'],
        }
    },
    3: {
        currentBidNumber: 965000,
        bidIncrement: 10000,
        activeBidders: 21,
        reserveMet: true,
        detailedDescription: 'Yamazaki 55-Year-Old is Japan\'s oldest commercially released single malt, distilled in 1960 and matured in rare Mizunara oak. Each bottle carries the unmistakable incense and sandalwood complexity unique to this sacred Japanese timber.',
        angles: ['/images/whisky/yamazaki/yamazaki-main.png', '/images/whisky/yamazaki/yamazaki-main.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #2***9', timeAgo: '5 minutes ago', timestamp: Date.now() - 300000, amount: '$965,000', amountNumber: 965000 },
            { id: 2, member: 'MEMBER #6***3', timeAgo: '18 minutes ago', timestamp: Date.now() - 1080000, amount: '$955,000', amountNumber: 955000 },
            { id: 3, member: 'MEMBER #4***8', timeAgo: '37 minutes ago', timestamp: Date.now() - 2220000, amount: '$945,000', amountNumber: 945000 },
        ],
        provenance: {
            title: 'Japan\'s Oldest Single Malt',
            description: 'Distilled at Suntory\'s Yamazaki Distillery in 1960 and matured for 55 years in a single Mizunara oak cask, this expression embodies the pinnacle of Japanese whisky philosophy — patience, harmony, and reverence for nature.',
            timeline: [
                { period: '1960', detail: 'Distilled at Yamazaki Distillery, Osaka Prefecture' },
                { period: '1960–2015', detail: 'Aged in single Mizunara oak cask' },
                { period: '2015', detail: 'Bottled by Suntory; 100 bottles released globally' },
                { period: '2015–PRESENT', detail: 'Private Collection, Singapore' },
            ]
        },
        authentication: 'Authenticated by Suntory Whisky. Accompanied by original Suntory certificate of authenticity with individual bottle number, and the personal signature of Chief Blender Shinji Fukuyo.',
        conditionReport: {
            label: ['BOTTLE', 'LABEL', 'CAPSULE', 'PRESENTATION BOX'],
            value: ['Pristine — hand-crafted Japanese glass', 'Mint — traditional Suntory washi paper', 'Intact — original gold foil', 'Near Mint — paulownia wood box'],
        }
    },
    4: {
        currentBidNumber: 742000,
        bidIncrement: 7500,
        activeBidders: 9,
        reserveMet: false,
        detailedDescription: 'Black Bowmore 1964 First Edition is the inaugural release from one of Islay\'s most revered distilleries. Matured in Oloroso sherry casks for 29 years, it offers an incomparable depth of dark fruit, volcanic peat and dried fig that has never been replicated.',
        angles: ['/images/whisky/bowmore/bowmore-main.png', '/images/whisky/bowmore/bowmore-main.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #7***1', timeAgo: '11 minutes ago', timestamp: Date.now() - 660000, amount: '$742,000', amountNumber: 742000 },
            { id: 2, member: 'MEMBER #3***5', timeAgo: '28 minutes ago', timestamp: Date.now() - 1680000, amount: '$734,500', amountNumber: 734500 },
            { id: 3, member: 'MEMBER #9***2', timeAgo: '52 minutes ago', timestamp: Date.now() - 3120000, amount: '$727,000', amountNumber: 727000 },
        ],
        provenance: {
            title: 'The First of the Black Legend',
            description: 'Distilled in the legendary year of 1964 at Bowmore on Islay, this was the first expression released in the iconic Black Bowmore series. It helped define what Islay whisky could be at its most profound and complex.',
            timeline: [
                { period: '1964', detail: 'Distilled at Bowmore Distillery, Isle of Islay' },
                { period: '1964–1993', detail: 'Matured in Oloroso Sherry Butts' },
                { period: '1993', detail: 'Bottled as Black Bowmore First Edition — 827 bottles' },
                { period: '1993–PRESENT', detail: 'Private Archive Collection, London' },
            ]
        },
        authentication: 'Authenticated by Bowmore Distillery. Wax seal is unbroken and shows original colour. Label is in original condition. Accompanied by original presentation box and numbered distillery certificate.',
        conditionReport: {
            label: ['BOTTLE', 'WAX SEAL', 'LABEL', 'FILL LEVEL'],
            value: ['Excellent — original hand-blown glass', 'Unbroken, original deep black', 'Very Good — minor age-related patina', 'Into neck — no significant ullage'],
        }
    },
    5: {
        currentBidNumber: 1120000,
        bidIncrement: 12500,
        activeBidders: 15,
        reserveMet: true,
        detailedDescription: 'The Glenfiddich 1937 Rare Collection is among the oldest whiskies in the world ever committed to bottle. Drawn from a single sherry butt, it spent over 64 years accumulating the extraordinary complexity that could only emerge from one of Scotland\'s longest uninterrupted distillery histories.',
        angles: ['/images/whisky/glenfiddich/glenfiddich-main.png', '/images/whisky/glenfiddich/glenfiddich-main.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #5***4', timeAgo: '6 minutes ago', timestamp: Date.now() - 360000, amount: '$1,120,000', amountNumber: 1120000 },
            { id: 2, member: 'MEMBER #2***8', timeAgo: '21 minutes ago', timestamp: Date.now() - 1260000, amount: '$1,107,500', amountNumber: 1107500 },
            { id: 3, member: 'MEMBER #7***6', timeAgo: '44 minutes ago', timestamp: Date.now() - 2640000, amount: '$1,095,000', amountNumber: 1095000 },
        ],
        provenance: {
            title: 'Pre-War Speyside Rarity',
            description: 'Distilled on the eve of the Second World War at Glenfiddich\'s historic Dufftown distillery, this cask has outlasted generations. The cask was identified, preserved, and monitored through Glenfiddich\'s Rare Collection program before bottling in 2001.',
            timeline: [
                { period: '1937', detail: 'Distilled at Glenfiddich Distillery, Dufftown, Scotland' },
                { period: '1937–2001', detail: 'Matured in European Oak Sherry Butt' },
                { period: '2001', detail: 'Bottled as part of the Rare Collection — 61 bottles' },
                { period: '2001–PRESENT', detail: 'Private European Collection' },
            ]
        },
        authentication: 'Authenticated by Glenfiddich Distillery. Accompanied by the hand-signed William Grant & Sons certificate of authenticity. Case and bottle are original and numbered.',
        conditionReport: {
            label: ['BOTTLE', 'LABEL', 'LEAD CAPSULE', 'PRESENTATION CASE'],
            value: ['Pristine — original lead glass', 'Near Mint — slight yellowing of paper', 'Intact — original, uncut seal', 'Excellent — rosewood box, fully intact'],
        }
    },
    6: {
        currentBidNumber: 528000,
        bidIncrement: 5000,
        activeBidders: 11,
        reserveMet: true,
        detailedDescription: 'The Hibiki 35-Year-Old is a transcendent blend of malts and grains from Suntory\'s three distilleries — Yamazaki, Hakushu, and Chita — united by the rare harmony that defines the Hibiki philosophy. Presented in the iconic 35-facet crystal decanter, it is as much sculpture as spirit.',
        angles: ['/images/whisky/hibiki/hibiki-main.png', '/images/whisky/hibiki/hibiki-main.png'],
        liveActivity: [
            { id: 1, member: 'MEMBER #8***3', timeAgo: '8 minutes ago', timestamp: Date.now() - 480000, amount: '$528,000', amountNumber: 528000 },
            { id: 2, member: 'MEMBER #1***7', timeAgo: '24 minutes ago', timestamp: Date.now() - 1440000, amount: '$523,000', amountNumber: 523000 },
            { id: 3, member: 'MEMBER #4***9', timeAgo: '48 minutes ago', timestamp: Date.now() - 2880000, amount: '$518,000', amountNumber: 518000 },
        ],
        provenance: {
            title: 'The Harmony of Three Houses',
            description: 'Crafted by Chief Blender Shinji Fukuyo, this 35-Year-Old expression draws from Suntory\'s three distilleries to create a blend of supreme elegance. Each of the 35 facets on the bottle represents a season in Japanese whisky tradition.',
            timeline: [
                { period: '1986', detail: 'Youngest grain component distilled at Chita' },
                { period: '1978', detail: 'Oldest malt component distilled at Yamazaki' },
                { period: '2021', detail: 'Blended, bottled, and numbered at Suntory' },
                { period: '2021–PRESENT', detail: 'Private Collection, Hong Kong' },
            ]
        },
        authentication: 'Authenticated by Suntory Whisky. Each bottle is individually numbered and accompanied by a certificate signed by Chief Blender Shinji Fukuyo. The 35-facet crystal decanter is verified original.',
        conditionReport: {
            label: ['DECANTER', 'STOPPER', 'LABEL', 'OUTER CASE'],
            value: ['Perfect — original Suntory crystal', 'Original — secure and unchipped', 'Mint — gold foil and paper pristine', 'Near Mint — original gifting box'],
        }
    },
}

const DetailedWhiskyPage = () => {
    const { id } = useParams()
    const whisky = whiskyData.find(item => item.id === Number(id))
    const enrichment = whiskyEnrichments[Number(id)] || {}

    // Merge base data with enrichment
    const item = whisky ? { ...whisky, ...enrichment } : null

    // Tab State
    const [activeTab, setActiveTab] = useState('provenance')

    // Bidding States
    const [currentBid, setCurrentBid] = useState(item ? item.currentBidNumber : 0)
    const [bids, setBids] = useState(item ? (item.liveActivity || []) : [])
    const [biddersCount, setBiddersCount] = useState(item ? (item.activeBidders || 10) : 10)
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

    // Image gallery state
    const [mainImage, setMainImage] = useState(item ? item.image : '')

    // Modal / bid state
    const [showBidModal, setShowBidModal] = useState(false)
    const [customBidAmount, setCustomBidAmount] = useState(item ? (item.currentBidNumber + item.bidIncrement) : 0)
    const [bidError, setBidError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [modalAutoBid, setModalAutoBid] = useState(false)

    // Countdown timer
    const [timeLeft, setTimeLeft] = useState({
        days: item?.initialTime?.days || 0,
        hours: item?.initialTime?.hours || 4,
        minutes: item?.initialTime?.minutes || 18,
        seconds: item?.initialTime?.seconds || 40
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

    // Auto-bid simulation
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

    if (!item) {
        return (
            <div className="whisky-not-found">
                <div className="container text-center py-5">
                    <h2 className="error-title">Bottle Not Found</h2>
                    <p className="error-desc">The whisky listing you are looking for does not exist or has been archived.</p>
                    <Link to="/whiskyListings" className="back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        )
    }

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatNum = (num) => String(num).padStart(2, '0')

    const thumbnails = [item.image, ...(item.angles || [item.image])]

    const handlePlaceBidClick = () => {
        setCustomBidAmount(currentBid + item.bidIncrement)
        setBidError('')
        setShowBidModal(true)
    }

    const submitCustomBid = (e) => {
        e.preventDefault()
        const amt = Number(customBidAmount)
        const minRequired = currentBid + item.bidIncrement
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

    // Extract distillery and cask details from details array
    const distillery = item.details?.find(d => d.label === 'DISTILLERY')?.value || item.title
    const distilled  = item.details?.find(d => d.label === 'DISTILLED')?.value  || '—'
    const cask       = item.details?.find(d => d.label === 'CASK')?.value        || '—'
    const rarity     = item.details?.find(d => d.label === 'RARITY')?.value      || '—'

    return (
        <>
            <section className="detailed-page whisky-detailed-page">
                <div className="detailed-page__bg-overlay whisky-bg-overlay"></div>
                <div className="container detailed-page__container">

                    {/* Breadcrumb */}
                    <div className="detailed-page__breadcrumb">
                        <Link to="/whiskyListings" className="breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Cellar
                        </Link>
                    </div>

                    {/* Success Toast */}
                    {successMessage && (
                        <div className="bid-toast-notification">
                            <div className="toast-content">
                                <span className="toast-dot"></span>
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Two-Column Grid */}
                    <div className="detailed-page__grid">

                        {/* ── Left: Image Gallery & Info ─────────────────── */}
                        <div className="detailed-page__gallery-and-info">

                            {/* Main Image with Magnifier */}
                            <div
                                className="detailed-page__main-image-wrapper whisky-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={item.title} className="detailed-page__main-image whisky-main-image" />
                                <div className="detailed-page__image-glow"></div>
                                

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

                            {/* Whisky-specific metadata strip */}
                            <div className="whisky-meta-strip">
                                <div className="whisky-meta-item">
                                    <span className="whisky-meta-label">DISTILLERY</span>
                                    <span className="whisky-meta-value">{distillery}</span>
                                </div>
                                <div className="whisky-meta-divider" />
                                <div className="whisky-meta-item">
                                    <span className="whisky-meta-label">DISTILLED</span>
                                    <span className="whisky-meta-value">{distilled}</span>
                                </div>
                                <div className="whisky-meta-divider" />
                                <div className="whisky-meta-item">
                                    <span className="whisky-meta-label">CASK</span>
                                    <span className="whisky-meta-value">{cask}</span>
                                </div>
                                <div className="whisky-meta-divider" />
                                <div className="whisky-meta-item">
                                    <span className="whisky-meta-label">RARITY</span>
                                    <span className="whisky-meta-value">{rarity}</span>
                                </div>
                            </div>

                            {/* Detailed Description */}
                            <p className="detailed-page__description">
                                {item.detailedDescription || item.description}
                            </p>

                            {/* Thumbnails */}
                            <div className="detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`detailed-page__thumb-item ${mainImage === thumb ? 'detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => setMainImage(thumb)}
                                    >
                                        <img src={thumb} alt={`View ${idx + 1}`} className="detailed-page__thumb-img" />
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* ── Right: Bid Sidebar ──────────────────────────── */}
                        <div className="detailed-page__sidebar">
                            <div className="detailed-page__card">

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

                                <div className="sidebar-divider"></div>

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

                                <div className="sidebar-divider"></div>

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
                                <button className="detailed-page__place-bid-btn" onClick={handlePlaceBidClick}>
                                    PLACE BID
                                </button>

                                {/* Secondary Actions */}
                                <div className="detailed-page__action-row">
                                    <button
                                        className={`action-btn-secondary ${isAutoBidding ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
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

                                {/* Live Activity */}
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
                                                <div className="bid-amount-value">{bid.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* ── Tabs: Provenance / Authentication / Condition ─── */}
                    <div className="detailed-page__tabs-container">
                        <div className="detailed-page__tabs-header">
                            <button
                                className={`tab-link-btn ${activeTab === 'provenance' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('provenance')}
                            >
                                PROVENANCE
                                {activeTab === 'provenance' && <span className="tab-indicator"></span>}
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

                        <div className="detailed-page__tabs-content">

                            {/* Provenance Tab */}
                            {activeTab === 'provenance' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">{item.provenance?.title || 'Decades of Excellence'}</h3>
                                        <p className="tab-panel-text">
                                            {item.provenance?.description || item.description}
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

                            {/* Authentication Tab */}
                            {activeTab === 'auth' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Certified Authenticity</h3>
                                        <p className="tab-panel-text">
                                            {item.authentication || 'Every bottle is subjected to rigorous verification including label analysis, fill-level inspection, wax seal integrity checks, and cross-referencing with distillery records.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="auth-checks-list">
                                            {[
                                                'Distillery Archive Cross-Reference',
                                                'Wax Seal & Capsule Integrity Verified',
                                                'Label & Glass Provenance Confirmed',
                                                'Fill Level & Ullage Assessed',
                                                'Original Presentation Materials Intact',
                                            ].map((check) => (
                                                <div className="auth-check-item" key={check}>
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

                            {/* Condition Tab */}
                            {activeTab === 'condition' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Condition Assessment</h3>
                                        <p className="tab-panel-text">
                                            Each bottle is assessed across four key physical criteria by our in-house spirits specialists. The results below reflect the state of this lot at the time of cataloguing.
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="condition-grades-grid">
                                            {item.conditionReport?.label?.map((lbl, i) => (
                                                <div className="condition-grade-item" key={lbl}>
                                                    <span className="condition-lbl">{lbl}</span>
                                                    <span className="condition-val">{item.conditionReport.value[i]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* ── Bid Modal ───────────────────────────────────────────── */}
                {showBidModal && (
                    <div className="bid-modal-overlay fade-in-animation" onClick={(e) => { if (e.target === e.currentTarget) setShowBidModal(false) }}>
                        <div className="bid-modal-card">

                            <button className="close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
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
                                    <span className="modal-asset-label">CURRENT LOT</span>
                                    <p className="modal-asset-name">{item.title} <span>{item.reference}</span></p>
                                    <p className="modal-asset-lot">Lot #{String(item.id).padStart(3, '0')} · Distilled {distilled}</p>
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
                                        <span className="modal-bid-stat-value modal-bid-stat-value--gold">{formatCurrency(currentBid + item.bidIncrement)}</span>
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
                                            min={currentBid + item.bidIncrement}
                                            step={item.bidIncrement}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="modal-error-msg">{bidError}</p>}
                                </div>

                                <div className="modal-autobid-row">
                                    <div className="modal-autobid-text">
                                        <span className="modal-autobid-title">Auto Bid</span>
                                        <span className="modal-autobid-sub">OPLUENZA WILL BID UP TO YOUR LIMIT</span>
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

                {/* ── Recommended Whiskies ────────────────────────────────── */}
                <div className="container">
                    <div className="recommended-section">
                        <div className="recommended-header">
                            <div className="recommended-title-container">
                                <span className="recommended-subtitle">FROM THE CELLAR</span>
                                <h2 className="recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/whiskyListings" className="view-all-auctions-link">
                                VIEW ALL BOTTLES
                            </Link>
                        </div>
                        <div className="recommended-grid">
                            {whiskyData
                                .filter(w => w.id !== item.id)
                                .slice(0, 3)
                                .map(rec => (
                                    <Link to={`/whisky/${rec.id}`} key={rec.id} className="recommended-card-link">
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

export default DetailedWhiskyPage