import React from 'react'
import { Link } from 'react-router-dom'
import cigarData from '../../../../data/CigarData'
import './CigarListingsBody.css'

const CigarListingsBody = () => {
    return (
        <section className="all-cigar-section">
            <div className="container">
                <div className="all-cigar-grid">
                    {cigarData.map((item) => {
                        const brand  = item.details?.find(d => d.label === 'BRAND')?.value  || item.title
                        const origin = item.details?.find(d => d.label === 'ORIGIN')?.value || '—'
                        const size   = item.details?.find(d => d.label === 'SIZE')?.value   || '—'
                        const rarity = item.details?.find(d => d.label === 'RARITY')?.value || '—'

                        return (
                            <Link
                                to={`/cigars/${item.id}`}
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
                </div>
            </div>
        </section>
    )
}

export default CigarListingsBody