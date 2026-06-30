import React from 'react'
import Header from '../../../Header/Header'
import './WatchListingHero.css'

const WatchListingHero = () => {
    return (
        <>
            <section className="watch-listing-hero">
                <div className="container" style={{ marginTop: "6rem" }}>
                    <Header
                        topText="WATCHES"
                        mainText="Curated Selection of"
                        highlight="Luxury Timepieces"
                        center={false}
                    />
                    <p className='buy-page-para text-start'>Timeless precision. Modern mastery. A curated auction house for horological excellence, where every tick tells a story of heritage and innovation.</p>
                </div>
            </section>
        </>
    )
}

export default WatchListingHero