import React, { useEffect, useRef, useState } from 'react'
import './Contact.css'

const contactMethods = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="10" width="28" height="20" rx="2" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M6 12l14 10 14-10" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Private Correspondence',
        value: 'concierge@opluenza.com',
        note: 'For membership & acquisition inquiries',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8h5l2 6-3 2a18 18 0 008 8l2-3 6 2v5c0 1-1 2-2 2C14 30 8 14 8 10c0-1 1-2 2-2z" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Direct Line',
        value: '+41 22 000 0000',
        note: 'Geneva headquarters · Mon–Fri, 9am–6pm CET',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="18" r="6" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M20 24c-7 0-12 3-12 6h24c0-3-5-6-12-6z" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Personal Concierge',
        value: 'By Appointment',
        note: 'Private viewings available in Geneva, Singapore & London',
    },
]

const offices = [
    {
        city: 'Geneva',
        flag: '🇨🇭',
        address: '12 Rue de Rive, 1204 Geneva',
        role: 'Global Headquarters',
    },
    {
        city: 'Singapore',
        flag: '🇸🇬',
        address: 'One Raffles Quay, Level 27',
        role: 'Asia-Pacific Hub',
    },
    {
        city: 'London',
        flag: '🇬🇧',
        address: '10 Old Bond Street, Mayfair',
        role: 'European Liaison Office',
    },
]

const Contact = () => {
    const sectionRefs = useRef([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [focused, setFocused] = useState('')

    useEffect(() => {
        const observers = []
        sectionRefs.current.forEach((el) => {
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('contact-visible')
                        obs.unobserve(entry.target)
                    }
                },
                { threshold: 0.1 }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach((o) => o.disconnect())
    }, [])

    const addRef = (el) => {
        if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el)
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="contact-page">

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="contact-hero">
                <div className="contact-hero__overlay" />
                <div className="contact-hero__grid-pattern" />
                <div className="contact-hero__content">
                    <p className="contact-eyebrow-tag">GET IN TOUCH</p>
                    <h1 className="contact-hero__title">
                        We Value<br />
                        <span className="contact-gold-text">Every Conversation</span>
                    </h1>
                    <p className="contact-hero__subtitle">
                        Whether you are looking to acquire, consign, or simply learn more about
                        membership — our team of specialists is at your disposal.
                    </p>
                </div>
                <div className="contact-hero__scroll-hint">
                    <div className="contact-scroll-dot" />
                </div>
            </section>

            {/* ── Contact Methods ────────────────────────────────────── */}
            <section className="contact-methods-section" ref={addRef}>
                <div className="contact-container">
                    <div className="contact-methods-grid">
                        {contactMethods.map((m) => (
                            <div className="contact-method-card" key={m.label}>
                                <div className="contact-method-card__icon">{m.icon}</div>
                                <p className="contact-method-card__label">{m.label}</p>
                                <p className="contact-method-card__value">{m.value}</p>
                                <p className="contact-method-card__note">{m.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Form & Offices ─────────────────────────────────────── */}
            <section className="contact-main-section" ref={addRef}>
                <div className="contact-container contact-main-grid">

                    {/* Form */}
                    <div className="contact-form-wrapper">
                        <p className="contact-eyebrow-tag">SEND A MESSAGE</p>
                        <h2 className="contact-section-title">
                            Begin a <em>Private</em> Dialogue
                        </h2>

                        {submitted ? (
                            <div className="contact-success">
                                <div className="contact-success__icon">
                                    <svg viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="22" stroke="#d6a54d" strokeWidth="1.5" />
                                        <path d="M14 24l7 7 13-13" stroke="#d6a54d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="contact-success__title">Message Received</h3>
                                <p className="contact-success__sub">
                                    A member of our concierge team will respond within one business day.
                                    We appreciate your discretion.
                                </p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
                                <div className={`contact-field ${focused === 'name' || formData.name ? 'contact-field--active' : ''}`}>
                                    <label className="contact-field__label" htmlFor="contact-name">Full Name</label>
                                    <input
                                        id="contact-name"
                                        className="contact-field__input"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused('')}
                                        required
                                        autoComplete="off"
                                    />
                                    <div className="contact-field__bar" />
                                </div>

                                <div className={`contact-field ${focused === 'email' || formData.email ? 'contact-field--active' : ''}`}>
                                    <label className="contact-field__label" htmlFor="contact-email">Email Address</label>
                                    <input
                                        id="contact-email"
                                        className="contact-field__input"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        style={{ textTransform: 'lowercase' }}
                                        onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.value.toLowerCase() } })}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                        required
                                        autoComplete="off"
                                    />
                                    <div className="contact-field__bar" />
                                </div>

                                <div className={`contact-field ${focused === 'subject' || formData.subject ? 'contact-field--active' : ''}`}>
                                    <label className="contact-field__label" htmlFor="contact-subject">Subject</label>
                                    <select
                                        id="contact-subject"
                                        className="contact-field__input contact-field__select"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('subject')}
                                        onBlur={() => setFocused('')}
                                        required
                                    >
                                        <option value="" disabled hidden></option>
                                        <option value="membership">Membership Inquiry</option>
                                        <option value="acquisition">Acquisition Interest</option>
                                        <option value="consignment">Consignment Request</option>
                                        <option value="concierge">Concierge Services</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="contact-field__bar" />
                                </div>

                                <div className={`contact-field ${focused === 'message' || formData.message ? 'contact-field--active' : ''}`}>
                                    <label className="contact-field__label" htmlFor="contact-message">Message</label>
                                    <textarea
                                        id="contact-message"
                                        className="contact-field__input contact-field__textarea"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused('')}
                                        required
                                        rows={5}
                                    />
                                    <div className="contact-field__bar" />
                                </div>

                                <button type="submit" className="contact-submit-btn" id="contact-submit">
                                    <span>Send Message</span>
                                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Offices */}
                    <div className="contact-offices-wrapper">
                        <p className="contact-eyebrow-tag">OUR OFFICES</p>
                        <h2 className="contact-section-title">
                            Where to <em>Find Us</em>
                        </h2>
                        <div className="contact-offices-list">
                            {offices.map((o) => (
                                <div className="contact-office-card" key={o.city}>
                                    <div className="contact-office-card__header">
                                        <span className="contact-office-card__flag">{o.flag}</span>
                                        <div>
                                            <h3 className="contact-office-card__city">{o.city}</h3>
                                            <span className="contact-office-card__role">{o.role}</span>
                                        </div>
                                    </div>
                                    <p className="contact-office-card__address">{o.address}</p>
                                    <div className="contact-office-card__divider" />
                                </div>
                            ))}
                        </div>

                        {/* Decorative element */}
                        <div className="contact-globe-visual">
                            <div className="contact-globe">
                                <div className="contact-globe__ring contact-globe__ring--1" />
                                <div className="contact-globe__ring contact-globe__ring--2" />
                                <div className="contact-globe__ring contact-globe__ring--3" />
                                <div className="contact-globe__dot contact-globe__dot--geneva" title="Geneva" />
                                <div className="contact-globe__dot contact-globe__dot--singapore" title="Singapore" />
                                <div className="contact-globe__dot contact-globe__dot--london" title="London" />
                                <div className="contact-globe__glow" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── Privacy Note ────────────────────────────────────────── */}
            <section className="contact-privacy-section" ref={addRef}>
                <div className="contact-container">
                    <div className="contact-privacy-card">
                        <div className="contact-privacy-card__icon">
                            <svg viewBox="0 0 40 40" fill="none">
                                <path d="M20 5L8 10v10c0 7.18 5.16 13.9 12 15.5C27.84 33.9 32 27.18 32 20V10L20 5z" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 20l4 4 8-8" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="contact-privacy-card__title">Your Discretion is Guaranteed</h3>
                            <p className="contact-privacy-card__text">
                                All correspondence with Opluenza is held in the strictest confidence.
                                We never disclose client identities, inquiries, or transaction details
                                to third parties. Your privacy is not a policy — it is a promise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Contact
