import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const stats = [
    // { value: '2,400+', label: 'Timepieces Sold' },
    // { value: '$1.2B', label: 'Total Auction Value' },
    { value: '5', label: 'Countries Represented' },
    { value: '18+', label: 'Global HNI Users' },
]

const values = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="15" r="6" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M10 31c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M29 12a4.5 4.5 0 0 1 0 8" stroke="#d6a54d" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" />
                <path d="M11 12a4.5 4.5 0 0 0 0 8" stroke="#d6a54d" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" />
            </svg>
        ),
        title: 'Fewer People',
        desc: 'A strictly curated, invitation-only circle. Discretion and genuine exclusivity replace open-market noise and speculation.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="10" width="24" height="20" rx="3" stroke="#d6a54d" strokeWidth="1.5" />
                <circle cx="20" cy="18" r="3.5" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M20 21.5v3.5" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 6h12" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: 'Better Access',
        desc: 'Direct access to off-market archives, private cellars, museum-grade timepieces, and allocations before public reach.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="20" r="9" stroke="#d6a54d" strokeWidth="1.5" />
                <circle cx="25" cy="20" r="9" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M20 14.5a8.9 8.9 0 0 1 0 11" stroke="#f2c86c" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        title: 'Deeper Relationships',
        desc: 'Enduring partnerships built on trust, bespoke white-glove advisory, and shared passion rather than transactional exchanges.',
    },
]

const team = [
    {
        name: 'Élise Fontaine',
        role: 'Co-Founder & Head of Watches',
        bio: 'Former senior specialist at Geneva\'s foremost auction house, with 20 years dating rare Patek Philippe and early Rolex references.',
        initial: 'ÉF',
    },
    {
        name: 'James Hartwell',
        role: 'Co-Founder & Chief Curator',
        bio: 'Previously Head of Rare Collectibles at a major London auction house. Expert in pre-war complicated pocket watches and independent horology.',
        initial: 'JH',
    },
    {
        name: 'Takumi Nakashima',
        role: 'Director of Asian Markets',
        bio: 'Based between Tokyo and Singapore, Takumi brings unrivalled access to private collectors across Japan, Korea, and Southeast Asia.',
        initial: 'TN',
    },
]

const timeline = [
    { year: '2006', event: 'Founded in Geneva as a private advisory for a select circle of European collectors.' },
    { year: '2011', event: 'Opened our Singapore office, marking our entry into Asia\'s emerging ultra-luxury market.' },
    { year: '2016', event: 'Reached $500M in cumulative auction value. Invitation-only digital platform launched.' },
    { year: '2019', event: 'Established the Opluenza Certification Standard — now the benchmark for provenance verification.' },
    { year: '2024', event: 'Surpassed $1B in total auction value. Expanded to 94 countries with 3,200 vetted members.' },
]

const About = () => {
    const sectionRefs = useRef([])

    useEffect(() => {
        const observers = []
        sectionRefs.current.forEach((el) => {
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('about-visible')
                        obs.unobserve(entry.target)
                    }
                },
                { threshold: 0.12 }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach((o) => o.disconnect())
    }, [])

    const addRef = (el) => {
        if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el)
    }

    return (
        <div className="about-page">

            {/* ── Hero ────────────────────────────────────────────── */}
            <section className="about-hero">
                <div className="about-hero__overlay" />
                <div className="about-hero__content">

                    <h1 className="about-hero__title">
                        The Private Reserve for<br />
                        <span className="about-gold-text">Affluent Collectors</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        Private markets for rare assets remain fragmented. We are building the trust layer that connects them.
                    </p>
                    {/* <Link to="/watchListing" className="about-hero__cta">
                        Enter Private Access
                    </Link> */}
                </div>

            </section>

            {/* ── Stats ───────────────────────────────────────────── */}
            <section className="about-stats" ref={addRef}>
                {stats.map((s) => (
                    <div className="about-stat" key={s.label}>
                        <span className="about-stat__value">{s.value}</span>
                        <span className="about-stat__label">{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ── Mission ─────────────────────────────────────────── */}
            <section className="about-section about-mission" ref={addRef}>
                <div className="about-container about-mission__grid">
                    <div className="about-mission__text">
                        <div className="about-mission__eyebrow-wrap">
                            <span className="about-eyebrow-tag">OUR MISSION & PHILOSOPHY</span>
                        </div>
                        
                        <h2 className="about-section-title">
                            Where Rarity Meets<br />
                            <em>Uncompromising Standards</em>
                        </h2>
                        
                        <div className="about-mission__lead-card">
                            <div className="about-mission__lead-accent" />
                            <p className="about-mission__lead-text">
                                "Some things are not meant for the open market."
                            </p>
                        </div>

                        <p className="about-body-text about-mission__body">
                            <strong>Opulenza Reserve</strong> is a private, invitation-led sanctuary engineered for individuals who value rarity, impeccable provenance, strict discretion, and trusted relationships.
                        </p>
                        
                        <p className="about-body-text about-mission__body">
                            From exceptional cigars and rare whiskies to blue-chip watches and bespoke collectible assets, we unite a carefully curated global ecosystem of collectors, verified specialists, and authenticated sources.
                        </p>

                        {/* <div className="about-mission__categories">
                            <span className="about-category-pill">
                                <span className="about-category-pill__dot" />
                                Haute Horlogerie
                            </span>
                            <span className="about-category-pill">
                                <span className="about-category-pill__dot" />
                                Rare Spirits & Casks
                            </span>
                            <span className="about-category-pill">
                                <span className="about-category-pill__dot" />
                                Exceptional Cigars
                            </span>
                            <span className="about-category-pill">
                                <span className="about-category-pill__dot" />
                                Fine Writing Instruments
                            </span>
                            <span className="about-category-pill">
                                <span className="about-category-pill__dot" />
                                Curated Collectibles
                            </span>
                        </div> */}
                    </div>

                    <div className="about-mission__visual">
                        <div className="about-reserve-card">
                            <div className="about-reserve-card__glow" />
                            
                            {/* Central Emblem */}
                            <div className="about-reserve-emblem">
                                <div className="about-emblem-ring about-emblem-ring--outer" />
                                <div className="about-emblem-ring about-emblem-ring--middle" />
                                <div className="about-emblem-ring about-emblem-ring--inner" />
                                
                                <div className="about-emblem-core">
                                    
                                    <img src="/images/opulenza-logo.svg" width="100px" alt="opluenza-logo-text" />
                                </div>
                            </div>

                            {/* Trust Pillar Highlights */}
                            <div className="about-reserve-pillars">
                                <div className="about-reserve-pillar">
                                    <div className="about-pillar-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#d6a54d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                            <path d="M9 12l2 2 4-4"/>
                                        </svg>
                                    </div>
                                    <div className="about-pillar-info">
                                        <span className="about-pillar-title">Verified Provenance</span>
                                        <span className="about-pillar-desc">Multi-point specialist authenticity check</span>
                                    </div>
                                </div>

                                <div className="about-reserve-pillar">
                                    <div className="about-pillar-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#d6a54d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </div>
                                    <div className="about-pillar-info">
                                        <span className="about-pillar-title">Discreet Sanctuary</span>
                                        <span className="about-pillar-desc">Confidential HNI network & off-market deals</span>
                                    </div>
                                </div>

                                <div className="about-reserve-pillar">
                                    <div className="about-pillar-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#d6a54d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                    </div>
                                    <div className="about-pillar-info">
                                        <span className="about-pillar-title">White-Glove Custody</span>
                                        <span className="about-pillar-desc">Dedicated concierge from inquiry to delivery</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values / Philosophy ────────────────────────────── */}
            <section className="about-section about-values-section" ref={addRef}>
                <div className="about-container">
                    <p className="about-eyebrow-tag" style={{ textAlign: 'center' }}>OUR PHILOSOPHY</p>
                    <h2 className="about-section-title" style={{ textAlign: 'center' }}>
                        Fewer People. Better Access.<br />
                        <em>Deeper Relationships.</em>
                    </h2>
                    {/* <p className="about-values-sub" style={{ textAlign: 'center' }}>
                        Our philosophy is simple: fewer people, better access, deeper relationships.
                    </p> */}
                    <div className="about-values-grid">
                        {values.map((v) => (
                            <div className="about-value-card" key={v.title}>
                                <div className="about-value-card__icon">{v.icon}</div>
                                <h3 className="about-value-card__title">{v.title}</h3>
                                <p className="about-value-card__desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Timeline ────────────────────────────────────────── */}
            {/* <section className="about-section about-timeline-section" ref={addRef}>
                <div className="about-container">
                    <p className="about-eyebrow-tag" style={{ textAlign: 'center' }}>OUR HISTORY</p>
                    <h2 className="about-section-title" style={{ textAlign: 'center' }}>
                        Two Decades of Distinction
                    </h2>
                    <div className="about-timeline">
                        {timeline.map((t, i) => (
                            <div className={`about-timeline__item ${i % 2 === 0 ? 'about-timeline__item--left' : 'about-timeline__item--right'}`} key={t.year}>
                                <div className="about-timeline__card">
                                    <span className="about-timeline__year">{t.year}</span>
                                    <p className="about-timeline__event">{t.event}</p>
                                </div>
                                <div className="about-timeline__dot" />
                            </div>
                        ))}
                        <div className="about-timeline__line" />
                    </div>
                </div>
            </section> */}



            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="about-cta-section" ref={addRef}>
                <div className="about-cta__glow" />
                <div className="about-container about-cta__content">
                    <p className="about-eyebrow-tag" style={{ textAlign: 'center' }}>JOIN THE CIRCLE</p>
                    <h2 className="about-cta__title">
                        Ready to Acquire<br />
                        <span className="about-gold-text">Something Extraordinary?</span>
                    </h2>
                    <p className="about-cta__sub">
                        We are building Opulenza Reserve not as another marketplace, but as a private ecosystem for those who understand the value of what is rare and the importance of who you acquire it from.
                    </p>
                    <div className="about-cta__buttons">
                        {/* <Link to="/watchListing" className="about-btn about-btn--gold">
                            Enter Private Access
                        </Link> */}

                    </div>
                </div>
            </section>

        </div>
    )
}

export default About