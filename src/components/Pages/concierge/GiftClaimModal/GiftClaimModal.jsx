import React, { useState } from 'react';
import './GiftClaimModal.css';

const GiftClaimModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        deliveryAddress: '',
        phoneNumber: '',
        country: 'UNITED STATES',
        stateProvince: '',
        city: '',
        postalCode: ''
    });

    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleUseLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Simulate a delay for reverse-geocoding of a high-end luxury property based on coords
                    setTimeout(() => {
                        setFormData(prev => ({
                            ...prev,
                            deliveryAddress: '742 Evergreen Terrace',
                            stateProvince: 'California',
                            city: 'Beverly Hills',
                            postalCode: '90210',
                            country: 'UNITED STATES'
                        }));
                        setIsLocating(false);
                    }, 1200);
                },
                (error) => {
                    console.error("Error retrieving location:", error);
                    // Fallback simulated success if blocked for demo, or show warning
                    setTimeout(() => {
                        setFormData(prev => ({
                            ...prev,
                            deliveryAddress: '15, Avenue des Champs-Élysées',
                            stateProvince: 'Île-de-France',
                            city: 'Paris',
                            postalCode: '75008',
                            country: 'FRANCE'
                        }));
                        setIsLocating(false);
                    }, 1000);
                }
            );
        } else {
            setIsLocating(false);
            alert("Geolocation is not supported by this browser.");
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
        if (!formData.deliveryAddress.trim()) errors.deliveryAddress = 'Delivery address is required';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
        if (!formData.stateProvince.trim()) errors.stateProvince = 'State/Province is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        // Form is valid, show success state
        setIsSubmitted(true);
    };

    return (
        <div className="gift-modal-overlay" onClick={onClose}>
            <div className="gift-modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="gift-modal-close-btn" onClick={onClose} aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {!isSubmitted ? (
                    <>
                        <h2 className="gift-modal-title">
                            Where shall we send your <br />
                            <span className="gift-modal-title-italic">welcome gift?</span>
                        </h2>

                        <div className="gift-modal-location-row">
                            <button 
                                type="button" 
                                className={`gift-modal-location-btn ${isLocating ? 'locating' : ''}`}
                                onClick={handleUseLocation}
                                disabled={isLocating}
                            >
                                
                               
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="gift-modal-form">
                            <div className="gift-form-group">
                                <label htmlFor="fullName">FULL NAME</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    placeholder="GABRIEL VALENTINE"
                                    autoComplete="name"
                                />
                                {formErrors.fullName && <span className="gift-form-error">{formErrors.fullName}</span>}
                            </div>

                            <div className="gift-form-group">
                                <label htmlFor="deliveryAddress">DELIVERY ADDRESS</label>
                                <input 
                                    type="text" 
                                    id="deliveryAddress" 
                                    name="deliveryAddress" 
                                    value={formData.deliveryAddress} 
                                    onChange={handleChange} 
                                    placeholder="AVENUE DES CHAMPS-ÉLYSÉES"
                                    autoComplete="street-address"
                                />
                                {formErrors.deliveryAddress && <span className="gift-form-error">{formErrors.deliveryAddress}</span>}
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="phoneNumber">PHONE NUMBER</label>
                                    <input 
                                        type="tel" 
                                        id="phoneNumber" 
                                        name="phoneNumber" 
                                        value={formData.phoneNumber} 
                                        onChange={handleChange} 
                                        placeholder="+1 (000) 000-0000"
                                        autoComplete="tel"
                                    />
                                    {formErrors.phoneNumber && <span className="gift-form-error">{formErrors.phoneNumber}</span>}
                                </div>

                                <div className="gift-form-group half-width">
                                    <label htmlFor="country">COUNTRY</label>
                                    <div className="select-wrapper">
                                        <select 
                                            id="country" 
                                            name="country" 
                                            value={formData.country} 
                                            onChange={handleChange}
                                        >
                                            <option value="FRANCE">FRANCE</option>
                                            <option value="SINGAPORE">SINGAPORE</option>
                                            <option value="MALAYSIA">MALAYSIA</option>
                                            <option value="UNITED KINGDOM">UNITED KINGDOM</option>
                                            <option value="MONACO">MONACO</option>
                                            <option value="SWITZERLAND">SWITZERLAND</option>
                                            <option value="ITALY">ITALY</option>
                                            <option value="JAPAN">JAPAN</option>
                                            <option value="UNITED ARAB EMIRATES">UNITED ARAB EMIRATES</option>
                                        </select>
                                        <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="stateProvince">STATE / PROVINCE</label>
                                    <input 
                                        type="text" 
                                        id="stateProvince" 
                                        name="stateProvince" 
                                        value={formData.stateProvince} 
                                        onChange={handleChange} 
                                        placeholder="CALIFORNIA"
                                    />
                                    {formErrors.stateProvince && <span className="gift-form-error">{formErrors.stateProvince}</span>}
                                </div>

                                <div className="gift-form-group half-width">
                                    <label htmlFor="city">CITY</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleChange} 
                                        placeholder="LOS ANGELES"
                                        autoComplete="address-level2"
                                    />
                                    {formErrors.city && <span className="gift-form-error">{formErrors.city}</span>}
                                </div>
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="postalCode">POSTAL CODE</label>
                                    <input 
                                        type="text" 
                                        id="postalCode" 
                                        name="postalCode" 
                                        value={formData.postalCode} 
                                        onChange={handleChange} 
                                        placeholder="90210"
                                        autoComplete="postal-code"
                                    />
                                    {formErrors.postalCode && <span className="gift-form-error">{formErrors.postalCode}</span>}
                                </div>
                                <div className="gift-form-group half-width empty-slot"></div>
                            </div>

                            <div className="gift-submit-container">
                                <button type="submit" className="gift-submit-btn">
                                    CONTINUE
                                </button>
                            </div>
                        </form>

                        <p className="gift-modal-disclaimer">
                            BY CONTINUING, YOU ACKNOWLEDGE OUR TERMS OF DISCRETION AND PRIVACY PROTOCOLS.
                        </p>
                    </>
                ) : (
                    <div className="gift-modal-success fade-in-animation">
                        <div className="gift-success-icon-wrapper">
                            <svg className="gift-success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3 className="gift-success-title">Gesture Registered</h3>
                        <p className="gift-success-message">
                            Your welcome gift has been reserved. A courier will dispatch the item to your specified address shortly.
                        </p>
                        <div className="gift-submit-container">
                            <button className="gift-submit-btn" onClick={onClose}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiftClaimModal;
