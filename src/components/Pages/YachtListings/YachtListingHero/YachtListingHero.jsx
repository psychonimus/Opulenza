import React from 'react'
import Header from '../../../Header/Header'
import './YachtListingHero.css'

const YachtListingHero = () => {
    return (
        <>
            <section className="yacht-listing-hero">
                <div className="container" style={{ marginTop: '6rem' }}>
                    <Header
                        topText="VESSELS & SUPERYACHTS"
                        mainText="Curated Selection of"
                        highlight="Luxury Mega Yachts"
                        center={false}
                        eyebrow={true}
                    />
                    <p className="buy-page-para text-start">
                        Command the seas. Engineering excellence meets naval mastery. Discover the world's most prestigious yachts, representing the zenith of nautical design, craftsmanship, and freedom.
                    </p>
                </div>
            </section>
        </>
    )
}

export default YachtListingHero
