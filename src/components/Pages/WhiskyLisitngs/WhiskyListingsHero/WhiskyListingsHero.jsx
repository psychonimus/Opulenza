import React from 'react'
import Header from '../../../Header/Header'
import './WhiskyListingsHero.css'

const WhiskyListingsHero = () => {
    return (
        <>
            <section className="whisky-listing-hero">
                <div className="container">
                    <Header
                        topText="RARE VINTAGE WHISKY"
                        mainText="Discover rare and vintage"
                        highlight="Whisky"
                        center={false}

                    />
                </div>
            </section>
        </>
    )
}

export default WhiskyListingsHero