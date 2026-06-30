import React from 'react'
import Header from '../../../Header/Header'
import "./cigarListingsHeader.css"

const CigarListingsHeader = () => {
  return (
    <>
        <section className="cigar-listing-header">
            <div className="container">
                <Header
                    topText="RARE HANDCRAFTED CIGARS"
                    mainText="Discover rare and"
                    highlight="handcrafted Cigars"
                    center={false}
                />
            </div>
        </section>
    </>
  )
}

export default CigarListingsHeader