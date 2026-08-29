import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import '../TermsPage/TermsPage.css' // Reuses terms page styles for aesthetic consistency

// Inline SVG Icon Helpers
const IconShield = () => (
  <svg className="terms-principle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
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

const IconCompass = () => (
  <svg className="terms-compass-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

const IconSparkles = () => (
  <svg className="terms-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  </svg>
)

const POLICY_SECTIONS = [
  {
    num: "1",
    id: "privacy-principle",
    title: "1. Our Privacy Principle",
    content: [
      "Opulenza Reserve follows a principle of data minimisation and discretion.",
      "Unlike many digital marketplaces, Opulenza Reserve is designed not to require extensive personal profiles or unnecessary personal information.",
      "In particular:"
    ],
    bullets: [
      "We do not require a member’s full residential address for ordinary use of the platform.",
      "We do not maintain a general-purpose database of members’ residential addresses.",
      "We do not require members to disclose unnecessary personal information.",
      "We do not use cookies.",
      "We do not operate cookie-based behavioural advertising.",
      "We do not sell personal information.",
      "We do not operate a data-broker business.",
      "We do not use personal information to create unnecessary advertising profiles.",
      "We do not have any relationship with Shopify and do not use Shopify as a platform provider for Opulenza Reserve."
    ],
    disclaimer: "Our objective is to provide a premium, discreet and private experience while limiting the personal information maintained by Opulenza Reserve."
  },
  {
    num: "2",
    id: "information-collected",
    title: "2. Information Opulenza Reserve Collects",
    content: [
      "Opulenza Reserve generally has access to only limited personal information."
    ],
    subsections: [
      {
        title: "2.1 Email Address",
        content: [
          "We may collect and maintain your email address for purposes including: creating and managing your Opulenza Reserve account; sending account-related communications; communicating with you regarding membership; sending invitations or access-related communications; responding to enquiries; communicating regarding transactions or marketplace activity; sending service notifications; providing information that you have requested; and maintaining the security of your account.",
          "Your email address is treated as confidential information and is not sold to third parties."
        ]
      },
      {
        title: "2.2 Postal or ZIP Code",
        content: [
          "We may collect your postal code, ZIP code or equivalent geographic postal identifier.",
          "This information may be used for: determining general geographic availability; understanding whether particular services can be offered in your region; determining applicable marketplace, shipping or service requirements; providing region-specific information; supporting delivery coordination where necessary; and complying with applicable geographic or regulatory requirements.",
          "Opulenza Reserve does not require your complete residential address merely for registration or ordinary membership access."
        ]
      },
      {
        title: "2.3 Information Maintained by Sellers",
        content: [
          "Certain information required to complete a transaction may be collected and maintained directly by the relevant seller, consignor, supplier, logistics provider or other transaction participant rather than by Opulenza Reserve.",
          "Such information may include: full name; delivery address; telephone number; courier or recipient information; transaction-specific delivery information; and other information required by the seller or logistics provider to complete delivery.",
          "Where a transaction requires delivery information, the relevant seller or logistics provider may obtain and process that information directly. Opulenza Reserve does not seek to maintain unnecessary copies of such information."
        ]
      },
      {
        title: "2.4 Discreet Delivery and Authorised Recipients",
        content: [
          "For privacy and convenience, members may prefer to arrange delivery through a trusted family member, executive assistant, office representative or other authorised recipient.",
          "Where permitted by the seller and applicable law, members may therefore nominate an appropriate recipient for delivery.",
          "The relevant seller or logistics provider may require the recipient’s name, address, telephone number or other information necessary to complete delivery.",
          "Members should only provide information relating to another individual where they are authorised to do so."
        ]
      }
    ]
  },
  {
    num: "3",
    id: "not-routinely-collected",
    title: "3. Information We Do Not Routinely Collect",
    content: [
      "Opulenza Reserve is intentionally designed to minimise personal information.",
      "Unless specifically required for a particular service, transaction or legal obligation, Opulenza Reserve does not routinely collect or maintain:"
    ],
    bullets: [
      "residential addresses;",
      "detailed family information;",
      "telephone numbers;",
      "government identification documents;",
      "passport information;",
      "driver’s licence information;",
      "bank account information;",
      "credit history;",
      "financial statements;",
      "employment records;",
      "biometric information;",
      "health information;",
      "precise location information;",
      "browsing profiles;",
      "advertising identifiers; or",
      "unnecessary demographic information."
    ],
    disclaimer: "If information is required for a particular transaction or legal requirement, we will seek to explain the reason for requesting it at the relevant time."
  },
  {
    num: "4",
    id: "collectors-members-users",
    title: "4. Information About Collectors, Members and Users",
    content: [
      "When you interact with Opulenza Reserve, we may receive information that you voluntarily provide, including your email address and postal or ZIP code.",
      "We may also maintain information associated with your interaction with the platform, such as:"
    ],
    bullets: [
      "membership status;",
      "account status;",
      "invitations and access permissions;",
      "items or categories in which you have expressed an interest;",
      "communications you have initiated with us;",
      "transaction or marketplace references necessary to administer our services; and",
      "records necessary to maintain the security and integrity of the platform."
    ],
    disclaimer: "We seek to keep such information proportionate to the purpose for which it is collected."
  },
  {
    num: "5",
    id: "collected-automatically",
    title: "5. Information Collected Automatically",
    content: [
      "Opulenza Reserve does not use cookies.",
      "We do not place advertising cookies, analytics cookies, targeting cookies or preference cookies on your device.",
      "We also do not use cookies to create a cross-site behavioural profile of our members.",
      "Like most internet services, our technical infrastructure may necessarily receive limited technical information when a browser or device communicates with our systems, such as information required to establish a secure connection, prevent abuse, maintain platform security or diagnose technical problems.",
      "Where such technical information is processed, it is used for legitimate operational, security and technical purposes and is not used to build a commercial advertising profile."
    ]
  },
  {
    num: "6",
    id: "how-we-use-info",
    title: "6. How Opulenza Reserve Uses Information",
    content: [
      "We use personal information only for legitimate and proportionate purposes, including:"
    ],
    bullets: [
      "Providing our services (membership, marketplace, communications).",
      "Account administration and security.",
      "Communications regarding account, membership, invitations, transactions, and services.",
      "Marketplace operations (cigars, whiskey, pens, yachts, and watches).",
      "Transaction and delivery coordination between buyers, sellers, consignors and service providers.",
      "Fraud, abuse, and misuse prevention.",
      "Legal and regulatory compliance."
    ]
  },
  {
    num: "7",
    id: "what-we-dont-do",
    title: "7. What Opulenza Reserve Does Not Do",
    content: [
      "Opulenza Reserve does not use personal information for purposes inconsistent with this Privacy Policy.",
      "In particular, Opulenza Reserve does not:"
    ],
    bullets: [
      "sell personal information;",
      "rent personal information to third parties;",
      "operate a personal-information data brokerage business;",
      "use cookies for advertising or cookie-based cross-site tracking;",
      "create advertising profiles based on your activity;",
      "provide your information to advertisers for behavioural advertising;",
      "use Shopify as a service provider or platform provider;",
      "provide loans, loan referrals, restoration services, or expert-advice services; or",
      "operate services outside the categories of cigars, whiskey, pens, yachts and watches."
    ]
  },
  {
    num: "8",
    id: "sharing-personal-info",
    title: "8. Sharing of Personal Information",
    content: [
      "Opulenza Reserve may disclose limited personal information where necessary to operate the platform, fulfil a transaction, protect users or comply with law.",
      "Recipients may include:"
    ],
    bullets: [
      "Sellers and Consignors: Where necessary to facilitate a transaction.",
      "Buyers: Where necessary and appropriate to complete a transaction.",
      "Logistics and Delivery Providers: Where necessary to arrange delivery or collection.",
      "Technology and Service Providers: Hosting, infrastructure, security, email delivery, and support.",
      "Professional Advisers: Legal, accounting, compliance or security advisers.",
      "Government and Law Enforcement Authorities: Where required by applicable law or lawful request."
    ]
  },
  {
    num: "9",
    id: "seller-controlled-delivery",
    title: "9. Seller-Controlled Delivery Information",
    content: [
      "Opulenza Reserve has deliberately designed its operating model so that detailed delivery information does not unnecessarily become part of the Opulenza Reserve member database.",
      "For a transaction requiring physical delivery, the seller may obtain and retain information such as recipient name, delivery address, contact number and other details. The seller and its logistics partners may therefore have access to information that Opulenza Reserve itself does not maintain.",
      "Members who value discretion may choose to nominate an authorised family member, executive assistant or other trusted representative as the delivery recipient, subject to the seller’s procedures and applicable law.",
      "The seller is responsible for its own handling of information that it independently collects."
    ]
  },
  {
    num: "10",
    id: "payment-info",
    title: "10. Payment Information",
    content: [
      "Opulenza Reserve does not intend to maintain unnecessary payment credentials as part of a general member profile.",
      "Where payment services are required for a particular transaction, payment information may be processed by the relevant payment service provider or transaction partner.",
      "Opulenza Reserve does not sell payment information or use payment information for advertising purposes."
    ]
  },
  {
    num: "11",
    id: "international-transfers",
    title: "11. International Data Transfers",
    content: [
      "Opulenza Reserve operates across the European Union, United States and APAC.",
      "As a result, limited personal information may be processed or stored in countries other than the country in which you are located.",
      "Where applicable law requires safeguards for international transfers, Opulenza Reserve will implement appropriate safeguards, which may include contractual protections or other lawful transfer mechanisms."
    ]
  },
  {
    num: "12",
    id: "legal-bases",
    title: "12. Legal Bases for Processing",
    content: [
      "Where applicable law requires a legal basis for processing personal information, Opulenza Reserve may rely on one or more of the following:"
    ],
    bullets: [
      "Performance of a contract: To provide services or facilitate transactions.",
      "Legitimate interests: Platform security, fraud prevention, communications, and business management.",
      "Consent: Where required by law (consent may be withdrawn).",
      "Legal obligations: To comply with applicable laws and regulations."
    ]
  },
  {
    num: "13",
    id: "data-retention",
    title: "13. Data Retention",
    content: [
      "Opulenza Reserve follows a data-minimisation approach to retention. We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing services, maintaining accounts, maintaining transaction records, resolving disputes, and complying with legal obligations.",
      "When personal information is no longer required, we will delete, anonymise or securely dispose of it, subject to applicable legal or regulatory retention requirements."
    ]
  },
  {
    num: "14",
    id: "info-security",
    title: "14. Information Security",
    content: [
      "Opulenza Reserve takes reasonable technical and organisational measures designed to protect personal information against unauthorised access, disclosure, alteration, destruction, loss, misuse, and unlawful processing.",
      "Security measures may include access controls, authentication, encryption, secure infrastructure, monitoring and appropriate organisational controls.",
      "No internet-based service can guarantee absolute security. Members should also take reasonable steps to protect their account credentials and access devices."
    ]
  },
  {
    num: "15",
    id: "childrens-privacy",
    title: "15. Children’s Privacy",
    content: [
      "Opulenza Reserve is intended for adults and collectors. Our services are not directed toward children, and we do not knowingly collect personal information from children."
    ]
  },
  {
    num: "16",
    id: "marketing-communications",
    title: "16. Marketing Communications",
    content: [
      "Opulenza Reserve may send service-related communications that are necessary for operating your account. Where we send promotional or marketing communications, we will provide an unsubscribe mechanism where required by applicable law.",
      "We do not sell or rent your email address to third parties for their independent marketing purposes."
    ]
  },
  {
    num: "17",
    id: "no-cookies",
    title: "17. No Cookies and Online Tracking",
    content: [
      "Opulenza Reserve does not use cookies for advertising, retargeting, behavioural profiling, cross-site tracking, analytics profiles, or selling/sharing personal information.",
      "We believe that a private collector platform should not require persistent tracking technology simply to provide access to its services."
    ]
  },
  {
    num: "18",
    id: "third-party-services",
    title: "18. Third-Party Websites and Services",
    content: [
      "Opulenza Reserve may provide links to third-party websites, services or resources. Those third parties operate independently and have their own privacy policies. Opulenza Reserve is not responsible for the privacy practices of websites or services that it does not control."
    ]
  },
  {
    num: "19",
    id: "your-privacy-rights",
    title: "19. Your Privacy Rights",
    content: [
      "Depending on where you live and applicable law, you may have rights relating to your personal information, including the rights to know, access, correct, delete, restrict, or object to certain processing, as well as data portability and consent withdrawal."
    ]
  },
  {
    num: "20",
    id: "exercise-rights",
    title: "20. How to Exercise Your Rights",
    content: [
      "To exercise a privacy right or ask a question about the personal information held by Opulenza Reserve, please contact us using the contact details below. We may need to verify your identity before completing a request to protect your privacy.",
      "Where information is controlled directly by a third party (e.g., a seller, courier, or payment provider), the request may need to be directed to that organisation."
    ]
  },
  {
    num: "21",
    id: "us-residents",
    title: "21. California and Other US Residents",
    content: [
      "Opulenza Reserve does not sell personal information or use it for cross-context behavioural advertising. The categories of personal information processed are limited to identifiers (email), general location (ZIP/postal code), and membership details.",
      "US residents may contact us to exercise rights available under applicable state privacy laws. We will not discriminate against individuals for exercising their privacy rights."
    ]
  },
  {
    num: "22",
    id: "eu-residents",
    title: "22. European Union and EEA Residents",
    content: [
      "If you are located in the European Union or EEA, the GDPR provides you with additional rights, including access, rectification, erasure, restriction, portability, objection, and the right to lodge a complaint with a supervisory authority."
    ]
  },
  {
    num: "23",
    id: "apac-users",
    title: "23. APAC Users",
    content: [
      "Privacy laws differ across APAC jurisdictions. Opulenza Reserve will process personal information in accordance with the privacy laws applicable to the relevant jurisdiction, providing access, correction, deletion, and consent-related rights as required by local law."
    ]
  },
  {
    num: "24",
    id: "data-breaches",
    title: "24. Data Breaches and Security Incidents",
    content: [
      "If Opulenza Reserve becomes aware of a personal-information security incident that is subject to mandatory notification requirements, we will take the steps required by applicable law, including notifying affected individuals and regulators."
    ]
  },
  {
    num: "25",
    id: "business-transfers",
    title: "25. Business Transfers",
    content: [
      "If Opulenza Reserve is involved in a merger, acquisition, restructuring, or asset sale, personal information may be transferred as part of that transaction, remaining subject to appropriate confidentiality and privacy protections."
    ]
  },
  {
    num: "26",
    id: "policy-changes",
    title: "26. Changes to this Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. When we make material changes, we will update the Effective Date and, where required by law, provide additional notice."
    ]
  },
  {
    num: "27",
    id: "contact-us",
    title: "27. Contact Us",
    content: [
      "For privacy questions, requests or concerns, please contact:",
      "Opulenza Reserve Privacy Office",
      "Email: privacy@opulenzareserve.com"
    ]
  },
  {
    num: "28",
    id: "our-commitment",
    title: "28. Our Commitment",
    content: [
      "Opulenza Reserve is built around a simple principle: Collect less. Protect more.",
      "Privacy is a fundamental part of how Opulenza Reserve is designed and operated. We seek to maintain only the information necessary to provide our services, avoid unnecessary tracking, limit third-party disclosure, and give our members meaningful control over their personal information."
    ]
  }
];

const PolicyPage = () => {
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
            Privacy <span className="terms-gold-text">Policy</span>
          </motion.h1>

          <motion.p 
            className="terms-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Discretion, Minimalism, and Protecting Member Information
          </motion.p>

          <motion.div 
            className="terms-meta-bar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="terms-meta-item">
              <span className="terms-meta-label">Effective Date</span>
              <span className="terms-meta-value">August 12, 2026</span>
            </div>
            {/* <div className="terms-meta-divider" /> */}
            {/* <div className="terms-meta-item">
              <span className="terms-meta-label">Approach</span>
              <span className="terms-meta-value">Data Minimisation</span>
            </div> */}
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
                  {POLICY_SECTIONS.map((sec) => (
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
                <h5>Need Clarification?</h5>
                <p>Our dedicated Concierge team can explain security practices, data policies, or access rules.</p>
                <Link to="/concierge" className="terms-help-btn">
                  Contact Concierge
                </Link>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className="terms-main-content">
              {/* Introduction block */}
              <motion.article
                className="terms-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="terms-card-body">
                  <p className="terms-paragraph">
                    Opulenza Reserve (“Opulenza Reserve”, “Opulenza”, “we”, “us” or “our”) respects the privacy and discretion of our members, collectors, sellers, buyers, visitors and business partners.
                  </p>
                  <p className="terms-paragraph">
                    Opulenza Reserve is a private and discreet marketplace and collector platform focused exclusively on exceptional cigars, whiskey, pens, yachts and watches.
                  </p>
                  <p className="terms-paragraph">
                    Our approach to privacy is deliberately conservative. We believe that a private collector platform should collect only the information it genuinely needs, use it only for clearly defined purposes, and avoid unnecessary tracking or profiling.
                  </p>
                  <p className="terms-paragraph">
                    This Privacy Policy explains what information Opulenza Reserve collects, how we use it, how we protect it, when it may be disclosed, and the rights available to individuals whose personal information we process.
                  </p>
                  <p className="terms-paragraph">
                    This Privacy Policy applies to Opulenza Reserve websites, applications, digital platforms, membership services, marketplace services, communications and other services that link to or reference this Privacy Policy.
                  </p>
                  <p className="terms-paragraph">
                    Opulenza Reserve currently operates in the European Union, the United States and the Asia-Pacific region (“APAC”).
                  </p>
                </div>
              </motion.article>

              {POLICY_SECTIONS.map((sec, idx) => (
                <motion.article
                  key={sec.id}
                  id={sec.id}
                  className="terms-card"
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

                    {/* Subsections (for Section 2) */}
                    {sec.subsections && (
                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {sec.subsections.map((sub, sIdx) => (
                          <div key={sIdx} style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(225, 175, 74, 0.2)' }}>
                            <h4 style={{ color: '#e1af4a', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>{sub.title}</h4>
                            {sub.content.map((subText, subTextIdx) => (
                              <p key={subTextIdx} className="terms-paragraph" style={{ margin: '0.25rem 0' }}>{subText}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Disclaimer Box */}
                    {sec.disclaimer && (
                      <div className="terms-disclaimer-box">
                        <IconShield />
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
                    <h4>Our Principle: Collect Less. Protect More.</h4>
                    <p>Our members participate in a private world of exceptional collecting. Privacy is therefore not an afterthought to our platform; it is a fundamental part of how Opulenza Reserve is designed and operated.</p>
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

export default PolicyPage
