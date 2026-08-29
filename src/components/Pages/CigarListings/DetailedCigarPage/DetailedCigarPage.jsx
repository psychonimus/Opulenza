import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import cigarData from '../../../../data/CigarData'
import './DetailedCigarPage.css'

/* ── Cigar-specific enrichments ─────────────────────────────── */
const cigarEnrichments = {
    1: {
        currentBidNumber: 58000,
        bidIncrement: 1000,
        activeBidders: 14,
        reserveMet: true,
        angles: ['/images/cigars/cohiba-behike/cohiba-behike-2.png', '/images/cigars/cohiba-behike/cohiba-behike-3.png'],
        detailedDescription: 'The Cohiba Behike BHK 56 represents the absolute pinnacle of Cuban cigar craftsmanship. Introduced in 2010 to mark Cohiba\'s 45th anniversary, the Behike line incorporates the ultra-rare medio tiempo leaf — a second pair of leaves found only on select plants — giving the cigar an incomparable depth of flavour and strength that is unmatched in the cigar world.',
        liveActivity: [
            { id: 1, member: 'MEMBER #7***3', timeAgo: '2 minutes ago', timestamp: Date.now() - 120000, amount: '$58,000', amountNumber: 58000 },
            { id: 2, member: 'MEMBER #2***9', timeAgo: '11 minutes ago', timestamp: Date.now() - 660000, amount: '$57,000', amountNumber: 57000 },
            { id: 3, member: 'MEMBER #5***1', timeAgo: '28 minutes ago', timestamp: Date.now() - 1680000, amount: '$56,000', amountNumber: 56000 },
        ],
        provenance: {
            title: 'The Crown Jewel of Cuba',
            description: 'Handcrafted in El Laguito, Havana — Cuba\'s most prestigious cigar factory — the Behike BHK 56 is rolled by torcedores of the highest classification. This box comes from an authenticated private European humidor maintained at constant 70% RH and 18°C since acquisition.',
            timeline: [
                { period: '2010', detail: 'Released for Cohiba\'s 45th Anniversary — only 4,000 boxes worldwide' },
                { period: '2010–2018', detail: 'Private European Collection, Switzerland' },
                { period: '2018–2024', detail: 'Climate-controlled humidor vault, London' },
                { period: '2024–PRESENT', detail: 'Opulenza Authenticated Custody' },
            ]
        },
        authentication: 'Authenticated by Habanos S.A. and verified by an independent master tobacconist. The box hologram, warranty card, and factory bands are all confirmed original. Accompanied by a full chain-of-custody certificate.',
        conditionReport: {
            label: ['WRAPPER', 'CONSTRUCTION', 'BOX SEAL', 'STORAGE'],
            value: ['Pristine — no blemishes or dry patches', 'Flawless — seamless double cap', 'Unbroken original Habanos hologram', 'Climate-controlled vault, 70% RH'],
        }
    },
    2: {
        currentBidNumber: 42000,
        bidIncrement: 750,
        activeBidders: 9,
        reserveMet: true,
        angles: [],
        detailedDescription: 'The Davidoff Oro Blanco is a cigar of singular rarity: a pearl-white, un-pressed, box-pressed torpedo hand-crafted from Dominican tobaccos aged for twelve or more years. Released once in 2012, only 300 boxes of 10 were made, each individually numbered and sold exclusively through Davidoff flagship boutiques.',
        liveActivity: [
            { id: 1, member: 'MEMBER #4***8', timeAgo: '5 minutes ago', timestamp: Date.now() - 300000, amount: '$42,000', amountNumber: 42000 },
            { id: 2, member: 'MEMBER #9***2', timeAgo: '19 minutes ago', timestamp: Date.now() - 1140000, amount: '$41,250', amountNumber: 41250 },
            { id: 3, member: 'MEMBER #1***6', timeAgo: '41 minutes ago', timestamp: Date.now() - 2460000, amount: '$40,500', amountNumber: 40500 },
        ],
        provenance: {
            title: 'One of 300 Boxes in Existence',
            description: 'This numbered box was purchased directly from Davidoff of Geneva\'s New York flagship store at launch. The tobaccos inside have been resting for over a decade in ideal conditions, reaching a peak of complexity that will endure for many years more.',
            timeline: [
                { period: '2000–2012', detail: 'Tobaccos aged in Dominican Republic curing barns' },
                { period: '2012', detail: 'Box No. 217 of 300 released — Davidoff New York' },
                { period: '2012–2024', detail: 'Private humidor, New York' },
                { period: '2024–PRESENT', detail: 'Opulenza Authenticated Custody' },
            ]
        },
        authentication: 'Authenticated by Davidoff of Geneva. Box number, hologram seal, and band typography confirmed original. Accompanied by original Davidoff purchase receipt and numbered certificate.',
        conditionReport: {
            label: ['WRAPPER', 'BANDS', 'BOX', 'HUMIDITY'],
            value: ['Pristine — creamy Connecticut shade', 'Mint — original silver-on-white', 'Near Mint — original cedar box, hinges intact', 'Stored at 65% RH / 16°C'],
        }
    },
    3: {
        currentBidNumber: 35000,
        bidIncrement: 500,
        activeBidders: 11,
        reserveMet: true,
        angles: [],
        detailedDescription: 'The Arturo Fuente OpusX Forbidden X is the most coveted cigar produced at the Fuente family\'s Château de la Fuente estate in the Dominican Republic. Utilising estate-grown Fuente Fuente OpusX wrapper leaf — the holy grail of Dominican tobacco — it delivers a rich, layered complexity that collectors pursue with extraordinary dedication.',
        liveActivity: [
            { id: 1, member: 'MEMBER #3***5', timeAgo: '7 minutes ago', timestamp: Date.now() - 420000, amount: '$35,000', amountNumber: 35000 },
            { id: 2, member: 'MEMBER #8***1', timeAgo: '22 minutes ago', timestamp: Date.now() - 1320000, amount: '$34,500', amountNumber: 34500 },
            { id: 3, member: 'MEMBER #6***7', timeAgo: '48 minutes ago', timestamp: Date.now() - 2880000, amount: '$34,000', amountNumber: 34000 },
        ],
        provenance: {
            title: 'Château de la Fuente — Estate Grown',
            description: 'The OpusX Forbidden X is a collectors\' edition released sporadically and exclusively through hand-picked retailers. This collection was acquired directly from an authorised Fuente Family retailer and has been stored in pristine condition since the day of purchase.',
            timeline: [
                { period: 'Estate', detail: 'Wrapper leaf grown and cured on Château de la Fuente' },
                { period: '2019', detail: 'Released — limited allocation, select retailers only' },
                { period: '2019–2024', detail: 'Private humidor, Miami' },
                { period: '2024–PRESENT', detail: 'Opulenza Authenticated Custody' },
            ]
        },
        authentication: 'Verified by an independent Fuente Family retailer. OpusX band hologram and box branding are confirmed authentic. Chain-of-custody documentation accompanies the lot.',
        conditionReport: {
            label: ['WRAPPER', 'DRAW', 'BOX SEAL', 'STORAGE'],
            value: ['Excellent — oily maduro-brown wrapper', 'Firm — ideal resting firmness', 'Original golden Fuente box seal intact', '70% RH / 18°C private cabinet'],
        }
    },
    4: {
        currentBidNumber: 28000,
        bidIncrement: 500,
        activeBidders: 7,
        reserveMet: false,
        angles: [],
        detailedDescription: 'The Montecristo A is the longest cigar ever produced by Cuba\'s most legendary brand — measuring a majestic 9.4 inches with a 47 ring gauge. Produced in strictly limited quantities, it is a ceremonial cigar: a slow, deliberate, multi-hour contemplation of the finest Vuelta Abajo tobacco. A collector\'s trophy and a connoisseur\'s challenge.',
        liveActivity: [
            { id: 1, member: 'MEMBER #2***4', timeAgo: '14 minutes ago', timestamp: Date.now() - 840000, amount: '$28,000', amountNumber: 28000 },
            { id: 2, member: 'MEMBER #7***9', timeAgo: '33 minutes ago', timestamp: Date.now() - 1980000, amount: '$27,500', amountNumber: 27500 },
            { id: 3, member: 'MEMBER #1***3', timeAgo: '58 minutes ago', timestamp: Date.now() - 3480000, amount: '$27,000', amountNumber: 27000 },
        ],
        provenance: {
            title: 'Cuba\'s Most Ceremonial Format',
            description: 'This box of Montecristo A was sourced through a verified LCDH (La Casa del Habano) retailer and maintained in a precision humidor since acquisition. The Montecristo A is one of the few remaining true gran corona formats still in production.',
            timeline: [
                { period: 'H. Upmann Factory', detail: 'Hand-rolled by master torcedores, Havana' },
                { period: '2017', detail: 'Sourced via authorised LCDH outlet, Geneva' },
                { period: '2017–2024', detail: 'Private collection humidor, Geneva' },
                { period: '2024–PRESENT', detail: 'Opulenza Authenticated Custody' },
            ]
        },
        authentication: 'Authenticated via Habanos S.A. warranty card and hologram verification. LCDH purchase receipt included. Independent master tobacconist inspection confirms originality of bands and construction.',
        conditionReport: {
            label: ['WRAPPER', 'CONSTRUCTION', 'BOX', 'HUMIDITY'],
            value: ['Very Good — minor age-related oil sheen', 'Excellent — firm, seamless construction', 'Near Mint — original cedar, one corner very slightly scuffed', '68% RH / 17°C'],
        }
    },
    5: {
        currentBidNumber: 24000,
        bidIncrement: 500,
        activeBidders: 8,
        reserveMet: true,
        angles: [],
        detailedDescription: 'The Padrón 1964 Anniversary Series Torpedo is a masterclass in Nicaraguan cigar craftsmanship. Introduced in 1994 to celebrate the family\'s 30th year in tobacco, the 1964 Series uses aged, sun-grown Nicaraguan tobacco presented in a natural or maduro wrapper. Consistently rated 95+ by major cigar publications, it is among the greatest value and quality propositions in the world of premium cigars.',
        liveActivity: [
            { id: 1, member: 'MEMBER #6***2', timeAgo: '9 minutes ago', timestamp: Date.now() - 540000, amount: '$24,000', amountNumber: 24000 },
            { id: 2, member: 'MEMBER #3***8', timeAgo: '26 minutes ago', timestamp: Date.now() - 1560000, amount: '$23,500', amountNumber: 23500 },
            { id: 3, member: 'MEMBER #9***4', timeAgo: '52 minutes ago', timestamp: Date.now() - 3120000, amount: '$23,000', amountNumber: 23000 },
        ],
        provenance: {
            title: '30 Years of Family Tradition',
            description: 'Jorge Padrón introduced the 1964 Anniversary Series in 1994 from the family\'s Jalapa and Estelí valley farms in Nicaragua. This box was sourced from a specialist importer and stored in a private humidity-controlled cabinet from day of acquisition.',
            timeline: [
                { period: '1964', detail: 'José Orlando Padrón founds Padrón Cigars' },
                { period: '1994', detail: '1964 Anniversary Series introduced — 30th anniversary' },
                { period: '2020', detail: 'This box acquired through specialist importer, London' },
                { period: '2020–PRESENT', detail: 'Private humidity-controlled storage' },
            ]
        },
        authentication: 'Box confirmed authentic via Padrón factory records. Band typography and box branding verified by an independent tobacconist. Full provenance documentation accompanies this lot.',
        conditionReport: {
            label: ['WRAPPER', 'CONSTRUCTION', 'BOX', 'BANDS'],
            value: ['Excellent — natural Colorado wrapper, subtle oils', 'Firm and even — flawless Torpedo formation', 'Near Mint — cedar box with intact ribbon tie', 'Mint — original gold-on-black print'],
        }
    },
    6: {
        currentBidNumber: 31000,
        bidIncrement: 500,
        activeBidders: 10,
        reserveMet: true,
        angles: [],
        detailedDescription: 'The Trinidad Fundadores is steeped in legend: originally produced exclusively for Fidel Castro to gift to foreign dignitaries and heads of state, it was not commercially available until 1998. The Laguito Especial format — long, slender, and elegant — delivers a refined Cuban smoke of extraordinary finesse. This lot represents a rare opportunity to acquire a box of immense historical and collectible significance.',
        liveActivity: [
            { id: 1, member: 'MEMBER #5***7', timeAgo: '4 minutes ago', timestamp: Date.now() - 240000, amount: '$31,000', amountNumber: 31000 },
            { id: 2, member: 'MEMBER #1***3', timeAgo: '17 minutes ago', timestamp: Date.now() - 1020000, amount: '$30,500', amountNumber: 30500 },
            { id: 3, member: 'MEMBER #8***6', timeAgo: '39 minutes ago', timestamp: Date.now() - 2340000, amount: '$30,000', amountNumber: 30000 },
        ],
        provenance: {
            title: 'Cigars of State — Originally Diplomatic Gifts',
            description: 'Trinidad Fundadores were the private diplomatic cigars of the Cuban state until their commercial release in 1998. This authenticated box was sourced from a private estate and comes with full documentation tracing its chain of custody from acquisition in Havana.',
            timeline: [
                { period: 'Pre-1998', detail: 'Produced exclusively for diplomatic use — El Laguito, Havana' },
                { period: '1998', detail: 'Commercial release authorised — Trinidad enters public market' },
                { period: '2005', detail: 'Box acquired through Havana authorised LCDH' },
                { period: '2005–PRESENT', detail: 'Single-ownership private humidor, Paris' },
            ]
        },
        authentication: 'Authenticated by Habanos S.A. Warranty card, box hologram, and band typography verified original. Accompanied by original LCDH purchase receipt and a signed letter of provenance from the original collector.',
        conditionReport: {
            label: ['WRAPPER', 'CONSTRUCTION', 'BOX SEAL', 'STORAGE'],
            value: ['Excellent — silky Colorado-claro wrapper', 'Pristine — seamless triple-seam foot', 'Original Habanos hologram unbroken', '70% RH / 18°C — single-owner humidor'],
        }
    },
}

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
                                    <p className="modal-asset-lot">Lot #{item.id ? String(item.id).padStart(3, '0') + String(Math.floor(Math.random() * 900) + 100) : '0061401'}</p>
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
                                            value={item.bidIncrement}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={currentBid + item.bidIncrement}
                                            step={item.bidIncrement}
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
