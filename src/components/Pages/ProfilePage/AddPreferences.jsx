import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AddPreferences } from '../../../services/getUserData/GetUserData';
import { useUser } from '../../../services/showUserInfo/ShowUserInfo';
import CommonBackdrop from '../../CommonBackdrop/CommonBackdrop';

import watchIcon from '../../../assets/icons/watch.svg';
import whiskyIcon from '../../../assets/icons/whisky.svg';
import cigarIcon from '../../../assets/icons/cigar.svg';
import penIcon from '../../../assets/icons/pen.svg';
import yachtIcon from '../../../assets/icons/yacht.svg';
import newsletterIcon from '../../../assets/icons/newsletter.svg';
import smsIcon from '../../../assets/icons/sms.svg';
import emailIcon from '../../../assets/icons/email.svg';
import currencyIcon from '../../../assets/icons/currency.svg';
import languageIcon from '../../../assets/icons/language.svg';
import checkIcon from '../../../assets/icons/check.svg';

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CHF', label: 'CHF (CHF)' },
  { value: 'AED', label: 'AED (AED)' },
  { value: 'SGD', label: 'SGD (S$)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' }
];

const languageOptions = [
  'English',
  'French',
  'German',
  'Spanish',
  'Italian',
  'Japanese',
  'Arabic',
  'Chinese'
];

function AddPreferencesModal({ show, onClose, onSuccess, initialData }) {
  const cardRef = useRef(null);
  const { refreshUser } = useUser();

  const [formData, setFormData] = useState({
    InterestedInWatches: false,
    InterestedInWhisky: false,
    InterestedInCigars: false,
    InterestedInLuxuryPens: false,
    InterestedInYachts: false,
    Newsletter: false,
    SMSAlerts: false,
    EmailAlerts: false,
    PreferredCurrency: 'USD',
    PreferredLanguage: 'English'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      setFormData(prev => ({
        ...prev,
        InterestedInWatches: Boolean(initialData.InterestedInWatches ?? initialData.interestedInWatches ?? prev.InterestedInWatches),
        InterestedInWhisky: Boolean(initialData.InterestedInWhisky ?? initialData.interestedInWhisky ?? prev.InterestedInWhisky),
        InterestedInCigars: Boolean(initialData.InterestedInCigars ?? initialData.interestedInCigars ?? prev.InterestedInCigars),
        InterestedInLuxuryPens: Boolean(initialData.InterestedInLuxuryPens ?? initialData.interestedInLuxuryPens ?? prev.InterestedInLuxuryPens),
        InterestedInYachts: Boolean(initialData.InterestedInYachts ?? initialData.interestedInYachts ?? prev.InterestedInYachts),
        Newsletter: Boolean(initialData.Newsletter ?? initialData.newsletter ?? prev.Newsletter),
        SMSAlerts: Boolean(initialData.SMSAlerts ?? initialData.smsAlerts ?? prev.SMSAlerts),
        EmailAlerts: Boolean(initialData.EmailAlerts ?? initialData.emailAlerts ?? prev.EmailAlerts),
        PreferredCurrency: initialData.PreferredCurrency || initialData.preferredCurrency || prev.PreferredCurrency,
        PreferredLanguage: initialData.PreferredLanguage || initialData.preferredLanguage || prev.PreferredLanguage,
      }));
    }
  }, [initialData, show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      InterestedInWatches: Boolean(formData.InterestedInWatches),
      InterestedInWhisky: Boolean(formData.InterestedInWhisky),
      InterestedInCigars: Boolean(formData.InterestedInCigars),
      InterestedInLuxuryPens: Boolean(formData.InterestedInLuxuryPens),
      InterestedInYachts: Boolean(formData.InterestedInYachts),
      Newsletter: Boolean(formData.Newsletter),
      SMSAlerts: Boolean(formData.SMSAlerts),
      EmailAlerts: Boolean(formData.EmailAlerts),
      PreferredCurrency: formData.PreferredCurrency || 'USD',
      PreferredLanguage: formData.PreferredLanguage || 'English'
    };

    try {
      const res = await AddPreferences(payload);
      console.log("AddPreferences API Response:", res);
      await refreshUser();
      setLoading(false);

      if (onSuccess) onSuccess(res?.data, payload);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to add preferences:", err);
      setLoading(false);
      await refreshUser();
      if (onSuccess) onSuccess(null, payload);
      if (onClose) onClose();
    }
  };

  const assetCategories = [
    { key: 'InterestedInWatches', label: 'Fine Timepieces & Watches', icon: watchIcon },
    { key: 'InterestedInWhisky', label: 'Rare Whisky & Spirits', icon: whiskyIcon },
    { key: 'InterestedInCigars', label: 'Bespoke Cigars', icon: cigarIcon },
    { key: 'InterestedInLuxuryPens', label: 'Luxury Writing Instruments', icon: penIcon },
    { key: 'InterestedInYachts', label: 'Superyachts & Marine', icon: yachtIcon }
  ];

  const notificationOptions = [
    { key: 'Newsletter', label: 'Monthly Private Catalog & Insights', desc: 'Exclusive market insights & quarterly collection drops', icon: newsletterIcon },
    { key: 'SMSAlerts', label: 'SMS Instant Auction Alerts', desc: 'Direct text alerts for outbids and winning lots', icon: smsIcon },
    { key: 'EmailAlerts', label: 'Email Notifications & Directives', desc: 'Email summaries for bids and concierge updates', icon: emailIcon }
  ];

  return createPortal(
    <>
      {loading && <CommonBackdrop label="Saving Preferences..." />}
      <div className="prof-modal-overlay" >
        <div
          ref={cardRef}
          tabIndex={-1}
          className="prof-modal-card"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{ outline: 'none' }}
        >
          {/* Custom In-Modal Loading Backdrop Overlay */}
          {loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(6, 4, 3, 0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '8px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.2rem'
              }}
            >
              <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: 'var(--gold)',
                    borderRightColor: 'rgba(214, 165, 77, 0.35)',
                    animation: 'prof-spin 0.8s linear infinite'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '1.5px solid transparent',
                    borderBottomColor: 'var(--gold-light)',
                    animation: 'prof-spin 0.6s linear infinite reverse'
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  letterSpacing: '0.18em',
                  color: 'var(--gold)',
                  textTransform: 'uppercase'
                }}
              >
                SAVING PREFERENCES...
              </span>
            </div>
          )}

          {/* Header */}
          <button className="prof-modal-close" onClick={onClose} disabled={loading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div>
            <h3
              className="prof-modal-title"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--gold)',
                marginBottom: '0.2rem',
                fontSize: '1.45rem'
              }}
            >
              Membership Preferences
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
              Customize your asset interests, alert channels, and regional settings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: '1.2rem' }}>
            
            {/* Asset Interests */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.14em',
                  color: 'var(--gold)',
                  marginBottom: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                ASSET INTERESTS
              </label>

              <div className="prof-asset-grid">
                {assetCategories.map(({ key, label, icon }) => {
                  const isChecked = formData[key];
                  return (
                    <div
                      key={key}
                      onClick={() => handleToggle(key)}
                      className={`prof-asset-card ${isChecked ? 'prof-asset-card--active' : 'prof-asset-card--inactive'}`}
                    >
                      <div className="prof-asset-card__left">
                        <div className="prof-asset-card__icon-box">
                          <img
                            src={icon}
                            alt={label}
                            className={`prof-svg-icon ${isChecked ? '' : 'prof-svg-icon--dim'}`}
                          />
                        </div>
                        <span className="prof-asset-card__title">
                          {label}
                        </span>
                      </div>

                      <div className={`prof-checkbox-badge ${isChecked ? 'prof-checkbox-badge--checked' : 'prof-checkbox-badge--unchecked'}`}>
                        {isChecked && (
                          <img src={checkIcon} alt="Checked" style={{ width: '12px', height: '12px' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notification Alerts */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.14em',
                  color: 'var(--gold)',
                  marginBottom: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                NOTIFICATION ALERTS
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notificationOptions.map(({ key, label, desc, icon }) => {
                  const isChecked = formData[key];
                  return (
                    <div
                      key={key}
                      onClick={() => handleToggle(key)}
                      className={`prof-asset-card ${isChecked ? 'prof-asset-card--active' : 'prof-asset-card--inactive'}`}
                      style={{ padding: '12px 16px' }}
                    >
                      <div className="prof-asset-card__left">
                        <div className="prof-asset-card__icon-box">
                          <img
                            src={icon}
                            alt={label}
                            className={`prof-svg-icon ${isChecked ? '' : 'prof-svg-icon--dim'}`}
                          />
                        </div>
                        <div>
                          <div className="prof-asset-card__title">
                            {label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '2px' }}>
                            {desc}
                          </div>
                        </div>
                      </div>

                      <div className={`prof-checkbox-badge ${isChecked ? 'prof-checkbox-badge--checked' : 'prof-checkbox-badge--unchecked'}`}>
                        {isChecked && (
                          <img src={checkIcon} alt="Checked" style={{ width: '12px', height: '12px' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional & Currency Preferences */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.14em',
                  color: 'var(--gold)',
                  marginBottom: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                REGIONAL & CURRENCY
              </label>

              <div className="prof-settings-grid">
                <div className="prof-settings-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={currencyIcon} alt="Currency" className="prof-svg-icon" style={{ width: '14px', height: '14px' }} />
                    PREFERRED CURRENCY
                  </label>
                  <select
                    name="PreferredCurrency"
                    value={formData.PreferredCurrency}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {currencyOptions.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="prof-settings-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={languageIcon} alt="Language" className="prof-svg-icon" style={{ width: '14px', height: '14px' }} />
                    PREFERRED LANGUAGE
                  </label>
                  <select
                    name="PreferredLanguage"
                    value={formData.PreferredLanguage}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Action Button */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="prof-btn prof-btn--gold"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: '12px 24px'
                }}
              >
                {loading ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{ animation: 'prof-spin 0.8s linear infinite' }}
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                    </svg>
                    <span>SAVING PREFERENCES...</span>
                  </>
                ) : (
                  "CONFIRM & SAVE PREFERENCES"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}

export default AddPreferencesModal;
