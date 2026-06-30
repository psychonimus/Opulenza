import React from 'react'
import { Link } from 'react-router-dom'
import whiskyData from '../../../../data/WhiskyData'
import './AllWhisky.css'

const AllWhisky = () => {
    return (
        <section className="all-whisky-section">
            <div className="container">
                <div className="all-whisky-grid">
                    {whiskyData.map((item) => {
                        const distillery = item.details?.find(d => d.label === 'DISTILLERY')?.value || item.title
                        const distilled  = item.details?.find(d => d.label === 'DISTILLED')?.value  || '—'
                        const cask       = item.details?.find(d => d.label === 'CASK')?.value        || '—'
                        const rarity     = item.details?.find(d => d.label === 'RARITY')?.value      || '—'

                        return (
                            <Link
                                to={`/whisky/${item.id}`}
                                key={item.id}
                                className="whisky-card-link"
                            >
                                <div className="whisky-card">
                                    <div className="whisky-card__image-wrapper">
                                        <img
                                            src={item.image}
                                            alt={`${item.title} ${item.reference}`}
                                            className="whisky-card__image"
                                        />
                                        <div className="whisky-card__overlay" />
                                        <span className="whisky-card__badge">{item.badge}</span>
                                    </div>
                                    <div className="whisky-card__body">
                                        <h3 className="whisky-card__title">{item.title}</h3>
                                        <p className="whisky-card__reference">{item.reference}</p>
                                        <p className="whisky-card__desc">{item.description}</p>
                                        <div className="whisky-card__meta">
                                            <div className="whisky-card__meta-item">
                                                <span className="whisky-card__meta-label">DISTILLERY</span>
                                                <span className="whisky-card__meta-value">{distillery}</span>
                                            </div>
                                            <div className="whisky-card__meta-item">
                                                <span className="whisky-card__meta-label">DISTILLED</span>
                                                <span className="whisky-card__meta-value">{distilled}</span>
                                            </div>
                                            <div className="whisky-card__meta-item">
                                                <span className="whisky-card__meta-label">CASK</span>
                                                <span className="whisky-card__meta-value">{cask}</span>
                                            </div>
                                            <div className="whisky-card__meta-item">
                                                <span className="whisky-card__meta-label">RARITY</span>
                                                <span className="whisky-card__meta-value">{rarity}</span>
                                            </div>
                                        </div>
                                        <div className="whisky-card__footer">
                                            <div className="whisky-card__bid">
                                                <span className="whisky-card__bid-label">CURRENT BID</span>
                                                <span className="whisky-card__bid-value">{item.currentBid}</span>
                                            </div>
                                            <span className="whisky-card__cta">BID NOW →</span>
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

export default AllWhisky
