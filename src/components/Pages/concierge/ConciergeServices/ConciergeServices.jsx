import React from 'react'
import './ConciergeServices.css'
import {Link} from 'react-router-dom'
import { link } from 'framer-motion/client'
import Header from '../../../Header/Header'

const services = [
    {
        id: 'bid',
        image: '/images/service-buy.png',
        label: 'BID',
        heading: 'Rare Vintages & Collectibles',
        description: 'Exceptional vintages and rare releases, curated for discerning collectors.',
        cta: 'VIEW COLLECTION',
        elevated: false,
        link: "/bidPage"
    },
    {
        id: 'sell',
        image: '/images/service-sell.png',
        label: 'SELL',
        heading: 'Private Global Network',
        description: 'Discreetly list and manage the sale of elite products through our private global network.',
        cta: 'CREATE LISTING',
        elevated: true,
        link: "/sell"
    },
    {
        id: 'explore',
        image: '/images/service-explore.png',
        label: 'EXPLORE',
        heading: 'Curated Selection',
        description: 'Discover a curated selection of products sourced exclusively for our members.',
        cta: 'DISCOVER MORE',
        elevated: false,
    },
]

const ConciergeServices = () => {
    return (
        <>  
            <div className="container">
                <Header
                topText="DISCOVER"
                mainText="Where Will Your Journey "
                highlight="Take You Today?"
                center={false}
                margin="6rem"
            />
            </div>
            <section className="concierge-services">
            <div className="container">
                <div className="row align-items-center justify-content-center g-4">
                    {services.map((service) => (
                        <div className="col-md-4" key={service.id}>
                            <Link to={service.link} style={{textDecoration:"none"}}>
                                <div className={`service-card${service.elevated ? ' service-card--elevated' : ''}`}>
                                    <div className="service-card__image-wrap">
                                        <img
                                            src={service.image}
                                            alt={service.label}
                                            className="service-card__image"
                                        />
                                    </div>
                                    <div className="service-card__body">
                                        <div className="service-card__label-row">
                                            <span className="service-card__dash"></span>
                                            <span className="service-card__label">{service.label}</span>
                                        </div>
                                        <h3 className="service-card__heading">{service.heading}</h3>
                                        <p className="service-card__desc">{service.description}</p>
                                        <a href="#" className="service-card__cta">
                                            {service.cta}
                                            <span className="service-card__arrow">→</span>
                                        </a>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        </>
    )
}

export default ConciergeServices