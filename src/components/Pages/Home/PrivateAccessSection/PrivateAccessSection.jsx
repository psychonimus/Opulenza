import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../Header/Header'
import GoldenButton from '../../../GoldenButton/GoldenButton'
import "./PrivateAccessSection.css"

const PrivateAccessSection = () => {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const navigate = useNavigate()

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShowModal(false) }
    if (showModal) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal])

  const handleCodeChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 3) codeRefs[idx + 1].current?.focus()
  }

  const handleCodeKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      codeRefs[idx - 1].current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/concierge')
  }

  return (
    <>
      <section className='private-access-section'>
        <div className="container">
          <Header
            topText="Private Access"
            mainText="Not everything exceptional is"
            highlight="meant to be seen"
            center={true}
          />
          <div className="text-center">
            {/* Intercept click — open modal instead of navigating */}
            <div onClick={(e) => { e.preventDefault(); setShowModal(true) }}>
              <GoldenButton
                text="Enter Private Access"
                link="#"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Private Access Modal */}
      {showModal && (
        <div
          className="pa-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="pa-modal-card">

            {/* Close */}
            <button className="pa-modal-close" onClick={() => setShowModal(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className="pa-modal-header">
              <span className="pa-modal-eyebrow">— THE THRESHOLD —</span>
              <h2 className="pa-modal-title">Identify <em>yourself.</em></h2>
              <p className="pa-modal-sub">Members proceed in silence.</p>
            </div>

            <div className="pa-modal-divider" />

            <form className="pa-modal-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="pa-field">
                <label className="pa-field-label">MEMBER ID / EMAIL</label>
                <input
                  type="email"
                  className="pa-field-input"
                  placeholder="member@private"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {/* Password */}
              <div className="pa-field">
                <label className="pa-field-label">PASSWORD</label>
                <input
                  type="password"
                  className="pa-field-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Private Access Code */}
              <div className="pa-field">
                <label className="pa-field-label">PRIVATE ACCESS CODE (OPTIONAL)</label>
                <div className="pa-code-row">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={codeRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="pa-code-input"
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    />
                  ))}
                </div>
                <div className="pa-code-underline" />
              </div>

              {/* Submit */}
              <button type="submit" className="pa-submit-btn">
                CONTINUE
              </button>

            </form>

            {/* Footer */}
            <div className="pa-modal-footer">
              <span className="pa-footer-line" />
              <span className="pa-footer-text">END-TO-END ENCRYPTED</span>
              <span className="pa-footer-line" />
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default PrivateAccessSection