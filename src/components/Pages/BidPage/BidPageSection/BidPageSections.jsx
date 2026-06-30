import React from 'react'
import './BidPageSections.css'
import { Link } from 'react-router-dom'
import { link } from 'framer-motion/client'

const categories = [
    {
        id: 'watches',
        image: '/images/bid-watches.png',
        badge: '124 EXCLUSIVE LISTINGS',
        title: 'Watches',
        arrow: '→',
        link: "/watchListing",
    },
    {
        id: 'whiskey',
        image: '/images/bid-whiskey.png',
        badge: '86 RARE VINTAGES',
        title: 'Whiskey',
        arrow: '→',
        link: "/whiskyListings",
    },
    {
        id: 'cigars',
        image: '/images/bid-cigars.png',
        badge: '42 LIMITED BATCHES',
        title: 'Cigars',
        arrow: '→',
        link : "/cigarsListings"
    },
    {
        id: 'pens',
        image: '/images/luxury-pen-card.png',
        badge: '21 BESPOKE INSTRUMENTS',
        title: 'Luxury Pens',
        arrow: '→',
    },
    {
        id: 'yacht',
        image: '/images/yatch-bg.png',
        badge: '15 CHARTERED & FOR SALE',
        title: 'The Yacht Collection',
        arrow: '→',
        wide: true,
    },
]

const BidPageSections = () => {
    return (
        <>
            <section className="bid-page-sections">
                <div className="container">
                    {/* Row 1: Three equal cards */}
                    <div className="bps-row bps-row--three">
                        {categories.slice(0, 3).map((cat) => (
                            <Link to={cat.link} style={{ textDecoration: "none" }}>
                                <div className="bps-card" key={cat.id}>
                                    <img src={cat.image} alt={cat.title} className="bps-card__img" />
                                    <div className="bps-card__overlay" />
                                    <div className="bps-card__content">
                                        <div className="bps-card__top">
                                            <span className="bps-card__badge">{cat.badge}</span>
                                            <div className="bps-card__title-row">
                                                <h3 className="bps-card__title">{cat.title}</h3>
                                                <span className="bps-card__arrow">{cat.arrow}</span>
                                            </div>
                                        </div>
                                        <button className="bps-card__btn">EXPLORE</button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Row 2: One small + one wide */}
                    <div className="bps-row bps-row--two">
                        {categories.slice(3).map((cat) => (
                            <div className={`bps-card${cat.wide ? ' bps-card--wide' : ''}`} key={cat.id}>
                                <img src={cat.image} alt={cat.title} className="bps-card__img" />
                                <div className="bps-card__overlay" />
                                <div className="bps-card__content">
                                    <div className="bps-card__top">
                                        <span className="bps-card__badge">{cat.badge}</span>
                                        <div className="bps-card__title-row">
                                            <h3 className="bps-card__title">{cat.title}</h3>
                                            <span className="bps-card__arrow">{cat.arrow}</span>
                                        </div>
                                    </div>
                                    <button className="bps-card__btn">EXPLORE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default BidPageSections