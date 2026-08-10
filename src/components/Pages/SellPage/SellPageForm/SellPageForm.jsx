import React, { useState } from 'react'
import './SellPageForm.css'
import { SendSellingFormData } from '../../../../services/sellingServices/sendSellingFormData/SendSellingFormData'
import { number } from 'framer-motion'

const categories = [
  {
    id: 'watches',
    number : '1',
    label: 'Watches',
    subtitle: 'Patek Philippe, Audemars Piguet, Rolex',
  },
  {
    id: 'whisky',
    number : '2',
    label: 'Whisky',
    subtitle: 'Bordeaux, Burgundy, Rare Cognac',
  },
  {
    id: 'cigars',
    number : '3',
    label: 'Cigars',
    subtitle: 'Cohiba, Montecristo, Pre-1980 Curated',
  },
  {
    id: 'pens',
    number : '4',
    label: 'Luxury Pens',
    subtitle: 'Montblanc, Cartier, Visconti',
  },
  {
    id: 'yacht',
    number : '5',
    label: 'Yacht',
    subtitle: 'Sunseeker, Ferretti, Azimut',
  },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i)

const formFields = {
  watches: [
    // Watches - Specifications
    { id: 'specSection', label: 'Watches - Specifications', type: 'section' },
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Patek Philippe', half: true },
    { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Nautilus 5711/1A', half: true },
    { id: 'serialNumber', label: 'Serial Number', type: 'text', placeholder: 'Found on papers or caseback', half: true },
    { id: 'yearOfPurchase', label: 'Year of Purchase', type: 'select', options: years, half: true },

    // Pricing & Auction
    { id: 'pricingSection', label: 'Pricing & Auction', type: 'section' },
    { id: 'originalPrice', label: 'Original Price (USD)', type: 'text', placeholder: 'Value at acquisition', half: true },
    { id: 'expectedPrice', label: 'Expected Price (USD)', type: 'text', placeholder: 'Expected Price', half: true },
    { id: 'auctionEndDate', label: 'Select Auction End Date (Max 15 days)', type: 'date', half: true },

    // Condition & Accessories
    { id: 'condSection', label: 'Condition & Accessories', type: 'section' },
    { id: 'condition', label: 'Current Condition', type: 'select', options: ['Unworn / New', 'Excellent', 'Scratched', 'Good', 'Fair'], half: true },
    { id: 'Case', label: 'Box Case available?', type: 'select', options: ['Yes', 'No'], half: true },

    // Documentation
    { id: 'docSection', label: 'Documentation', type: 'section' },
    { id: 'papers', label: 'Papers', type: 'file', placeholder: 'Original certificate or warranty papers.', half: true },
    { id: 'Certificate', label: 'Certificates', type: 'file', placeholder: 'Service history or appraisal certificates.', half: true },

    // Photo Requirements
    { id: 'photoSection', label: 'Photo Requirements', type: 'section' },
    { id: 'photoFrontDial', label: 'Front / Dial View', type: 'file', placeholder: 'Sharp head-on shot showing the dial, hands, and bezel.', half: true },
    { id: 'photoCaseBack', label: 'Case Back View', type: 'file', placeholder: 'Engravings, serial number, and hallmark details.', half: true },
    { id: 'photoSideProfile', label: 'Crown & Side Profile', type: 'file', placeholder: 'Side view showing crown, pushers, and case finish.', half: true },
    { id: 'photoStrapBracelet', label: 'Strap / Bracelet & Clasp', type: 'file', placeholder: 'Strap texture, links, and clasp wear.', half: true },
    { id: 'photoBoxPapers', label: 'Box & Papers presentation', type: 'file', placeholder: 'Outer box, presentation case, tag, and accessories.', half: true },
  ],
  whisky: [
    // Whisky / Wine - Specifications
    { id: 'specSection', label: 'Whisky / Wine - Specifications', type: 'section' },
    { id: 'producerName', label: 'Distillery / Producer Name', type: 'text', placeholder: 'e.g. Macallan, Lafite', half: true },
    { id: 'bottlingName', label: 'Series / Bottling Name', type: 'text', placeholder: 'e.g. Rare Vintage, Gran Reserva', half: true },
    { id: 'vintageYear', label: 'Vintage Year', type: 'select', options: years, half: true },
    { id: 'age', label: 'Age (Years Aged)', type: 'text', placeholder: 'e.g. 18 YO, 25 YO', half: true },
    { id: 'proof', label: '% ABV / Proof', type: 'text', placeholder: 'e.g. 43%', half: true },
    { id: 'bottleSize', label: 'Bottle Size', type: 'text', placeholder: 'e.g. 70 cl, 750 ml', half: true },
    { id: 'productionType', label: 'Production Type', type: 'select', options: ['Single Malt', 'Single Grain', 'Blended Malt', 'Red Wine', 'White Wine', 'Cognac / Brandy', 'Other'], half: true },
    { id: 'region', label: 'Region', type: 'select', options: ['Speyside', 'Islay', 'Highlands', 'Lowlands', 'Bordeaux', 'Burgundy', 'Champagne', 'Other'], half: true },
    { id: 'bottlingType', label: 'Bottling Type', type: 'select', options: ['Distillery Bottling', 'Independent Bottler', 'Estate Bottled'], half: true },
    { id: 'distilleryStatus', label: 'Distillery Status', type: 'select', options: ['Active', 'Closed / Silent', 'N/A'], half: true },
    { id: 'bottle', label: 'Bottle / Container Type', type: 'select', options: ['Standard Bottle', 'Decanter', 'Magnum', 'Cask / Barrel'], half: true },

    // Quantity & Storage
    { id: 'quantitySection', label: 'Quantity & Storage', type: 'section' },
    { id: 'quantity', label: 'Quantity (Bottles / Units)', type: 'text', placeholder: 'e.g. 1', half: true },
    { id: 'storageCondition', label: 'Storage Condition', type: 'select', options: ['Cellar / Climate Controlled', 'Bonded Warehouse', 'Home Storage'], half: true },

    // Documentation
    { id: 'docSection', label: 'Documentation', type: 'section' },
    { id: 'invoice', label: 'Acquisition Invoice / Receipt', type: 'file', placeholder: 'Proof of purchase, retail receipt, or auction invoice.', half: true },
    { id: 'storageCertificate', label: 'Cellar / Bonded Storage Certificate', type: 'file', placeholder: 'Official storage statement or climate logs.', half: true },

    // Photo Requirements
    { id: 'photoSection', label: 'Photo Requirements', type: 'section' },
    { id: 'photoFrontLabel', label: 'Front Label View', type: 'file', placeholder: 'Clear head-on shot of the front label showing logo and text.', half: true },
    { id: 'photoBackLabel', label: 'Back Label & Barcode', type: 'file', placeholder: 'Importers labels, back stamp, and barcode details.', half: true },
    { id: 'photoCapsuleSeal', label: 'Capsule, Seal & Fill Level', type: 'file', placeholder: 'Close-up of seal integrity and visible fill level (ullage).', half: true },
    { id: 'photoBaseEngraving', label: 'Base / Glass Engravings', type: 'file', placeholder: 'Bottom of the bottle showing glass mold serial numbers.', half: true },
    { id: 'photoPackagingCase', label: 'Original Case & Packaging', type: 'file', placeholder: 'Original wooden box, carton, booklet, or outer case.', half: true },

    // Pricing
    { id: 'originalPrice', label: 'Pricing & Value', type: 'section' },
    { id: 'expectedPrice', label: 'Estimated Value (USD)', type: 'text', placeholder: 'Total desired value for the listing', half: true },
  ],
  cigars: [
    // Cigars - Specifications
    { id: 'specSection', label: 'Cigars - Specifications', type: 'section' },
    { id: 'editionName', label: 'Release / Edition Name', type: 'text', placeholder: 'e.g. Partagas Lusitanias 2024', half: true },
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Partagas, Cohiba', half: true },
    { id: 'commercialShape', label: 'Vitola (Factory / Commercial Shape)', type: 'text', placeholder: 'e.g. Prominentes, Robusto', half: true },
    { id: 'boxYear', label: 'Box Year (Production Date)', type: 'select', options: years, half: true },
    { id: 'length', label: 'Ring Gauge & Length', type: 'text', placeholder: 'e.g. 49 / 194mm (7.6 inches)', half: true },
    { id: 'origin', label: 'Country of Origin', type: 'select', options: ['Cuba', 'Dominican Republic', 'Nicaragua', 'Honduras', 'Other'], half: true },
    { id: 'packagingType', label: 'Packaging Type', type: 'text', placeholder: 'e.g. Dress Box of 25, Cabinet of 50', half: true },
    { id: 'quantity', label: 'Quantity (Cigars Included)', type: 'text', placeholder: 'e.g. 25', half: true },

    // Storage & Preservation
    { id: 'storageSection', label: 'Storage & Preservation', type: 'section' },
    { id: 'orignalBox', label: 'Original Box / Humidor Status', type: 'select', options: ['Yes – Sealed', 'Yes – Opened', 'No Box - Loose Cigars'], half: true },

    // Documentation
    { id: 'docSection', label: 'Documentation', type: 'section' },
    { id: 'cigarInvoice', label: 'Purchase Invoice / Receipt', type: 'file', placeholder: 'Receipt or invoice showing purchase source and date.', half: true },
    { id: 'humidorLog', label: 'Humidor Storage climate statement', type: 'file', placeholder: 'Log of temperature and humidity conditions (RH %).', half: true },

    // Photo Requirements
    { id: 'photoSection', label: 'Photo Requirements', type: 'section' },
    { id: 'photoBoxTop', label: 'Box Lid & Branding', type: 'file', placeholder: 'Top view of the box showing labels, branding, and decals.', half: true },
    { id: 'photoBoxBottom', label: 'Box Bottom (Factory Hot Stamps)', type: 'file', placeholder: 'Underneath showing official hot stamps, factory & date codes.', half: true },
    { id: 'photoOpenBox', label: 'Open Box (Cigars Layout)', type: 'file', placeholder: 'Full view of cigars aligned inside box showing bands & wrappers.', half: true },
    { id: 'photoWarrantySeal', label: 'Cuban Warranty Seal / Hologram', type: 'file', placeholder: 'Close-up of green warranty seal and barcode/serial number.', half: true },
    { id: 'photoBandCap', label: 'Cigar Band & Cap close-up', type: 'file', placeholder: 'Macro shot of individual cigar head, band, and foot.', half: true },

    // Pricing
    { id: 'originalPrice', label: 'Pricing & Value', type: 'section' },
    { id: 'expectedPrice', label: 'Asking Price (USD)', type: 'text', placeholder: 'Your desired price', half: true },
  ],
  pens: [
    // Pens - Specifications
    { id: 'specSection', label: 'Pens - Specifications', type: 'section' },
    { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Montblanc, Namiki', half: true },
    { id: 'model', label: 'Model / Collection Name', type: 'text', placeholder: 'e.g. Meisterstück 149, Emperor', half: true },
    { id: 'penType', label: 'Pen Type', type: 'select', options: ['Fountain', 'Rollerball', 'Ballpoint'], half: true },
    { id: 'manifacturingYear', label: 'Year of Manufacturing', type: 'select', options: years, half: true },
    { id: 'limitedEditionRegistry', label: 'Limited Edition Registry (If applicable)', type: 'text', placeholder: 'e.g. No. 012 / 888', half: true },
    { id: 'serialNumber', label: 'Serial Number (Mandatory)', type: 'text', placeholder: 'Enter serial number', half: true },

    // Nib Specifics (Fountain Pens Only)
    { id: 'nibSection', label: 'Nib Specifics (Fountain Pens Only)', type: 'section', condition: (data) => data.penType === 'Fountain' },
    { id: 'nibMaterial', label: 'Nib Material', type: 'text', placeholder: 'e.g. 14K Gold, 18K Gold, Platinum', half: true, condition: (data) => data.penType === 'Fountain' },
    { id: 'nibSize', label: 'Nib Size / Width', type: 'select', options: ['EF', 'F', 'M', 'B', 'BB', 'Stub', 'Zoom'], half: true, condition: (data) => data.penType === 'Fountain' },

    // Materials & Mechanics
    { id: 'materialsSection', label: 'Materials & Mechanics', type: 'section' },
    { id: 'bodyMaterial', label: 'Body Material', type: 'text', placeholder: 'e.g. Precious Resin, Urushi Lacquer', half: true },
    { id: 'trim', label: 'Trim', type: 'text', placeholder: 'e.g. Rose Gold Plated, Ruthenium', half: true },
    { id: 'fillingMechanism', label: 'Filling Mechanism', type: 'select', options: ['Piston Filler', 'Vacumatic', 'Eyedropper', 'Other'], half: true },

    // Condition
    { id: 'conditionSection', label: 'Condition', type: 'section' },
    { id: 'condition', label: 'Condition Grade', type: 'select', options: ['Mint / Uninked', 'Near Mint', 'Excellent', 'Good'], half: true },
    { id: 'orignalOuterBox', label: 'Inclusions', type: 'checkbox-group', options: ['Original Outer Box', 'Presentation Case', 'Service Guide'], half: false },

    // Photo Requirements
    { id: 'photoSection', label: 'Photo Requirements', type: 'section' },
    { id: 'photoFullCapped', label: 'Full Pen (Capped)', type: 'file', placeholder: 'Image showing total alignment and overall cosmetic condition.', half: true },
    { id: 'photoFullUncapped', label: 'Full Pen (Uncapped)', type: 'file', placeholder: 'Visible section grip wear.', half: true },
    { id: 'photoMacroNib', label: 'Macro Nib', type: 'file', placeholder: 'Image focused on the tip material.', half: true },
    { id: 'photoCapRing', label: 'Cap ring and engravings', type: 'file', placeholder: 'Zoomed image of manufacturing laser serial number to match with the provided details.', half: true },
    { id: 'photoBoxCert', label: 'Box and/or authenticity certificate.', type: 'file', placeholder: 'Images of box, papers, or certificate.', half: true },

    // Pricing
    { id: 'originalPrice', label: 'Pricing', type: 'section' },
    { id: 'expectedPrice', label: 'Asking Price (USD)', type: 'text', placeholder: 'Your desired price', half: true },
  ],
  yacht: [
    // Yacht - Specifications
    { id: 'specSection', label: 'Yacht - Specifications', type: 'section' },
    { id: 'make', label: 'Make / Brand', type: 'text', placeholder: 'e.g. Sunseeker, Ferretti', half: true },
    { id: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Manhattan 68', half: true },
    { id: 'yearBuilt', label: 'Year Built', type: 'select', options: years, half: true },
    { id: 'length', label: 'Length (meters / feet)', type: 'text', placeholder: 'e.g. 22m (72ft)', half: true },
    { id: 'hullType', label: 'Hull Type', type: 'select', options: ['Motor Yacht', 'Sailing Yacht', 'Catamaran', 'Superyacht', 'Speedboat'], half: true },
    { id: 'registry', label: 'Flag / Registry', type: 'text', placeholder: 'e.g. Cayman Islands', half: true },
    { id: 'condition', label: 'Current Condition', type: 'select', options: ['Showroom / Pristine', 'Excellent', 'Good', 'Needs Refit'], half: true },

    // Documentation
    { id: 'docSection', label: 'Documentation', type: 'section' },
    { id: 'yachtRegistration', label: 'Certificate of Registry / Ownership', type: 'file', placeholder: 'Official ship registry papers.', half: true },
    { id: 'marineSurvey', label: 'Marine Survey Report (Recent)', type: 'file', placeholder: 'Condition appraisal or hull survey report.', half: true },
    { id: 'maintenanceLog', label: 'Maintenance Logbook & Records', type: 'file', placeholder: 'Service history or mechanical logs.', half: true },

    // Photo Requirements
    { id: 'photoSection', label: 'Photo Requirements', type: 'section' },
    { id: 'photoExteriorProfile', label: 'Exterior Profile (Side View)', type: 'file', placeholder: 'Wide angle shot of the yacht profile on water.', half: true },
    { id: 'photoHelmStation', label: 'Helm Station & Flybridge', type: 'file', placeholder: 'Electronics, navigation cockpit, and controls.', half: true },
    { id: 'photoAftDeck', label: 'Aft Deck & Cockpit lounge', type: 'file', placeholder: 'Outdoor lounge, swim platform, and dining space.', half: true },
    { id: 'photoSaloonInterior', label: 'Main Saloon & Staterooms', type: 'file', placeholder: 'Main living areas, seating, cabin layouts.', half: true },
    { id: 'photoEngineRoom', label: 'Engine Room / Propulsion', type: 'file', placeholder: 'Close-up of main engines, generators, and bilge.', half: true },

    // Pricing
    { id: 'originalPrice', label: 'Pricing & Value', type: 'section' },
    { id: 'expectedPrice', label: 'Asking Price (USD)', type: 'text', placeholder: 'Your desired price', half: true },
  ],
}

const SellPageForm = () => {
  const [activeCategory, setActiveCategory] = useState('watches')
  // const [activeCategoryId, setActiveCategoryId] = useState('1')
  const [formData, setFormData] = useState({
    categoryId : "1",
  })
  const [fileNames, setFileNames] = useState({})

  // console.log(formData)

  const handleCategoryChange = (id,number) => {
    setActiveCategory(id)
    
    setFormData(prev => ({...prev, categoryId: number}))
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

  // console.log(fields)



  const handleSubmit = (e) => {
    e.preventDefault();
    SendSellingFormData(formData)
    .then((res) => {
        console.log(res)
        setFormData('');
    })
    .catch((err) => {
        console.log(err)
    })
  }

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
                onClick={() => handleCategoryChange(cat.id, cat.number)}
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
            {fields.map((field) => {
              if (field.condition && !field.condition(formData)) {
                return null
              }

              if (field.type === 'section') {
                return (
                  <div key={field.id} className="sell-field-group full sell-section-divider">
                    <h3 className="sell-section-title">{field.label}</h3>
                  </div>
                )
              }

              return (
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
                  ) : field.type === 'checkbox-group' ? (
                    <div className="sell-checkbox-group">
                      {field.options.map((opt) => {
                        const isChecked = (formData[field.id] || []).includes(opt)
                        return (
                          <label key={opt} className="sell-checkbox-label">
                            <input
                              type="checkbox"
                              className="sell-checkbox-input"
                              checked={isChecked}
                              onChange={(e) => {
                                const currentVal = formData[field.id] || []
                                const newVal = e.target.checked
                                  ? [...currentVal, opt]
                                  : currentVal.filter((val) => val !== opt)
                                setFormData(prev => ({ ...prev, [field.id]: newVal }))
                              }}
                            />
                            <span className="sell-checkbox-custom" />
                            <span className="sell-checkbox-text">{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  ) : field.type === 'file' ? (
                    <label className="sell-file-upload" htmlFor={field.id}>
                      <input
                        id={field.id}
                        type="file"
                        className="sell-file-input-hidden"
                        multiple={field.id === 'addImages'}
                        accept={field.id === 'addImages' || field.id.startsWith('photo') ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
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
                        {fileNames[field.id] ? (
                          <span className="sell-file-name">{fileNames[field.id]}</span>
                        ) : (
                          <span className="sell-file-placeholder-wrapper">
                            <span className="sell-file-placeholder">Click to upload</span>
                            {field.placeholder && (
                              <span className="sell-file-helper">{field.placeholder}</span>
                            )}
                          </span>
                        )}
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
              )
            })}
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
            <button type='submit' onClick={(e)=> handleSubmit(e)}  className="sell-btn-next">
              Submit
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
