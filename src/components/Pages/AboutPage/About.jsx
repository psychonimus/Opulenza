import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const stats = [
    { value: '2,400+', label: 'Timepieces Sold' },
    { value: '$1.2B', label: 'Total Auction Value' },
    { value: '94', label: 'Countries Represented' },
    { value: '18', label: 'Years of Excellence' },
]

const values = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M20 10v10l6 4" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: 'Provenance First',
        desc: 'Every lot we present carries a verified chain of ownership. We reject anything we cannot fully authenticate.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="24" height="24" rx="3" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M14 20l4 4 8-8" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Absolute Discretion',
        desc: 'Buyer and consignor identities are protected at every stage. Membership is by invitation only.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="20,6 24,16 35,16 26,23 29,34 20,27 11,34 14,23 5,16 16,16" stroke="#d6a54d" strokeWidth="1.5" fill="none" />
            </svg>
        ),
        title: 'Curatorial Rigour',
        desc: 'Our specialists review every submission against global auction records, archives, and reference libraries before acceptance.',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="14" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M20 14v6l4 2" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 20h4M28 20h4M20 8v4M20 28v4" stroke="#d6a54d" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
        title: 'White-Glove Service',
        desc: 'From inspection to delivery, a dedicated concierge accompanies each acquisition from first inquiry to vault.',
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
                    <p className="about-hero__eyebrow">
                        <span className="about-eyebrow-line" />
                        EST. 2006 · GENEVA
                        <span className="about-eyebrow-line" />
                    </p>
                    <h1 className="about-hero__title">
                        The Art of<br />
                        <span className="about-gold-text">Rare Acquisition</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        Opluenza is the world's most discreet destination for exceptional timepieces —
                        built by collectors, for collectors.
                    </p>
                    <Link to="/watchListing" className="about-hero__cta">
                        Explore Current Auctions
                    </Link>
                </div>
                <div className="about-hero__scroll-hint">
                    <div className="about-scroll-dot" />
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
                        <p className="about-eyebrow-tag">OUR MISSION</p>
                        <h2 className="about-section-title">
                            Where Rarity Meets<br />
                            <em>Uncompromising Standards</em>
                        </h2>
                        <p className="about-body-text">
                            We founded Opluenza on a single conviction: that the rarest horological
                            objects deserve a platform worthy of their significance. That means no
                            compromises on authentication, no shortcuts on provenance, and no tolerance
                            for ambiguity.
                        </p>
                        <p className="about-body-text">
                            Every watch offered through our platform passes a twelve-point evaluation
                            conducted by our in-house specialists, cross-referenced with brand archives,
                            independent experts, and international auction records. If we are not
                            certain, we do not list.
                        </p>
                        <div className="about-mission__divider" />
                        <blockquote className="about-quote">
                            "We do not simply sell watches. We steward legacies."
                            <cite>— Élise Fontaine, Co-Founder</cite>
                        </blockquote>
                    </div>
                    <div className="about-mission__visual">
                        <div className="about-watch-frame">
                            <div className="about-watch-dial">
                                <div className="about-watch-ring" />
                                <div className="about-watch-inner" />
                                <div className="about-watch-hand about-watch-hand--hour" />
                                <div className="about-watch-hand about-watch-hand--minute" />
                                <div className="about-watch-center" />
                            </div>
                            <div className="about-watch-glow" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ──────────────────────────────────────────── */}
            <section className="about-section about-values-section" ref={addRef}>
                <div className="about-container">
                    <p className="about-eyebrow-tag" style={{ textAlign: 'center' }}>OUR PRINCIPLES</p>
                    <h2 className="about-section-title" style={{ textAlign: 'center' }}>
                        What We Stand For
                    </h2>
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
            <section className="about-section about-timeline-section" ref={addRef}>
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
            </section>

            {/* ── Team ────────────────────────────────────────────── */}
            <section className="about-section about-team-section" ref={addRef}>
                <div className="about-container">
                    <p className="about-eyebrow-tag" style={{ textAlign: 'center' }}>THE PEOPLE</p>
                    <h2 className="about-section-title" style={{ textAlign: 'center' }}>
                        Our Founding Specialists
                    </h2>
                    <div className="about-team-grid">
                        {team.map((m) => (
                            <div className="about-team-card" key={m.name}>
                                <div className="about-team-card__avatar">
                                    <span>{m.initial}</span>
                                    <div className="about-avatar-ring" />
                                </div>
                                <h3 className="about-team-card__name">{m.name}</h3>
                                <span className="about-team-card__role">{m.role}</span>
                                <p className="about-team-card__bio">{m.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                        Membership to Opluenza is extended by invitation. If you believe you qualify,
                        our concierge team would be pleased to hear from you.
                    </p>
                    <div className="about-cta__buttons">
                        <Link to="/watchListing" className="about-btn about-btn--gold">
                            View Current Auctions
                        </Link>
                        <Link to="/concierge" className="about-btn about-btn--outline">
                            Request Membership
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default About