import React, { useState, useEffect } from 'react';
import { AddDocument } from '../../../services/getUserData/GetUserData';
import { encryptFile, getEncryptionSecret } from '../../../utils/fileEncryption';
import CommonBackdrop from '../../CommonBackdrop/CommonBackdrop';

const documentTypes = [
  "Passport",
  // "Aadhaar Card",
  // "PAN Card",
  "Driving License",
  "National Identity Card",
  "Residence Permits",
  
];

function AddDocuments({ show, onClose, onSuccess }) {
  const [docType, setDocType] = useState('Passport');
  const [customDocType, setCustomDocType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const finalDocType = docType === 'Other' ? (customDocType || 'Other') : docType;

    setLoading(true);

    try {
      const formData = new FormData();

      // Key 1: DocumentType
      formData.append("DocumentType", finalDocType);

      // Key 2: Document (file payload with encryption)
      try {
        const secret = getEncryptionSecret();
        const encryptedData = await encryptFile(selectedFile, secret);

        formData.append("Document", encryptedData.encryptedBlob, `${finalDocType}.enc`);
        formData.append("Document_originalFileName", encryptedData.originalFileName);
        formData.append("Document_contentType", encryptedData.contentType);
        formData.append("Document_salt", encryptedData.salt);
        formData.append("Document_iv", encryptedData.iv);
        formData.append("Document_encryptionAlgorithm", "AES-256-GCM");
        formData.append("Document_encryptionVersion", "1");
      } catch (cryptoErr) {
        console.warn("Encryption notice:", cryptoErr);
        // Direct file fallback
        formData.append("Document", selectedFile);
      }

      const res = await AddDocument(formData);
      console.log("AddDocument API Response:", res);

      setLoading(false);
      setDocType('Passport');
      setCustomDocType('');
      setSelectedFile(null);
      setFileName('');

      if (onSuccess) onSuccess(res?.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to upload document:", err);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CommonBackdrop label="Encrypting & Uploading Document..." />}
      <div className="prof-modal-overlay" >
      <div
        className="prof-modal-card"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
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

        <h3
          className="prof-modal-title"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--gold)',
            marginBottom: '1.5rem',
            fontSize: '1.4rem'
          }}
        >
          Add Document
        </h3>

        <form onSubmit={handleSubmit} className="prof-settings-form">
          <div className="prof-settings-grid" style={{ gridTemplateColumns: '1fr' }}>
            
            {/* DocumentType Select */}
            <div className="prof-settings-field">
              <label>DOCUMENT TYPE</label>
              <select
                required
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                disabled={loading}
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom type if 'Other' selected */}
            {docType === 'Other' && (
              <div className="prof-settings-field">
                <label>SPECIFY DOCUMENT TYPE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Birth Certificate"
                  value={customDocType}
                  onChange={(e) => setCustomDocType(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {/* Document File Upload */}
            <div className="prof-settings-field">
              <label>DOCUMENT FILE (.pdf, .jpg, .jpeg, .png)</label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={loading}
                style={{ cursor: loading ? 'not-allowed' : 'pointer', padding: '0.5rem 0' }}
              />
              {fileName && (
                <span style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '4px' }}>
                  Selected: {fileName}
                </span>
              )}
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="prof-btn prof-btn--gold"
            style={{
              marginTop: '1.5rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: loading ? 0.75 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
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
                <span>Uploading...</span>
              </>
            ) : (
              "CONFIRM & UPLOAD DOCUMENT"
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default AddDocuments;