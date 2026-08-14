import React from 'react'
import Header from '../../../Header/Header'
import './PenListingHero.css'

const PenListingHero = () => {
    return (
        <>
            <section className="pen-listing-hero">
                <div className="container" style={{ marginTop: '6rem' }}>
                    <Header
                        topText="WRITING INSTRUMENTS"
                        mainText="The Art of the"
                        highlight="Exceptional Pen"
                        center={false}
                        eyebrow={true}
                    />
                    <p className="buy-page-para text-start">
                        Where ink meets legacy. A curated vault of the world's rarest writing instruments — each nib a testament to craft, heritage, and the enduring power of the written word.
                    </p>
                </div>
            </section>
        </>
    )
}

export default PenListingHero
