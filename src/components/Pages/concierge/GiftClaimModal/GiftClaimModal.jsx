import React, { useState } from 'react';
import './GiftClaimModal.css';
import {GiftForm} from '../../../../services/giftForm/GiftForm'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../services/showUserInfo/ShowUserInfo';

const GiftClaimModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        FullName: '',
        Address: '',
        PhoneNumber: '',
        Country: 'FRANCE',
        State: '',
        City: '',
        PostalCode: ''
    });
    const navigate = useNavigate()

    const { userInfo } = useUser();
    

    

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
        if (!formData.FullName.trim()) errors.FullName = 'Full Name is required';
        if (!formData.Address.trim()) errors.Address = 'Delivery address is required';
        if (!formData.PhoneNumber.trim()) errors.PhoneNumber = 'Phone number is required';
        if (!formData.State.trim()) errors.State = 'State/Province is required';
        if (!formData.City.trim()) errors.City = 'City is required';
        if (!formData.PostalCode.trim()) errors.PostalCode = 'Postal code is required';
        return errors;
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        GiftForm(formData)
            .then((response) => {
                console.log(response);
                setIsSubmitted(true);
                navigate('/concierge')
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="gift-modal-overlay">
            <div className="gift-modal-card" onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
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

                        <form className="gift-modal-form" onSubmit={handleSubmit}>
                            <div className="gift-form-group">
                                <label htmlFor="FullName">FULL NAME</label>
                                <input 
                                    type="text" 
                                    id="FullName" 
                                    name="FullName" 
                                    value={userInfo?.firstName + " " + userInfo?.lastName} 
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
                                    id="Address" 
                                    name="Address" 
                                    value={formData.Address} 
                                    onChange={handleChange} 
                                    placeholder="AVENUE DES CHAMPS-ÉLYSÉES"
                                    autoComplete="street-address"
                                />
                                {formErrors.Address && <span className="gift-form-error">{formErrors.Address}</span>}
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="PhoneNumber">PHONE NUMBER</label>
                                    <input 
                                        type="tel" 
                                        id="PhoneNumber" 
                                        name="PhoneNumber" 
                                        value={formData.PhoneNumber} 
                                        onChange={handleChange} 
                                        placeholder="+1 (000) 000-0000"
                                        autoComplete="tel"
                                    />
                                    {formErrors.PhoneNumber && <span className="gift-form-error">{formErrors.PhoneNumber}</span>}
                                </div>

                                <div className="gift-form-group half-width">
                                    <label htmlFor="Country">COUNTRY</label>
                                    <div className="select-wrapper">
                                        <select 
                                            id="Country" 
                                            name="Country" 
                                            value={formData.Country} 
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
                                    <label htmlFor="State">STATE / PROVINCE</label>
                                    <input 
                                        type="text" 
                                        id="State" 
                                        name="State" 
                                        value={formData.State} 
                                        onChange={handleChange} 
                                        placeholder="CALIFORNIA"
                                    />
                                    {formErrors.State && <span className="gift-form-error">{formErrors.State}</span>}
                                </div>

                                <div className="gift-form-group half-width">
                                    <label htmlFor="City">CITY</label>
                                    <input 
                                        type="text" 
                                        id="City" 
                                        name="City" 
                                        value={formData.City} 
                                        onChange={handleChange} 
                                        placeholder="LOS ANGELES"
                                        autoComplete="address-level2"
                                    />
                                    {formErrors.City && <span className="gift-form-error">{formErrors.City}</span>}
                                </div>
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="PostalCode">POSTAL CODE</label>
                                    <input 
                                        type="text" 
                                        id="PostalCode" 
                                        name="PostalCode" 
                                        value={formData.PostalCode} 
                                        onChange={handleChange} 
                                        placeholder="90210"
                                        autoComplete="postal-code"
                                    />
                                    {formErrors.PostalCode && <span className="gift-form-error">{formErrors.PostalCode}</span>}
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
