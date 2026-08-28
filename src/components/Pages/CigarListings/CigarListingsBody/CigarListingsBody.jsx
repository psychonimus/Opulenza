import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cigarData from '../../../../data/CigarData'
import './CigarListingsBody.css'
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'


const CigarListingsBody = () => {

    const [cigars, setCigars] = useState([])

    const getCigarListings = () => {
        getApprovedListing(1)
            .then((res) => {
                setCigars(res?.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getCigarListings()
    }, [])

    // console.log(cigars)













    return (
        <section className="all-cigar-section">
            <div className="container">

                {/* Back to listings link */}
                <div className="detailed-page__breadcrumb">
                    <Link to="/bidPage" className="breadcrumb-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Reserves
                    </Link>
                </div>

                {cigars.length === 0 ? (
                  <div className="listings-empty-state">
                    <div className="listings-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <h3 className="listings-empty-state__title">No Listings at the Moment</h3>
                    <p className="listings-empty-state__sub">Our specialists are curating rare cigar collections. Check back soon or list your own humidor.</p>
                    <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
                  </div>
                ) : (
                <div className="all-cigar-grid">
                    {cigars.map((item) => {
                        return (
                            <Link
                                to={`/cigar/${item.itemId}`}
                                key={item.itemId}
                                className="cigar-card-link"
                            >
                                <div className="cigar-card">
                                    <div className="cigar-card__image-wrapper">
                                        <img
                                            src={item.details?.openBox}
                                            alt={`${item.brand} ${item.details.editionName}`}
                                            className="cigar-card__image"
                                        />
                                        <div className="cigar-card__overlay" />
                                    </div>
                                    <div className="cigar-card__body">
                                        <h3 className="cigar-card__title">{item.details?.brand}</h3>
                                        <p className="cigar-card__reference">{item.details?.editionName}</p>
                                        <p className="cigar-card__desc">{item.details?.commercialShape}</p>
                                        <div className="cigar-card__meta">
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BRAND</span>
                                                <span className="cigar-card__meta-value">{item.details?.brand}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">ORIGIN</span>
                                                <span className="cigar-card__meta-value">{item.details?.origin}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">SIZE</span>
                                                <span className="cigar-card__meta-value">{item.details?.length}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BOX YEAR</span>
                                                <span className="cigar-card__meta-value">{item.details?.boxYear}</span>
                                            </div>
                                        </div>
                                        <div className="cigar-card__footer">
                                            <div className="cigar-card__bid">
                                                <span className="cigar-card__bid-label">CURRENT BID</span>
                                                <span className="cigar-card__bid-value">$568</span>
                                            </div>
                                            <span className="cigar-card__cta">BID NOW →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                )}

                {/* <div className="all-cigar-grid">
                    {cigarData.map((item) => {
                        const brand = item.details?.find(d => d.label === 'BRAND')?.value || item.title
                        const origin = item.details?.find(d => d.label === 'ORIGIN')?.value || '—'
                        const size = item.details?.find(d => d.label === 'SIZE')?.value || '—'
                        const rarity = item.details?.find(d => d.label === 'RARITY')?.value || '—'

                        return (
                            <Link
                                to={`/cigar/${item.id}`}
                                key={item.id}
                                className="cigar-card-link"
                            >
                                <div className="cigar-card">
                                    <div className="cigar-card__image-wrapper">
                                        <img
                                            src={item.image}
                                            alt={`${item.title} ${item.reference}`}
                                            className="cigar-card__image"
                                        />
                                        <div className="cigar-card__overlay" />
                                    </div>
                                    <div className="cigar-card__body">
                                        <h3 className="cigar-card__title">{item.title}</h3>
                                        <p className="cigar-card__reference">{item.reference}</p>
                                        <p className="cigar-card__desc">{item.description}</p>
                                        <div className="cigar-card__meta">
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">BRAND</span>
                                                <span className="cigar-card__meta-value">{brand}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">ORIGIN</span>
                                                <span className="cigar-card__meta-value">{origin}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">SIZE</span>
                                                <span className="cigar-card__meta-value">{size}</span>
                                            </div>
                                            <div className="cigar-card__meta-item">
                                                <span className="cigar-card__meta-label">RARITY</span>
                                                <span className="cigar-card__meta-value">{rarity}</span>
                                            </div>
                                        </div>
                                        <div className="cigar-card__footer">
                                            <div className="cigar-card__bid">
                                                <span className="cigar-card__bid-label">CURRENT BID</span>
                                                <span className="cigar-card__bid-value">{item.currentBid}</span>
                                            </div>
                                            <span className="cigar-card__cta">BID NOW →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div> */}
            </div>
        </section >
    )
}

export default CigarListingsBody