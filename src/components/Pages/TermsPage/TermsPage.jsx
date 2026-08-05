import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './TermsPage.css'

// Inline SVG Icon Helpers
const IconShield = () => (
  <svg className="terms-principle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const IconLock = () => (
  <svg className="terms-principle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconAward = () => (
  <svg className="terms-principle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)

const IconUsers = () => (
  <svg className="terms-principle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconSparkles = () => (
  <svg className="terms-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
)

const IconFileText = () => (
  <svg className="terms-toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)

const IconChevronRight = () => (
  <svg className="terms-toc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconHelpCircle = () => (
  <svg className="terms-help-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconAlertCircle = () => (
  <svg className="terms-disclaimer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const IconCompass = () => (
  <svg className="terms-footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const PRINCIPLES = [
  {
    id: 'trust',
    title: 'Trust',
    desc: 'Every interaction should be honest, respectful and transparent.',
    icon: <IconShield />
  },
  {
    id: 'discretion',
    title: 'Discretion',
    desc: 'Privacy is paramount. What is shared within the community remains within the community.',
    icon: <IconLock />
  },
  {
    id: 'authenticity',
    title: 'Authenticity',
    desc: 'Members are expected to represent themselves and their collections truthfully.',
    icon: <IconAward />
  },
  {
    id: 'respect',
    title: 'Respect',
    desc: 'The Club exists to build lasting relationships among collectors, connoisseurs and enthusiasts.',
    icon: <IconUsers />
  }
]

const TERMS_SECTIONS = [
  {
    num: '01',
    id: 'membership-invitation',
    title: '1. Membership by Invitation',
    content: [
      "Opulenza Reserve is a private, invitation-only community. Membership is granted at the sole discretion of Opulenza Reserve and may be suspended or revoked if a member's conduct is inconsistent with the values of the Club.",
      "Members may nominate prospective members; however, all applications remain subject to the Club's review and approval. Membership is a privilege rather than an entitlement."
    ]
  },
  {
    num: '02',
    id: 'code-of-conduct',
    title: '2. Code of Conduct',
    content: [
      "Members are expected to conduct themselves with integrity, respect, discretion and professionalism.",
      "The Club reserves the right to remove any member whose actions may harm the reputation, trust or interests of the community.",
      "Every member is expected to uphold four core principles:"
    ],
    showPrinciples: true
  },
  {
    num: '03',
    id: 'privacy-confidentiality',
    title: '3. Privacy & Confidentiality',
    content: [
      "The identity, contact details, collections and activities of fellow members are confidential.",
      "Members shall not disclose information obtained through the Club without the express consent of the other member."
    ]
  },
  {
    num: '04',
    id: 'independent-transactions',
    title: '4. Independent Transactions',
    content: [
      "Opulenza Reserve facilitates introductions and connections between members.",
      "Any purchase, sale, exchange or barter is conducted directly between the participating members.",
      "Opulenza Reserve is not a party to such transactions unless it expressly provides an optional escrow, authentication or concierge service."
    ]
  },
  {
    num: '05',
    id: 'authenticity-guarantee',
    title: '5. Authenticity',
    content: [
      "Members are expected to accurately represent any item offered within the Club.",
      "Where authentication services are offered, they shall be subject to separate terms."
    ]
  },
  {
    num: '06',
    id: 'compliance-laws',
    title: '6. Compliance with Local Laws',
    content: [
      "Members are solely responsible for ensuring that any exchange of cigars or other collectible items complies with the laws and regulations of their country or jurisdiction.",
      "Opulenza Reserve does not facilitate transactions that violate applicable laws."
    ]
  },
  {
    num: '07',
    id: 'community-respect',
    title: '7. Respect for Community',
    content: [
      "The Club exists to foster meaningful relationships among collectors.",
      "Members shall not:"
    ],
    bullets: [
      "Spam or solicit other members",
      "Misrepresent products or collections",
      "Engage in abusive or fraudulent conduct",
      "Circumvent agreed Club processes where applicable"
    ]
  },
  {
    num: '08',
    id: 'membership-fees',
    title: '8. Membership Fees',
    content: [
      "Membership subscriptions are payable annually and are generally non-refundable unless otherwise determined by Opulenza Reserve."
    ]
  },
  {
    num: '09',
    id: 'club-events',
    title: '9. Events',
    content: [
      "Participation in Club events is voluntary and subject to availability.",
      "Members are responsible for complying with venue rules and applicable local regulations."
    ]
  },
  {
    num: '10',
    id: 'intellectual-property',
    title: '10. Intellectual Property',
    content: [
      "The Opulenza Reserve name, logo, branding and content remain the exclusive property of Opulenza Reserve.",
      "Members may not use the Club's intellectual property without written permission."
    ]
  },
  {
    num: '11',
    id: 'amendments',
    title: '11. Amendments',
    content: [
      "Opulenza Reserve may amend these Membership Terms from time to time. Members will be notified of any material changes."
    ]
  },
  {
    num: '12',
    id: 'governing-law',
    title: '12. Governing Law',
    content: [
      "These Membership Terms shall be governed by the laws of Singapore unless otherwise stated."
    ]
  },
  {
    num: '13',
    id: 'indemnification',
    title: '13. Indemnification',
    isImportant: true,
    content: [
      "Each Member agrees to indemnify and hold harmless Opulenza Reserve, its holding company, affiliates, directors, officers and employees against any claims, losses, liabilities, damages, costs or expenses (including reasonable legal fees) arising from:"
    ],
    bullets: [
      "any transaction or interaction with another member;",
      "any breach of these Membership Terms;",
      "any breach of applicable laws or regulations;",
      "any misrepresentation regarding goods, services or collectibles offered by the Member; or",
      "any misuse of the Platform or Club."
    ],
    disclaimer: "Opulenza Reserve makes no representation or warranty regarding the authenticity, provenance, condition, value or legality of any item exchanged between Members unless expressly certified through a Club-authorised authentication service."
  }
]

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="terms-page">
      {/* Background Glow Accents */}
      <div className="terms-bg-glow terms-bg-glow-1" />
      <div className="terms-bg-glow terms-bg-glow-2" />

      {/* Hero Section */}
      <section className="terms-hero">
        <div className="terms-container">
          <motion.div 
            className="terms-hero-badge"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <IconSparkles />
            <span>OPULENZA RESERVE PRIVATE CLUB</span>
          </motion.div>

          <motion.h1 
            className="terms-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Membership <span className="terms-gold-text">Terms & Conditions</span>
          </motion.h1>

          <motion.p 
            className="terms-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            General Rules, Conduct, and Privileges Governing the Opulenza Reserve Private Club
          </motion.p>

          <motion.div 
            className="terms-meta-bar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="terms-meta-item">
              <span className="terms-meta-label">Effective Date</span>
              <span className="terms-meta-value">August 2026</span>
            </div>
            <div className="terms-meta-divider" />
            <div className="terms-meta-item">
              <span className="terms-meta-label">Jurisdiction</span>
              <span className="terms-meta-value">Republic of Singapore</span>
            </div>
            <div className="terms-meta-divider" />
            <div className="terms-meta-item">
              <span className="terms-meta-label">Access</span>
              <span className="terms-meta-value">By Invitation Only</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="terms-body-section">
        <div className="terms-container">
          <div className="terms-grid">
            
            {/* Sidebar Table of Contents */}
            <motion.aside 
              className="terms-sidebar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="terms-toc-card">
                <div className="terms-toc-header">
                  <IconFileText />
                  <h4>Table of Contents</h4>
                </div>
                <nav className="terms-toc-nav">
                  {TERMS_SECTIONS.map((sec) => (
                    <a 
                      key={sec.id} 
                      href={`#${sec.id}`}
                      className="terms-toc-link"
                      onClick={(e) => {
                        e.preventDefault()
                        const el = document.getElementById(sec.id)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                    >
                      <span className="terms-toc-num">{sec.num}</span>
                      <span className="terms-toc-text">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                      <IconChevronRight />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Concierge Assistance Box */}
              <div className="terms-help-box">
                <IconHelpCircle />
                <h5>Have Questions?</h5>
                <p>Our dedicated Concierge team is available to assist members with terms, escrow, or membership inquiries.</p>
                <Link to="/concierge" className="terms-help-btn">
                  Contact Concierge
                </Link>
              </div>
            </motion.aside>

            {/* Main Terms Content */}
            <main className="terms-main-content">
              {TERMS_SECTIONS.map((sec, idx) => (
                <motion.article
                  key={sec.id}
                  id={sec.id}
                  className={`terms-card ${sec.isImportant ? 'terms-card--important' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                >
                  <div className="terms-card-header">
                    <span className="terms-section-num">{sec.num}</span>
                    <h3 className="terms-section-title">{sec.title}</h3>
                  </div>

                  <div className="terms-card-body">
                    {sec.content.map((pText, pIdx) => (
                      <p key={pIdx} className="terms-paragraph">{pText}</p>
                    ))}

                    {/* Code of Conduct 4 Principles Grid */}
                    {sec.showPrinciples && (
                      <div className="terms-principles-grid">
                        {PRINCIPLES.map((prin) => (
                          <div key={prin.id} className="terms-principle-card">
                            <div className="terms-principle-header">
                              {prin.icon}
                              <h4>{prin.title}</h4>
                            </div>
                            <p>{prin.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullet Points */}
                    {sec.bullets && (
                      <ul className="terms-bullets-list">
                        {sec.bullets.map((bText, bIdx) => (
                          <li key={bIdx}>
                            <span className="terms-bullet-dot" />
                            <span>{bText}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Disclaimer Box */}
                    {sec.disclaimer && (
                      <div className="terms-disclaimer-box">
                        <IconAlertCircle />
                        <p>{sec.disclaimer}</p>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}

              {/* Bottom CTA / Acceptance note */}
              <div className="terms-footer-note">
                <div className="terms-footer-note-content">
                  <IconCompass />
                  <div>
                    <h4>Commitment to Excellence</h4>
                    <p>By accessing or participating in the Opulenza Reserve Private Club, members confirm their understanding and agreement to adhere to these Membership Terms.</p>
                  </div>
                </div>
              </div>
            </main>

          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
