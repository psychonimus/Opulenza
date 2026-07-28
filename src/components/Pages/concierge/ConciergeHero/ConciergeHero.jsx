import React from 'react'
import Header from '../../../Header/Header'
import "./ConciergeHero.css"

const ConciergeHero = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <>
            <section className="concierge-hero">
                <div className="container" style={{marginTop:"6rem"}}>
                    <Header
                        topText="The Concierge"
                        mainText="Hey"
                        highlight={user.role}
                        center={false}

                    />
                    {/* <p className='hero-para text-start'>A quiet evening within. The fire is lit, your usual seat is held.</p> */}

                    
                </div>
                

                
            </section>
        </>
    )
}

export default ConciergeHero