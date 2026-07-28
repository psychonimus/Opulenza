import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {inviteUser} from '../../../services/inviteService/InviteService'
import './ProfilePage.css'

// ── Helpers ──────────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)

const bids = [
  { id: 1, title: 'Patek Philippe Ref. 2499', image: '/images/pattek/pattek-phillipe.png', currentBid: '$2,840,000', yourBid: '$2,800,000', status: 'outbid', closes: '2d 4h', link: '/watch/1' },
  { id: 2, title: 'Vacheron Constantin 222', image: '/images/vacheron.jpg', currentBid: '$485,000', yourBid: '$485,000', status: 'leading', closes: '1d 12h', link: '/watch/4' },
  { id: 3, title: 'The Macallan 1926', image: '/images/whisky/macallan/macallan-main.png', currentBid: '$2,310,000', yourBid: '$2,200,000', status: 'outbid', closes: '6h 42m', link: '/whiskyListings' },
]

const watchlist = [
  { id: 4, title: 'Rolex Daytona 6239', image: '/images/rolex.jpg', estimate: '$240K – $280K', badge: 'LIVE', link: '/watch/2' },
  { id: 5, title: 'AP Royal Oak 15500OR', image: '/images/audemars.jpg', estimate: '$210K – $260K', badge: 'LIVE', link: '/watch/3' },
  { id: 6, title: 'The Dalmore 62-Year', image: '/images/whisky/dalmore/dalmore.png', estimate: '$1.2M – $1.6M', badge: 'UPCOMING', link: '/whiskyListings' },
]

const listings = [
  { id: 7, title: 'IWC Portugieser 7Day', status: 'Under Review', submittedOn: 'Jun 12, 2026', value: '$62,000' },
  { id: 8, title: 'Cohiba Behike Collection', status: 'Live', submittedOn: 'Jun 3, 2026', value: '$38,500' },
]

const TABS = ['My Bids', 'Watchlist', 'My Listings', 'Settings']

const StatusBadge = ({ status }) => {
  const map = { leading: 'Leading', outbid: 'Outbid', won: 'Won', expired: 'Expired' }
  return <span className={`prof-badge prof-badge--${status}`}>{map[status] || status}</span>
}

// ── Component ────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('My Bids')

  // ── Pull real user from localStorage ──────────────────
  const [member, setMember] = useState({
    name: '',
    memberId: '',
    tier: 'OBSIDIAN',
    since: '',
    avatar: null,
    email: '',
    location: '',
    totalBids: 0,
    activeBids: 0,
    wonAuctions: 0,
    portfolioValue: '—',
  })

  const raw = localStorage.getItem('user')

  useEffect(() => {
    try {
      
      if (!raw) return
      const u = JSON.parse(raw)
      // Map whatever fields the API returns — adjust key names to match your API response
      setMember(prev => ({
        ...prev,
        name:     u.role    || u.name        || u.userName   || prev.name,
        memberId: u.memberId    || u.id          || prev.memberId,
        email:    u.email       || prev.email,
        location: u.location    || u.city        || prev.location,
        tier:     u.tier        || u.memberType  || prev.tier,
        since:    u.memberSince || u.createdYear || prev.since,
      }))
    } catch (_) {
      // localStorage parse error — silently keep defaults
    }
  }, [])

  const initials = getInitials(member.name)

  // Invite states
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRemark, setInviteRemark] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleGenerateInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail) return

    const inviteObj = {
      email : inviteEmail,
      remark : inviteRemark
    }

    try{
      const res = await inviteUser(inviteObj);
    }
    catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invite failed. Please try again.'
      setError(msg)
    }

    // Generate a random code: e.g., OPU-INV-A7X9-B2K8
    
  }

  const handleCopyCode = () => {
    if (!generatedCode) return
    navigator.clipboard.writeText(generatedCode)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  const handleCloseModal = () => {
    setShowInviteModal(false)
    setInviteEmail('')
    setInviteName('')
    setInviteRelation('Collector')
    setGeneratedCode('')
    setCopyFeedback(false)
  }

  return (
    <div className="prof-page">
      {/* Background */}
      <div className="prof-bg" />

      <div className="prof-container">

        {/* ── Hero Banner ───────────────────────────── */}
        <div className="prof-hero">
          <div className="prof-hero__left">
            <div className="prof-avatar">
              {member.avatar
                ? <img src={member.avatar} alt={member.name} />
                : <span className="prof-avatar__initials">{initials}</span>
              }
              <span className="prof-avatar__status" title="Online" />
            </div>
            <div className="prof-hero__info">
              <div className="prof-hero__tier">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                {member.tier} MEMBER · SINCE {member.since}
              </div>
              <h1 className="prof-hero__name">{member.name}</h1>
              <p className="prof-hero__id">{member.memberId} · {member.location}</p>
            </div>
          </div>
          <div className="prof-hero__actions">
            <Link to="/sell" className="prof-btn prof-btn--gold">+ Submit Asset</Link>
            <button className="prof-btn prof-btn--ghost" onClick={() => setShowInviteModal(true)}>Invite a Friend</button>
            <button className="prof-btn prof-btn--ghost">Edit Profile</button>
            {
              JSON.parse(raw).role === "SuperAdmin" && <button className="prof-btn prof-btn--ghost" onClick={() => navigate('/admin')}>Dashboard</button>
            }
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────── */}
        <div className="prof-stats">
          {[
            { label: 'TOTAL BIDS', value: member.totalBids },
            { label: 'ACTIVE BIDS', value: member.activeBids },
            { label: 'AUCTIONS WON', value: member.wonAuctions },
            { label: 'PORTFOLIO VALUE', value: member.portfolioValue },
          ].map(s => (
            <div className="prof-stat" key={s.label}>
              <span className="prof-stat__value">{s.value}</span>
              <span className="prof-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Main Layout ───────────────────────────── */}
        <div className="prof-layout">

          {/* Tabs + Content */}
          <div className="prof-main">
            <div className="prof-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`prof-tab${activeTab === tab ? ' prof-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >{tab}</button>
              ))}
            </div>

            {/* My Bids */}
            {activeTab === 'My Bids' && (
              <div className="prof-panel">
                {bids.map(b => (
                  <Link to={b.link} key={b.id} className="prof-bid-row" style={{ textDecoration: 'none' }}>
                    <div className="prof-bid-img">
                      <img src={b.image} alt={b.title} />
                    </div>
                    <div className="prof-bid-info">
                      <p className="prof-bid-title">{b.title}</p>
                      <p className="prof-bid-meta">Closes in <span>{b.closes}</span></p>
                    </div>
                    <div className="prof-bid-amounts">
                      <div>
                        <span className="prof-small-label">YOUR BID</span>
                        <p className="prof-bid-num">{b.yourBid}</p>
                      </div>
                      <div>
                        <span className="prof-small-label">CURRENT</span>
                        <p className="prof-bid-num prof-bid-num--gold">{b.currentBid}</p>
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                ))}
              </div>
            )}

            {/* Watchlist */}
            {activeTab === 'Watchlist' && (
              <div className="prof-panel">
                <div className="prof-grid">
                  {watchlist.map(w => (
                    <Link to={w.link} key={w.id} className="prof-watch-card" style={{ textDecoration: 'none' }}>
                      <div className="prof-watch-card__img">
                        <img src={w.image} alt={w.title} />
                        <span className={`prof-watch-card__live${w.badge === 'LIVE' ? ' live' : ''}`}>{w.badge}</span>
                      </div>
                      <div className="prof-watch-card__body">
                        <p className="prof-watch-card__title">{w.title}</p>
                        <p className="prof-watch-card__est">{w.estimate}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* My Listings */}
            {activeTab === 'My Listings' && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>You have {listings.length} submitted asset{listings.length !== 1 ? 's' : ''}.</span>
                  <Link to="/sell" className="prof-btn prof-btn--gold" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '0.7rem' }}>+ Submit New</Link>
                </div>
                {listings.map(l => (
                  <div className="prof-listing-row" key={l.id}>
                    <div className="prof-listing-dot" data-status={l.status === 'Live' ? 'live' : 'review'} />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">{l.title}</p>
                      <p className="prof-listing-date">Submitted {l.submittedOn}</p>
                    </div>
                    <div className="prof-listing-right">
                      <span className={`prof-listing-status${l.status === 'Live' ? ' live' : ''}`}>{l.status}</span>
                      <span className="prof-listing-value">{l.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'Settings' && (
              <div className="prof-panel">
                <form className="prof-settings-form" onSubmit={e => e.preventDefault()}>
                  <div className="prof-settings-section">
                    <h3 className="prof-settings-heading">Account Details</h3>
                    <div className="prof-settings-grid">
                      <div className="prof-settings-field">
                        <label>Full Name</label>
                        <input type="text" defaultValue={member.name} />
                      </div>
                      <div className="prof-settings-field">
                        <label>Email</label>
                        <input type="email" defaultValue={member.email} />
                      </div>
                      <div className="prof-settings-field">
                        <label>Location</label>
                        <input type="text" defaultValue={member.location} />
                      </div>
                      <div className="prof-settings-field">
                        <label>Member ID</label>
                        <input type="text" defaultValue={member.memberId} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="prof-settings-section">
                    <h3 className="prof-settings-heading">Notifications</h3>
                    {['Outbid alerts', 'Auction closing reminders', 'New listings in watchlist', 'Weekly vault report'].map(n => (
                      <label className="prof-toggle-row" key={n}>
                        <span>{n}</span>
                        <input type="checkbox" defaultChecked className="prof-toggle-check" />
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="prof-btn prof-btn--gold" style={{ marginTop: '0.5rem' }}>Save Changes</button>
                </form>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="prof-sidebar">

            {/* Membership Card */}
            <div className="prof-member-card">
              <div className="prof-member-card__top">
                <span className="prof-member-card__eyebrow">OPLUENZA</span>
                <span className="prof-member-card__tier">{member.tier}</span>
              </div>
              <div className="prof-member-card__id">{member.memberId}</div>
              <div className="prof-member-card__name">{member.name}</div>
              <div className="prof-member-card__since">Member since {member.since}</div>
              <div className="prof-member-card__shine" />
            </div>

            {/* Quick Links */}
            <div className="prof-sidebar-box">
              <p className="prof-sidebar-box__title">Quick Links</p>
              <div className="prof-quick-links">
                {[
                  { label: 'Browse Watches', path: '/watchListing' },
                  { label: 'Browse Whisky', path: '/whiskyListings' },
                  { label: 'Concierge', path: '/concierge' },
                  { label: 'Sell an Asset', path: '/sell' },
                ].map(l => (
                  <Link key={l.label} to={l.path} className="prof-quick-link">{l.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>

      </div>

      {/* ── Invite a Friend Modal ────────────────────────────── */}
      {showInviteModal && (
        <div className="prof-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal() }}>
          <div className="prof-modal-card">
            <button className="prof-modal-close" onClick={handleCloseModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="prof-modal-header">
              <span className="prof-modal-eyebrow">OPULENZA MEMBERSHIP</span>
              <h2 className="prof-modal-title">Invite a Connoisseur</h2>
              <p className="prof-modal-desc">
                As an Opulenza member, you can nominate colleagues to receive priority membership review.
              </p>
            </div>

            {!generatedCode ? (
              <form onSubmit={handleGenerateInvite} className="prof-modal-form">
                <div className="prof-form-group">
                  {/* <label>Connoisseur's Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Baroness Von Stein"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  /> */}
                </div>

                <div className="prof-form-group">
                  <label>Connoisseur's Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., v.stein@private.court"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="prof-form-group">
                  <label>Remarks</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., v.stein@private.court"
                    value={inviteRemark}
                    onChange={(e) => setInviteRemark(e.target.value)}
                  />
                </div>

                {/* <div className="prof-form-group">
                  <label>Relationship / Association</label>
                  <select
                    value={inviteRelation}
                    onChange={(e) => setInviteRelation(e.target.value)}
                  >
                    <option value="Collector">Fellow Collector</option>
                    <option value="Business Partner">Business Associate</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Other">Other Executive</option>
                  </select>
                </div> */}

                <button type="submit" className="prof-btn prof-btn--gold prof-btn--block">
                  Generate Invitation Code
                </button>
              </form>
            ) : (
              <div className="prof-invite-success">
                <div className="prof-code-box">
                  <span className="prof-code-label">PERSONAL ACCREDITED KEY</span>
                  <div className="prof-code-display">{generatedCode}</div>
                </div>

                <p className="prof-invite-note">
                  This code is legally linked to your opulenza account. Copy this key and send it to {inviteName} so they can verify their credentials at registration.
                </p>

                <div className="prof-invite-actions">
                  <button onClick={handleCopyCode} className="prof-btn prof-btn--gold">
                    {copyFeedback ? 'Copied Key!' : 'Copy Invitation Key'}
                  </button>
                  <button onClick={handleCloseModal} className="prof-btn prof-btn--ghost">
                    Finish Nomination
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default ProfilePage
