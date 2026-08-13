import React, { useState, useRef, useEffect } from 'react'
import Header from '../../../Header/Header'
import GoldenButton from '../../../GoldenButton/GoldenButton'
import "./PrivateAccessSection.css"
import { useAuth } from '../../../../services/showUserInfo/ShowUserInfo'
import { registerUser } from '../../../../services/registerService/RegisterService'
import { checkUserEmail } from '../../../../services/getUserData/GetUserData'
import CommonBackdrop from '../../../CommonBackdrop/CommonBackdrop'
const isInviteCodeFilled = (code) => code.join('').trim().length === 10




const RegistrationModal = ({ inviteCode, onSuccess, onClose, loginData, setLoginData }) => {

  

  const [form, setForm] = useState({
    membershipTypeID: 1,
    oP_MemberInvitations_Id: loginData?.details?.invitationID,
    firstName: '',
    middleName: '',
    lastName: '',
    displayName: '',
    primaryEmail: '',
    secondaryEmail: '',
    primaryMobile: '',
    nationalityID: 0,
    secondaryMobile: '',
    dateOfBirth: '',
    gender: '',
    familyOfficeName: '',
    occupation: '',
    companyName: '',
    website: '',
    title: '',
    bio: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    // try {
    //   await registerUser({ ...form, invitationCode: inviteCode })
    //   onSuccess()
    //   setLoginData(null);
    // } catch (err) {
    //   const msg =
    //     err?.response?.data?.message ||
    //     err?.response?.data?.error ||
    //     'Registration failed. Please try again.'
    //   setError(msg)
    // } finally {
    //   setLoading(false)
    // }

    registerUser({ ...form, invitationCode: inviteCode })
      .then(() => {
        onSuccess();
        setLoginData(null);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Registration failed. Please try again.';

        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });

  }

  return (
    <>
      {loading && <CommonBackdrop label="Creating account" />}
      <div className="pa-modal-overlay">
        <div className="pa-modal-card pa-reg-card" data-lenis-prevent="scroll">

          <button className="pa-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="pa-modal-header">
            <span className="pa-modal-eyebrow">— INVITATION ACCEPTED —</span>
            <h2 className="pa-modal-title">Complete your <em>profile.</em></h2>
            <p className="pa-modal-sub">You have been granted exclusive access. Introduce yourself.</p>
          </div>

          <div className="pa-modal-divider" />

          <form className="pa-modal-form" onSubmit={handleRegister}>

            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">FIRST NAME</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Jonathan"
                  value={form.firstName}
                  onChange={set('firstName')}
                  required
                  autoFocus
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">MIDDLE NAME(optional)</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Ashford"
                  value={form.middleName}
                  onChange={set('middleName')}

                  autoFocus
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">LAST NAME</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={set('lastName')}
                  required
                  autoFocus
                />
              </div>

            </div>

            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">USERNAME / DISPLAY NAME</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="j.ashford"
                  value={form.displayName}
                  onChange={set('displayName')}
                  required
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">PRIMARY EMAIL</label>
                <input
                  type="email"
                  className="pa-field-input"
                  placeholder="member@private"
                  value={form.primaryEmail}
                  onChange={(e) => setForm(prev => ({ ...prev, primaryEmail: e.target.value.toLowerCase() }))}
                  required
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">SECONDARY EMAIL(OPTIONAL)</label>
                <input
                  type="email"
                  className="pa-field-input"
                  placeholder="member@private"
                  value={form.secondaryEmail}
                  onChange={(e) => setForm(prev => ({ ...prev, secondaryEmail: e.target.value.toLowerCase() }))}

                />
              </div>

            </div>

            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">PRIMARY PHONE</label>
                <input
                  type="tel"
                  className="pa-field-input"
                  placeholder="+1 (000) 000-0000"
                  value={form.primaryMobile}
                  onChange={set('primaryMobile')}
                  required
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">SECONDARY PHONE (OPTIONAL)</label>
                <input
                  type="tel"
                  className="pa-field-input"
                  placeholder="+1 (000) 000-0000"
                  value={form.secondaryMobile}
                  onChange={set('secondaryMobile')}
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">DATE OF BIRTH</label>
                <input
                  type="date"
                  className="pa-field-input"
                  value={form.dateOfBirth}
                  onChange={set('dateOfBirth')}
                  required
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">GENDER (OPTIONAL)</label>
                <select
                  className="pa-field-input"
                  value={form.gender}
                  onChange={set('gender')}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pa-field">
                <label className="pa-field-label">FAMILY OFFICE NAME (OPTIONAL)</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter family office name"
                  value={form.familyOfficeName}
                  onChange={set('familyOfficeName')}
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">OCCUPATION (OPTIONAL)</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter occupation"
                  value={form.occupation}
                  onChange={set('occupation')}
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">COMPANY NAME</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={set('companyName')}
                  required
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">WEBSITE (OPTIONAL)</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter website"
                  value={form.website}
                  onChange={set('website')}
                />
              </div>

              <div className="pa-field">
                <label className="pa-field-label">Title</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter title"
                  value={form.title}
                  onChange={set('title')}
                />
              </div>


            </div>

            <div className="pa-reg-row" style={{ gridTemplateColumns: "1fr" }}>
              <div className="pa-field">
                <label className="pa-field-label">BIO</label>
                <textarea
                  className="pa-field-input"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  value={form.bio}
                  onChange={set('bio')}
                />
              </div>
            </div>

            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">PASSWORD</label>
                <input
                  type="password"
                  className="pa-field-input"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
              </div>
              <div className="pa-field">
                <label className="pa-field-label">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  className="pa-field-input"
                  placeholder="••••••••••"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
              </div>
            </div>

            <div className="pa-invite-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>INVITE CODE: <strong>{inviteCode}</strong></span>
            </div>

            {error && <p className="pa-error-msg">{error}</p>}

            <button type="submit" className="pa-submit-btn" disabled={loading}>
              {loading ? 'REGISTERING...' : 'CREATE MY ACCOUNT'}
            </button>

          </form>

          <div className="pa-modal-footer">
            <span className="pa-footer-line" />
            <span className="pa-footer-text">END-TO-END ENCRYPTED</span>
            <span className="pa-footer-line" />
          </div>

        </div>
      </div>
    </>
  )
}

const PrivateAccessSection = () => {
  const { login } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showRegModal, setShowRegModal] = useState(false)
  const [pendingInviteCode, setPending] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState(['O','P','I','-','','','','','',''])
  const [loading, setLoading] = useState(false)
  const [proceedLoading, setProceedLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginStep, setLoginStep] = useState('email')
  const [loginData, setLoginData] = useState(null)
  const [requiresPassword, setRequiresPassword] = useState(false)
  const codeRefs = Array.from({ length: 10 }, () => useRef(null))

  useEffect(() => {
    // Escape key intentionally disabled — modal closes via the close button only
  }, [showModal])

  const handleCodeChange = (idx, val) => {
    if (idx < 4) return
    if (val.length > 1) return
    if (val && !/^\d$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 9) codeRefs[idx + 1].current?.focus()
  }

  const handleCodeKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 4) {
      codeRefs[idx - 1].current?.focus()
    }
  }

  const handleProceed = (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setProceedLoading(true)

    checkUserEmail(email)
      .then((res) => {
        setRequiresPassword(res?.data?.data);
        setLoginStep(res?.data?.data ? 'password' : 'invite')
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Invalid credentials. Please try again.'
        setError(msg)
      })
      .finally(() => {
        setProceedLoading(false)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const filledCode = code.join('')
    const usingInvite = isInviteCodeFilled(code)

    const credentials = {
      userName: email,
      password: loginStep === 'password' ? password : undefined,
      invitationCode: loginStep === 'invite' ? filledCode : undefined,
      _inviteMode: usingInvite,
    }

    login(credentials)
      .then(({ tokenData }) => {
        setLoginData(tokenData)
        setShowModal(false)

        if (usingInvite) {
          setPending(filledCode)
          setShowRegModal(true)
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Invalid credentials. Please try again.'
        setError(msg)
      })
      .finally(() => {
        setLoading(false)
      })
  }




  const handleCloseLoginModal = () => {
    setShowModal(false)
    setLoginStep('email')
    setEmail('')
    setPassword('')
    setCode(['O','P','I','-','','','','','',''])
    setError('')
  }

  const handleRegistrationSuccess = () => {
    setShowRegModal(false)
  }

  return (
    <>
      {(loading || proceedLoading) && (
        <CommonBackdrop label={proceedLoading ? 'Verifying' : 'Signing in'} />
      )}
      <section className='private-access-section'>
        <div className="container">
          <div className='text-center'>
            <Header
            topText="Private Access"
            mainText="Not everything exceptional is"
            highlight="meant to be seen"
            center={true}
            eyebrow={true}
          />
          </div>
          <div className="text-center">
            <div onClick={(e) => { e.preventDefault(); setShowModal(true) }}>
              <GoldenButton text="Login" link="#" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Login Modal ──────────────────────────────────────── */}
      {showModal && (
        <div
          className="pa-modal-overlay"
        >
          <div className="pa-modal-card">

            <button className="pa-modal-close" onClick={handleCloseLoginModal} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* <div className="pa-modal-header">
              <span className="pa-modal-eyebrow">— THE THRESHOLD —</span>
              <h2 className="pa-modal-title">Identify <em>yourself.</em></h2>
              <p className="pa-modal-sub">Members proceed in silence.</p>
            </div> */}

            <div className="pa-modal-divider" />

            {/* ── Step 1: Email only ── */}
            {loginStep === 'email' && (
              <form className="pa-modal-form" onSubmit={handleProceed}>
                <div className="pa-field">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <input
                    type="email"
                    className="pa-field-input"
                    placeholder="member@private"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                    autoFocus
                  />
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button type="submit" className="pa-submit-btn">
                  PROCEED
                </button>
              </form>
            )}

            {/* ── Step 2: Password ── */}
            {loginStep === 'password' && (
              <form className="pa-modal-form" onSubmit={handleSubmit}>

                <button
                  type="button"
                  className="pa-back-btn"
                  onClick={() => { setError(''); setPassword(''); setLoginStep('email'); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>

                <div className="pa-field pa-field--locked">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <div className="pa-field-locked-val">{email}</div>
                </div>

                <div className="pa-field">
                  <label className="pa-field-label">PASSWORD</label>
                  <input
                    type="password"
                    className="pa-field-input"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button type="submit" className="pa-submit-btn" disabled={loading}>
                  {loading ? 'VERIFYING...' : 'LOGIN'}
                </button>

                <button
                  type="button"
                  className="pa-invite-toggle-btn"
                  onClick={() => { setError(''); setLoginStep('invite') }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Login with invite code instead
                </button>
              </form>
            )}

            {/* ── Step 3: Invite Code ── */}
            {loginStep === 'invite' && (
              <form className="pa-modal-form" onSubmit={handleSubmit}>

                <button
                  type="button"
                  className="pa-back-btn"
                  onClick={() => { setError(''); setCode(['O','P','I','-','','','','','','']); setLoginStep('email') }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>

                <div className="pa-field pa-field--locked">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <div className="pa-field-locked-val">{email}</div>
                </div>

                <div className="pa-field">
                  <label className="pa-field-label">PRIVATE ACCESS CODE</label>
                  <div className="pa-code-row">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={codeRefs[idx]}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        className={`pa-code-input${idx < 4 ? ' pa-code-input--prefix' : ''}`}
                        value={digit}
                        readOnly={idx < 4}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                        onFocus={idx < 4 ? () => codeRefs[4].current?.focus() : undefined}
                      />
                    ))}
                  </div>
                  <div className="pa-code-underline" />
                  {isInviteCodeFilled(code) && (
                    <p className="pa-code-hint">✦ Invite code detected — you'll complete registration after verification.</p>
                  )}
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button type="submit" className="pa-submit-btn" disabled={loading}>
                  {loading ? 'VERIFYING...' : 'LOGIN'}
                </button>

                <button
                  type="button"
                  className="pa-invite-toggle-btn"
                  onClick={() => { setError(''); setCode(Array(10).fill('')); setLoginStep('password') }}
                >
                  ← Use password instead
                </button>
              </form>
            )}

            {/* <div className="pa-modal-footer">
              <span className="pa-footer-line" />
              <span className="pa-footer-text">END-TO-END ENCRYPTED</span>
              <span className="pa-footer-line" />
            </div> */}

          </div>
        </div>
      )}

      {/* ── Registration Modal (invite-code flow) ────────────── */}
      {showRegModal && (
        <RegistrationModal
          inviteCode={pendingInviteCode}
          onSuccess={handleRegistrationSuccess}
          onClose={() => setShowRegModal(false)}
          loginData={loginData}
          setLoginData={setLoginData}
        />
      )}
    </>
  )
}

export default PrivateAccessSection
