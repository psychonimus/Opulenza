import React, { useState, useEffect } from 'react';
import { inviteUser } from '../../services/inviteService/InviteService';
import '../Pages/ProfilePage/ProfilePage.css';
import { useBackdrop } from '../CommonBackdrop/BackdropContext';

const InviteModal = ({ show, onClose, onSuccessCallback }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRemark, setInviteRemark] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const { showBackdrop, hideBackdrop } = useBackdrop();

  useEffect(() => {
    let timer;
    if (inviteSuccess) {
      // Auto close the modal after 15 seconds
      timer = setTimeout(() => {
        handleCloseModal();
      }, 15000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [inviteSuccess]);

  if (!show) return null;

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteError('');

    const inviteObj = {
      Name: inviteName,
      InviteTo: inviteEmail,
      Remarks: inviteRemark
    };

    try {
      showBackdrop();
      const res = await inviteUser(inviteObj);
      const code = res?.data?.inviteCode || res?.inviteCode || res?.data?.data?.inviteCode || '';
      setGeneratedCode(code);
      setInviteSuccess(true);
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invite failed. Please try again.';
      setInviteError(msg);
    } finally {
      hideBackdrop();
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleCloseModal = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteRemark('');
    setGeneratedCode('');
    setCopyFeedback(false);
    setInviteSuccess(false);
    setInviteError('');
    if (onClose) onClose();
  };

  return (
    <div className="prof-modal-overlay">
      <div className="prof-modal-card">
        <button type="button" className="prof-modal-close" onClick={handleCloseModal}>
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

        {!inviteSuccess ? (
          <form onSubmit={handleGenerateInvite} className="prof-modal-form">
            <div className="prof-form-group">
              <label>Connoisseur's Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Baroness Von Stein"
                value={inviteName}
                style={{textTransform:"capitalize"}}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>

            <div className="prof-form-group">
              <label>Connoisseur's Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g., v.stein@private.court"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value.toLowerCase())}
              />
            </div>

            <div className="prof-form-group">
              <label>Remarks</label>
              <input
                type="text"
                
                placeholder="Some Remarks"
                value={inviteRemark}
                onChange={(e) => setInviteRemark(e.target.value)}
              />
            </div>

            {inviteError && (
              <p className="prof-invite-error">{inviteError}</p>
            )}

            <button type="submit" className="prof-btn prof-btn--gold prof-btn--block">
              Generate Invitation Code
            </button>
          </form>
        ) : (
          <div className="prof-invite-success">
            <div className="prof-invite-success-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Invitation code generated successfully!</span>
            </div>

            <div className="prof-code-box">
              <span className="prof-code-label">PERSONAL ACCREDITED KEY</span>
              <div className="prof-code-display">{generatedCode}</div>
            </div>

            <div className="prof-invite-actions">
              <button type="button" onClick={handleCopyCode} className="prof-btn prof-btn--gold">
                {copyFeedback ? 'Copied!' : 'Copy Code'}
              </button>
              <button type="button" onClick={handleCloseModal} className="prof-btn prof-btn--ghost">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
