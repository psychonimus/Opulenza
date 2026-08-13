import React from 'react'
import Header from '../../../Header/Header'
import './BidPageHero.css'

const BidPageHero = () => {
    return (
        <>
            <section className="bid-hero">
                <div className="container" style={{ marginTop: "6rem" }}>
                    <Header
                        topText="RESERVES"
                        mainText=""
                        highlight=" Reserves"
                        center={false}
                        eyebrow={false}

                    />
                    <p className='buy-page-para text-start'>Each reserve opens a door to a different world of discovery, craftsmanship, and exceptional finds.</p>


                </div>



            </section>
        </>
    )
}

export default BidPageHero