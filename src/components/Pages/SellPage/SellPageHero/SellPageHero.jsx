import React from 'react'
import Header from '../../../Header/Header'
import "./SellPageHero.css"

const SellPageHero = () => {
  return (
    <>
        <section className="sell-heading">
                <div className="container" style={{marginTop:"8rem"}}>
                    <Header
                        topText="Selling"
                        mainText="What are you"
                        highlight="Offering?"
                        center={false}
                        
                    />
                </div>
            </section>
    </>
  )
}

export default SellPageHero