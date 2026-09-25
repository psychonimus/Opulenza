import React, { useEffect, useRef, useState } from 'react'
import './Contact.css'
import { ContactForm } from '../../../services/contact/ContactForm';

const contactMethods = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="10" width="28" height="20" rx="2" stroke="#d6a54d" strokeWidth="1.5" />
                <path d="M6 12l14 10 14-10" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Private Correspondence',
        value: 'concierge@opluenza.com',
        href: 'mailto:concierge@opluenza.com',
        note: 'For membership & acquisition inquiries',
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 8h5l2 6-3 2a18 18 0 008 8l2-3 6 2v5c0 1-1 2-2 2C14 30 8 14 8 10c0-1 1-2 2-2z" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: 'Direct Line',
        value: '+65 8369 1023',
        href: 'tel:+6583691023',
        note: 'Singapore headquarters',
    },
    // {
    //     icon: (
    //         <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    //             <circle cx="20" cy="18" r="6" stroke="#d6a54d" strokeWidth="1.5" />
    //             <path d="M20 24c-7 0-12 3-12 6h24c0-3-5-6-12-6z" stroke="#d6a54d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    //         </svg>
    //     ),
    //     label: 'Personal Concierge',
    //     value: 'By Appointment',
    //     note: 'Private viewings available in Geneva, Singapore & London',
    // },
]

const offices = [
    {
        city: 'Singapore',
        address: 'Opulenza Reserve Pte Ltd Robinson Rd, Singapore',
        role: 'Headquarters',
    }
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
        if (typeof IntersectionObserver !== 'undefined') {
            sectionRefs.current.forEach((el) => {
                if (!el) return
                const obs = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('contact-visible')
                            obs.unobserve(entry.target)
                        }
                    },
                    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
                )
                obs.observe(el)
                observers.push(obs)
            })
        } else {
            sectionRefs.current.forEach((el) => {
                if (el) el.classList.add('contact-visible')
            })
        }
        return () => observers.forEach((o) => o.disconnect())
    }, [])

    const addRef = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        ContactForm(formData)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })
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
                        We Value <br className="contact-hero__br" />
                        <span className="contact-gold-text">Every Conversation</span>
                    </h1>
                    <p className="contact-hero__subtitle">
                        Whether you are looking to acquire, consign, or simply learn more about
                        membership, our team of specialists is at your disposal.
                    </p>
                </div>
                <div className="contact-hero__scroll-hint" aria-hidden="true">
                    <div className="contact-scroll-dot" />
                </div>
            </section>

            {/* ── Contact Methods ────────────────────────────────────── */}
            <section className="contact-methods-section" ref={addRef}>
                <div className="contact-container">
                    <div className="contact-methods-grid">
                        {contactMethods.map((m) => {
                            const CardWrapper = m.href ? 'a' : 'div'
                            const cardProps = m.href
                                ? {
                                      href: m.href,
                                      className: 'contact-method-card contact-method-card--link',
                                      target: m.href.startsWith('mailto') || m.href.startsWith('tel') ? undefined : '_blank',
                                      rel: 'noopener noreferrer'
                                  }
                                : { className: 'contact-method-card' }

                            return (
                                <CardWrapper key={m.label} {...cardProps}>
                                    <div className="contact-method-card__icon">{m.icon}</div>
                                    <p className="contact-method-card__label">{m.label}</p>
                                    <p className="contact-method-card__value">{m.value}</p>
                                    <p className="contact-method-card__note">{m.note}</p>
                                </CardWrapper>
                            )
                        })}
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
                            <div className="contact-success" role="status" aria-live="polite">
                                <div className="contact-success__icon">
                                    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                                        <circle cx="24" cy="24" r="22" stroke="#d6a54d" strokeWidth="1.5" />
                                        <path d="M14 24l7 7 13-13" stroke="#d6a54d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="contact-success__title">Message Received</h3>
                                <p className="contact-success__sub">
                                    A member of our concierge team will respond within one business day.
                                    We appreciate your discretion.
                                </p>
                                <button
                                    type="button"
                                    className="contact-submit-btn"
                                    onClick={() => {
                                        setSubmitted(false)
                                        setFormData({ name: '', email: '', subject: '', message: '' })
                                    }}
                                >
                                    <span>Send Another Message</span>
                                </button>
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
                                        autoComplete="name"
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
                                        onChange={(e) => handleChange({ ...e, target: { ...e.target, value: e.target.value.toLowerCase(), name: 'email' } })}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                        required
                                        autoComplete="email"
                                    />
                                    <div className="contact-field__bar" />
                                </div>

                                <div className={`contact-field contact-field--select-wrapper ${focused === 'subject' || formData.subject ? 'contact-field--active' : ''}`}>
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
                                    <div className="contact-field__select-arrow" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
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
                                        rows={4}
                                    />
                                    <div className="contact-field__bar" />
                                </div>

                                <button type="submit" className="contact-submit-btn" id="contact-submit">
                                    <span>Send Message</span>
                                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
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
                    </div>

                </div>
            </section>

        </div>
    )
}

export default Contact
