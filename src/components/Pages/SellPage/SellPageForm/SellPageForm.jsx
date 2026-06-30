import React, { useState } from 'react'
import './SellPageForm.css'

const categories = [
  {
    id: 'watches',
    label: 'Watches',
    subtitle: 'Patek Philippe, Audemars Piguet, Rolex',
  },
  {
    id: 'wines',
    label: 'Whisky',
    subtitle: 'Bordeaux, Burgundy, Rare Cognac',
  },
  {
    id: 'cigars',
    label: 'Cigars',
    subtitle: 'Cohiba, Montecristo, Pre-1980 Curated',
  },
  {
    id: 'pens',
    label: 'Luxury Pens',
    subtitle: 'Montblanc, Cartier, Visconti',
  },
  {
    id: 'yacht',
    label: 'Yacht',
    subtitle: 'Sunseeker, Ferretti, Azimut',
  },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i)

const formFields = {
  watches: [
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Patek Philippe', half: true },
    { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Nautilus 5711/1A', half: true },
    { id: 'referenceNumber', label: 'Reference Number', type: 'text', placeholder: 'Found on papers or caseback', half: true },
    { id: 'yearOfPurchase', label: 'Year of Purchase', type: 'select', options: years, half: true },
    { id: 'originalPrice', label: 'Original Price (USD)', type: 'text', placeholder: 'Value at acquisition', half: true },
    { id: 'minimumPrice', label: 'Minimum expected Price (USD)', type: 'text', placeholder: 'Minimum expected Price', half: true },
    { id: 'condition', label: 'Current Condition', type: 'select', options: ['Unworn / New', 'Excellent', 'Very Good', 'Good', 'Fair'], half: true },
    { id: 'Case', label: 'Box Case avaialble?', type: 'select', options: ['Yes', 'No'], half: true },
    { id: 'endDate', label: 'Select Auction End Date (Max 15 days)', type: 'date', half: true },
    { id: 'papers', label: 'Papers', type: 'file', half: true },
    { id: 'Certificate', label: 'Certificates', type: 'file', half: true },
    { id: 'addImages', label: 'Asset Images', type: 'file', half: true },
  ],
  wines: [
    { id: 'wineType', label: 'Wine / Spirit Type', type: 'select', options: ['Red Wine', 'White Wine', 'Champagne', 'Cognac', 'Whisky', 'Other'], half: true },
    { id: 'producer', label: 'Producer / Château', type: 'text', placeholder: 'e.g. Pétrus, Dom Pérignon', half: true },
    { id: 'vintage', label: 'Vintage Year', type: 'select', options: years, half: true },
    { id: 'quantity', label: 'Quantity (Bottles)', type: 'text', placeholder: 'e.g. 12', half: true },
    { id: 'storageCondition', label: 'Storage Condition', type: 'select', options: ['Cellar / Climate Controlled', 'Bonded Warehouse', 'Home Storage'], half: true },
    { id: 'estimatedValue', label: 'Estimated Value (USD)', type: 'text', placeholder: 'Per bottle or total', half: true },
  ],
  cigars: [
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Cohiba, Montecristo', half: true },
    { id: 'vitola', label: 'Vitola / Size', type: 'text', placeholder: 'e.g. Robusto, Churchill', half: true },
    { id: 'origin', label: 'Country of Origin', type: 'select', options: ['Cuba', 'Dominican Republic', 'Nicaragua', 'Honduras', 'Other'], half: true },
    { id: 'productionYear', label: 'Production Year', type: 'select', options: years, half: true },
    { id: 'quantity', label: 'Quantity (Units)', type: 'text', placeholder: 'e.g. 25', half: true },
    { id: 'storageBox', label: 'Original Box / Humidor', type: 'select', options: ['Yes – Sealed', 'Yes – Opened', 'No'], half: true },
  ],
  pens: [
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Montblanc, Cartier', half: true },
    { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Meisterstück 149', half: true },
    { id: 'material', label: 'Material', type: 'select', options: ['Gold', 'Platinum', 'Silver', 'Resin', 'Mixed'], half: true },
    { id: 'yearOfPurchase', label: 'Year of Purchase', type: 'select', options: years, half: true },
    { id: 'limitedEdition', label: 'Limited Edition', type: 'select', options: ['Yes', 'No', 'Unknown'], half: true },
    { id: 'condition', label: 'Current Condition', type: 'select', options: ['Mint / Unused', 'Excellent', 'Very Good', 'Good', 'Fair'], half: true },
    { id: 'originalBox', label: 'Original Box & Papers', type: 'select', options: ['Yes – Complete Set', 'Box Only', 'No'], half: true },
    { id: 'askingPrice', label: 'Asking Price (USD)', type: 'text', placeholder: 'Your desired price', half: true },
  ],
  yacht: [
    { id: 'make', label: 'Make / Brand', type: 'text', placeholder: 'e.g. Sunseeker, Ferretti', half: true },
    { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Manhattan 68', half: true },
    { id: 'yearBuilt', label: 'Year Built', type: 'select', options: years, half: true },
    { id: 'length', label: 'Length (meters)', type: 'text', placeholder: 'e.g. 22', half: true },
    { id: 'hullType', label: 'Hull Type', type: 'select', options: ['Motor Yacht', 'Sailing Yacht', 'Catamaran', 'Superyacht', 'Speedboat'], half: true },
    { id: 'flag', label: 'Flag / Registration', type: 'text', placeholder: 'e.g. Cayman Islands', half: true },
    { id: 'condition', label: 'Current Condition', type: 'select', options: ['Showroom', 'Excellent', 'Good', 'Needs Refit'], half: true },
    { id: 'askingPrice', label: 'Asking Price (USD)', type: 'text', placeholder: 'Your desired price', half: true },
  ],
}

const SellPageForm = () => {
  const [activeCategory, setActiveCategory] = useState('watches')
  const [formData, setFormData] = useState({})
  const [fileNames, setFileNames] = useState({})

  const handleCategoryChange = (id) => {
    setActiveCategory(id)
    setFormData({})
    setFileNames({})
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const { id, files } = e.target
    const names = files.length > 1
      ? `${files.length} files selected`
      : files[0]?.name || ''
    setFileNames(prev => ({ ...prev, [id]: names }))
  }

  const fields = formFields[activeCategory] || []

  return (
    <section className="sell-form-section">
      

      <div className="sell-form-container">
        {/* LEFT — Categories */}
        <div className="sell-categories">
          <div className="sell-categories-label">
            <span>Select Category</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>

          <div className="sell-category-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`sell-category-card${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {activeCategory === cat.id && (
                  <span className="sell-category-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
                <span className="sell-category-name">{cat.label}</span>
                <span className="sell-category-sub">{cat.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Dynamic Form */}
        <div className="sell-form-panel">
          <div className="sell-form-fields" key={activeCategory}>
            {fields.map((field) => (
              <div
                key={field.id}
                className={`sell-field-group${field.half ? ' half' : ' full'}`}
              >
                <label htmlFor={field.id} className="sell-field-label">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <div className="sell-select-wrapper">
                    <select
                      id={field.id}
                      className="sell-field-input sell-field-select"
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>Select</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="sell-select-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                ) : field.type === 'file' ? (
                  <label className="sell-file-upload" htmlFor={field.id}>
                    <input
                      id={field.id}
                      type="file"
                      className="sell-file-input-hidden"
                      multiple={field.id === 'addImages'}
                      accept={field.id === 'addImages' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
                      onChange={handleFileChange}
                    />
                    <span className="sell-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </span>
                    <span className="sell-file-text">
                      {fileNames[field.id]
                        ? <span className="sell-file-name">{fileNames[field.id]}</span>
                        : <span className="sell-file-placeholder">Click to upload</span>
                      }
                    </span>
                    <span className="sell-file-btn">Browse</span>
                  </label>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    className="sell-field-input"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Authenticity Protocol */}
          <div className="sell-authenticity-box">
            <div className="sell-authenticity-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="sell-authenticity-title">Authenticity Protocol</p>
              <p className="sell-authenticity-text">
                All listed Products undergo a physical inspection at our central vault in Geneva. Please ensure all documentation and original boxes are available for the appraisal phase.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sell-form-footer">
            <button className="sell-btn-prev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Previous Step
            </button>
            <button className="sell-btn-next">
              Save &amp; Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SellPageForm
