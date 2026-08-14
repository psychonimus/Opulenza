import React, { useEffect, useState } from 'react';
import './GiftClaimModal.css';
import { GiftForm } from '../../../../services/giftForm/GiftForm';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../services/showUserInfo/ShowUserInfo';
import { GetAddress } from '../../../../services/getUserData/GetUserData';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    FullName: yup.string().required('Full Name is required'),
    OP_MemberAddressesId: yup.string().nullable(),
    Address: yup.string().required('Delivery address is required'),
    PhoneNumber: yup.string().required('Phone number is required'),
    Country: yup.string().required('Country is required'),
    State: yup.string().required('State/Province is required'),
    City: yup.string().required('City is required'),
    PostalCode: yup.string().required('Postal code is required'),
});
const GiftClaimModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { userInfo } = useUser();
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [addresses, setAddresses] = useState([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode:"onChange",
        defaultValues: {
            FullName: '',
            OP_MemberAddressesId: '',
            Address: '',
            PhoneNumber: '',
            Country: 'FRANCE',
            State: '',
            City: '',
            PostalCode: ''
        }
    });

    useEffect(() => {
        GetAddress()
            .then((response) => {
                const addrData = response?.data?.data || [];
                setAddresses(addrData);
                if (addrData.length > 0) {
                    const firstAddr = addrData[0];
                    setValue('OP_MemberAddressesId', firstAddr.addressID || firstAddr.id || '');
                    setValue('Address', firstAddr.addressLine1 + ' ' + firstAddr.addressLine2 || '');
                    setValue('State', firstAddr.stateProvince || '');
                    setValue('City', firstAddr.city || '');
                    setValue('PostalCode', firstAddr.postalCode || '');
                    if (firstAddr.country) {
                        setValue('Country', firstAddr.country.toUpperCase());
                    }
                }
            })
            .catch((error) => {
                console.log("ADDRESS ERROR", error);
            });
    }, [setValue]);

    useEffect(() => {
        if (userInfo) {
            const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
            if (fullName) {
                setValue('FullName', fullName);
            }
        }
    }, [userInfo, setValue]);

    if (!isOpen) return null;

    const handleUseLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Simulate a delay for reverse-geocoding of a high-end luxury property based on coords
                    setTimeout(() => {
                        setValue('Address', '742 Evergreen Terrace');
                        setValue('State', 'California');
                        setValue('City', 'Beverly Hills');
                        setValue('PostalCode', '90210');
                        setValue('Country', 'UNITED STATES');
                        setIsLocating(false);
                    }, 1200);
                },
                (error) => {
                    console.error("Error retrieving location:", error);
                    // Fallback simulated success if blocked for demo, or show warning
                    setTimeout(() => {
                        setValue('Address', '15, Avenue des Champs-Élysées');
                        setValue('State', 'Île-de-France');
                        setValue('City', 'Paris');
                        setValue('PostalCode', '75008');
                        setValue('Country', 'FRANCE');
                        setIsLocating(false);
                    }, 1000);
                }
            );
        } else {
            setIsLocating(false);
            alert("Geolocation is not supported by this browser.");
        }
    };

    const onSubmit = (data) => {
        GiftForm(data)
            .then((response) => {
                console.log(response);
                setIsSubmitted(true);
                navigate('/concierge');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    console.log("errors",errors?.FullName?.message)

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

                        <form className="gift-modal-form" onSubmit={handleSubmit(onSubmit)}>
                            {addresses.length > 0 && (
                                <div className="gift-form-group">
                                    <label htmlFor="addressSelect">SELECT REGISTERED ADDRESS</label>
                                    <div className="select-wrapper">
                                        <select 
                                            id="addressSelect"
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                const selectedAddr = addresses.find(addr => String(addr.addressID || addr.id) === String(selectedId));
                                                if (selectedAddr) {
                                                    setValue('OP_MemberAddressesId', selectedAddr.addressID || selectedAddr.id || '');
                                                    setValue('Address', selectedAddr.addressLine1 || '');
                                                    setValue('State', selectedAddr.stateProvince || '');
                                                    setValue('City', selectedAddr.city || '');
                                                    setValue('PostalCode', selectedAddr.postalCode || '');
                                                    if (selectedAddr.country) {
                                                        setValue('Country', selectedAddr.country.toUpperCase());
                                                    }
                                                }
                                            }}
                                        >
                                            {addresses.map((addr) => (
                                                <option key={addr.addressID || addr.id} value={addr.addressID || addr.id}>
                                                    {addr.addressType || 'Address'} - {addr.addressLine1}, {addr.city}
                                                </option>
                                            ))}
                                        </select>
                                        <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            )}

                            <div className="gift-form-group">
                                <label htmlFor="FullName">FULL NAME</label>
                                <input 
                                    type="text" 
                                    placeholder="GABRIEL VALENTINE"
                                    autoComplete="name"
                                    {...register('FullName')}
                                />
                                {errors.FullName && <span className="gift-form-error">{errors.FullName.message}</span>}
                            </div>

                            <div className="gift-form-group">
                                <label htmlFor="deliveryAddress">DELIVERY ADDRESS</label>
                                <input 
                                    type="text" 
                                    id="Address" 
                                    placeholder="AVENUE DES CHAMPS-ÉLYSÉES"
                                    autoComplete="street-address"
                                    {...register('Address')}
                                />
                                {errors.Address && <span className="gift-form-error">{errors.Address.message}</span>}
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="PhoneNumber">PHONE NUMBER</label>
                                    <input 
                                        type="tel" 
                                        id="PhoneNumber" 
                                        placeholder="+1 (000) 000-0000"
                                        autoComplete="tel"
                                        {...register('PhoneNumber')}
                                    />
                                </div>
                                <div className="gift-form-group half-width">
                                    <label htmlFor="Country">COUNTRY</label>
                                    <input 
                                        type="text" 
                                        id="Country" 
                                        placeholder="FRANCE"
                                        {...register('Country')}
                                    />
                                    {errors.Country && <span className="gift-form-error">{errors.Country.message}</span>}
                                </div>
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="State">STATE / PROVINCE</label>
                                    <input 
                                        type="text" 
                                        id="State" 
                                        placeholder="CALIFORNIA"
                                        {...register('State')}
                                    />
                                    {errors.State && <span className="gift-form-error">{errors.State.message}</span>}
                                </div>

                                <div className="gift-form-group half-width">
                                    <label htmlFor="City">CITY</label>
                                    <input 
                                        type="text" 
                                        id="City" 
                                        placeholder="LOS ANGELES"
                                        autoComplete="address-level2"
                                        {...register('City')}
                                    />
                                    {errors.City && <span className="gift-form-error">{errors.City.message}</span>}
                                </div>
                            </div>

                            <div className="gift-form-row">
                                <div className="gift-form-group half-width">
                                    <label htmlFor="PostalCode">POSTAL CODE</label>
                                    <input 
                                        type="text" 
                                        id="PostalCode" 
                                        placeholder="90210"
                                        autoComplete="postal-code"
                                        {...register('PostalCode')}
                                    />
                                    {errors.PostalCode && <span className="gift-form-error">{errors.PostalCode.message}</span>}
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
