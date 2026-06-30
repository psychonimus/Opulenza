import React from 'react'
import Header from '../../../Header/Header'
import "./ConciergeHero.css"

const ConciergeHero = () => {
    return (
        <>
            <section className="concierge-hero">
                <div className="container" style={{marginTop:"6rem"}}>
                    <Header
                        topText="The Concierge"
                        mainText="Welcome"
                        highlight=" Anonymus"
                        center={false}

                    />
                    {/* <p className='hero-para text-start'>A quiet evening within. The fire is lit, your usual seat is held.</p> */}

                    
                </div>
                

                
            </section>
        </>
    )
}

export default ConciergeHero