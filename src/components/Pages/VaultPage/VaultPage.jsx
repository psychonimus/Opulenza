import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './VaultPage.css'

// Mock initial data for Vault
const INITIAL_ACTIVE_BIDS = [
  {
    id: 'w1',
    category: 'WATCHES',
    title: 'Patek Philippe',
    reference: 'Ref. 2499, First Series',
    image: '/images/pattek/pattek-phillipe.png',
    userBid: 2840000,
    currentHighBid: 2840000,
    timeLeft: { hours: 2, minutes: 14, seconds: 33 },
    link: '/watch/1'
  },
  {
    id: 'c1',
    category: 'CIGARS',
    title: 'Cohiba',
    reference: 'Behike BHK 56',
    image: '/images/cigars/cohiba/cohiba-main.png',
    userBid: 4200,
    currentHighBid: 4800,
    timeLeft: { hours: 8, minutes: 4, seconds: 12 },
    link: '/cigar/1'
  }
]

const INITIAL_SECURED_ASSETS = [
  {
    id: 'p1',
    category: 'WRITING INSTRUMENTS',
    title: 'Montblanc',
    reference: '149 Masterpiece — 18K Solid Gold',
    image: '/images/pens/montblanc/montblanc-main.png',
    purchasePrice: 28000,
    securedDate: 'June 18, 2026',
    vaultLocation: 'Zurich Vault — Box #904',
    certificateId: 'OP-MB-9048-A',
    link: '/pen/1'
  },
  {
    id: 'wh1',
    category: 'FINE SPIRITS',
    title: 'The Macallan',
    reference: 'Fine & Rare 1926',
    image: '/images/whisky/macallan/macallan-main.png',
    purchasePrice: 1250000,
    securedDate: 'May 04, 2026',
    vaultLocation: 'London City Vaults — Box #12',
    certificateId: 'OP-MC-1926-Z',
    link: '/whisky/1'
  }
]

const INITIAL_CART_ITEMS = [
  {
    id: 'srv1',
    category: 'SERVICES',
    title: 'Opulenza VIP Concierge',
    reference: 'Annual Elite Membership',
    image: '/images/gold-card-bg.png', // Fallback or luxury graphics
    price: 25000,
    quantity: 1,
    description: '24/7 dedicated broker service, complimentary armored transport, and private viewing access.'
  },
  {
    id: 'srv2',
    category: 'SECURED TRANSPORT',
    title: 'Global Armored Delivery',
    reference: 'Fully Insured Transit Class-1',
    image: '/images/armored-van.png', // Fallback or luxury graphics
    price: 5000,
    quantity: 1,
    description: 'Diplomatic courier service with complete temperature and humidity control.'
  }
]

const INITIAL_WATCHLIST = [
  {
    id: 'y2',
    category: 'YACHTS',
    title: 'Feadship',
    reference: 'Syzygy — 81.5m',
    image: '/images/yachts/syzygy/syzygy-main.png',
    currentBid: 92000000,
    timeLeft: { hours: 14, minutes: 48, seconds: 50 },
    link: '/yacht/2'
  },
  {
    id: 'pen5',
    category: 'WRITING INSTRUMENTS',
    title: 'Pelikan',
    reference: 'Souverän M1000',
    image: '/images/pens/pelican/pelican-main.png',
    currentBid: 22000,
    timeLeft: { hours: 10, minutes: 17, seconds: 5 },
    link: '/pen/5'
  }
]

const VaultPage = () => {
  const [activeTab, setActiveTab] = useState('bids') // 'bids' | 'secured' | 'cart' | 'watchlist'
  
  // State lists
  const [activeBids, setActiveBids] = useState(INITIAL_ACTIVE_BIDS)
  const [securedAssets, setSecuredAssets] = useState(INITIAL_SECURED_ASSETS)
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST)

  // Payment State
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  // Countdown logic for active bids & watchlist items
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick active bids
      setActiveBids(prev =>
        prev.map(item => {
          let s = item.timeLeft.seconds - 1
          let m = item.timeLeft.minutes
          let h = item.timeLeft.hours
          if (s < 0) { s = 59; m -= 1 }
          if (m < 0) { m = 59; h -= 1 }
          if (h < 0) { h = 0; m = 0; s = 0 }
          return { ...item, timeLeft: { hours: h, minutes: m, seconds: s } }
        })
      )
      // Tick watchlist
      setWatchlist(prev =>
        prev.map(item => {
          let s = item.timeLeft.seconds - 1
          let m = item.timeLeft.minutes
          let h = item.timeLeft.hours
          if (s < 0) { s = 59; m -= 1 }
          if (m < 0) { m = 59; h -= 1 }
          if (h < 0) { h = 0; m = 0; s = 0 }
          return { ...item, timeLeft: { hours: h, minutes: m, seconds: s } }
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

  const formatTime = (time) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`
  }

  // Remove from watchlist
  const handleRemoveWatchlist = (id) => {
    setWatchlist(prev => prev.filter(item => item.id !== id))
  }

  // Remove from cart
  const handleRemoveCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Edit quantity in cart
  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item))
  }

  // Apply promo code (VIP client service)
  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (promoCode.toUpperCase() === 'OPULENCEVIP') {
      setDiscount(5000) // $5k off concierge package
      alert('Promo Code Applied: $5,000 Special Client Credit.')
    } else {
      alert('Invalid VIP Credentials Code.')
    }
  }

  // Totals calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const buyerPremium = subtotal * 0.10 // 10% premium for auctions/lux items
  const insurance = subtotal > 0 ? 1200 : 0
  const finalTotal = subtotal + buyerPremium + insurance - discount

  // Simulate payment flow
  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      // Add cart items to secured assets list
      const newlySecured = cartItems.map(item => ({
        id: `won-${item.id}-${Date.now()}`,
        category: item.category,
        title: item.title,
        reference: item.reference,
        image: item.image,
        purchasePrice: item.price * item.quantity,
        securedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        vaultLocation: 'Custodial Escrow Account',
        certificateId: `OP-ACQ-${Math.floor(Math.random() * 90000) + 10000}-X`,
        link: '#'
      }))

      setSecuredAssets(prev => [...newlySecured, ...prev])
      setCartItems([])
      setIsCheckingOut(false)
      setPaymentSuccess(true)
      setActiveTab('secured')
      setTimeout(() => setPaymentSuccess(false), 5000)
    }, 2000)
  }

  return (
    <div className="vault-page">
      <div className="vault-page__bg-overlay" />
      <div className="container vault-page__container">

        {/* Header Section */}
        <div className="vault-header">
          <div className="vault-header__title-block">
            <span className="vault-subtitle">OPULENZA ASSET PORTFOLIO</span>
            <h1 className="vault-title">The Vault</h1>
          </div>
          <div className="vault-header__meta">
            <div className="vault-meta-badge">
              <span className="vault-dot" />
              SECURE DEPOSIT ACTIVE
            </div>
            <p className="vault-user-signature">CLIENT DOSSIER: #OP-88240-X</p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="vault-tabs">
          <button
            className={`vault-tab-btn ${activeTab === 'bids' ? 'vault-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('bids')}
          >
            ACTIVE BIDS ({activeBids.length})
            {activeTab === 'bids' && <span className="vault-tab-indicator" />}
          </button>
          <button
            className={`vault-tab-btn ${activeTab === 'secured' ? 'vault-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('secured')}
          >
            SECURED ASSETS ({securedAssets.length})
            {activeTab === 'secured' && <span className="vault-tab-indicator" />}
          </button>
          
          <button
            className={`vault-tab-btn ${activeTab === 'watchlist' ? 'vault-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            WATCHLIST ({watchlist.length})
            {activeTab === 'watchlist' && <span className="vault-tab-indicator" />}
          </button>
        </div>

        {/* Toast success */}
        {paymentSuccess && (
          <div className="vault-success-toast">
            <div className="vault-success-content">
              <svg className="vault-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <h4>Acquisition Confirmed</h4>
                <p>Assets successfully wired & locked in your private vault.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Content Panes ────────────────────────────────────────── */}
        <div className="vault-content">

          {/* 1. Active Bids Tab */}
          {activeTab === 'bids' && (
            <div className="vault-panel-grid fade-in-animation">
              {activeBids.length === 0 ? (
                <div className="vault-empty-state">
                  <p>You have no active auction bids at this moment.</p>
                  <Link to="/bidPage" className="vault-explore-btn">EXPLORE ACTIVE AUCTIONS</Link>
                </div>
              ) : (
                <div className="vault-items-list">
                  {activeBids.map(item => {
                    const isWinning = item.userBid >= item.currentHighBid
                    return (
                      <div className="vault-item-card" key={item.id}>
                        <div className="vault-item-card__image">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="vault-item-card__details">
                          <span className="vault-item-cat">{item.category}</span>
                          <h3 className="vault-item-title">{item.title} <span className="vault-item-ref">{item.reference}</span></h3>
                          <div className="vault-item-specs">
                            <div>
                              <span className="vault-spec-label">YOUR BID</span>
                              <span className="vault-spec-val">{formatCurrency(item.userBid)}</span>
                            </div>
                            <div>
                              <span className="vault-spec-label">CURRENT HIGH</span>
                              <span className="vault-spec-val">{formatCurrency(item.currentHighBid)}</span>
                            </div>
                            <div>
                              <span className="vault-spec-label">CLOSES IN</span>
                              <span className="vault-spec-val vault-spec-val--timer">{formatTime(item.timeLeft)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="vault-item-card__action-zone">
                          <span className={`vault-bid-status-badge ${isWinning ? 'winning' : 'outbid'}`}>
                            {isWinning ? 'WINNING' : 'OUTBID'}
                          </span>
                          <Link to={item.link} className="vault-action-btn">
                            {isWinning ? 'VIEW ITEM' : 'RAISE BID'}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. Secured Assets Tab */}
          {activeTab === 'secured' && (
            <div className="vault-panel-grid fade-in-animation">
              {securedAssets.length === 0 ? (
                <div className="vault-empty-state">
                  <p>No verified assets are registered in your vault portfolio yet.</p>
                  <Link to="/bidPage" className="vault-explore-btn">ACQUIRE ASSETS</Link>
                </div>
              ) : (
                <div className="vault-items-list">
                  {securedAssets.map(item => (
                    <div className="vault-item-card vault-item-card--secured" key={item.id}>
                      <div className="vault-item-card__image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="vault-item-card__details">
                        <span className="vault-item-cat">{item.category}</span>
                        <h3 className="vault-item-title">{item.title} <span className="vault-item-ref">{item.reference}</span></h3>
                        <div className="vault-item-specs">
                          <div>
                            <span className="vault-spec-label">ACQUISITION PRICE</span>
                            <span className="vault-spec-val vault-spec-val--gold">{formatCurrency(item.purchasePrice)}</span>
                          </div>
                          <div>
                            <span className="vault-spec-label">VAULT STATUS</span>
                            <span className="vault-spec-val">{item.vaultLocation}</span>
                          </div>
                          <div>
                            <span className="vault-spec-label">SECURED DATE</span>
                            <span className="vault-spec-val">{item.securedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="vault-item-card__action-zone">
                        <div className="vault-cert-block">
                          <span className="vault-spec-label">CERTIFICATE ID</span>
                          <span className="vault-cert-id">{item.certificateId}</span>
                        </div>
                        <button className="vault-action-btn vault-action-btn--outline" onClick={() => alert(`Certificate ${item.certificateId} details dispatched to email.`)}>
                          DOWNLOAD CERTIFICATE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          

          {/* 4. Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div className="vault-panel-grid fade-in-animation">
              {watchlist.length === 0 ? (
                <div className="vault-empty-state">
                  <p>Your watchlist is currently empty.</p>
                  <Link to="/bidPage" className="vault-explore-btn">EXPLORE ACTIVE LOTS</Link>
                </div>
              ) : (
                <div className="vault-items-list">
                  {watchlist.map(item => (
                    <div className="vault-item-card" key={item.id}>
                      <div className="vault-item-card__image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="vault-item-card__details">
                        <span className="vault-item-cat">{item.category}</span>
                        <h3 className="vault-item-title">{item.title} <span className="vault-item-ref">{item.reference}</span></h3>
                        <div className="vault-item-specs">
                          <div>
                            <span className="vault-spec-label">CURRENT BID</span>
                            <span className="vault-spec-val">{formatCurrency(item.currentBid)}</span>
                          </div>
                          <div>
                            <span className="vault-spec-label">TIME REMAINING</span>
                            <span className="vault-spec-val vault-spec-val--timer">{formatTime(item.timeLeft)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="vault-item-card__action-zone">
                        <button className="vault-cart-remove-btn" style={{ marginBottom: '10px' }} onClick={() => handleRemoveWatchlist(item.id)}>
                          UNWATCH
                        </button>
                        <Link to={item.link} className="vault-action-btn">
                          PLACE A BID
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default VaultPage
