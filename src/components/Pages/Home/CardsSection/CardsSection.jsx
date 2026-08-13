import React from 'react'
import "./CardsSection.css"
import Header from '../../../Header/Header'

const cards = [
  {
    numeral: 'I',
    title: 'Private Access',
    
  },
  {
    numeral: 'II',
    title: 'Confidentiality',
    description: 'Silence, as a service.',
  },
  {
    numeral: 'III',
    title: 'Prestige',
    
    // active: true,
  },
  {
    numeral: 'IV',
    title: 'Legacy',
    
  },
  
]

const CardsSection = () => {
  return (
    <>
      <section className='cards-container'>
        <div className="container">
          <div className="text-center">
            <Header
            topText="The four tenets"
            mainText="A circle defined by"
            highlight="what it withholds"
            center={true}
            eyebrow={true}
          />
          </div>

          <div className="tenet-cards-row">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`tenet-card ${card.active ? 'tenet-card--active' : ''}`}
              >
                {/* Top row: numeral + dash */}
                <div className="tenet-card__top">
                  <span className="tenet-card__numeral">{card.numeral}</span>
                  <span className="tenet-card__dash"></span>
                </div>

                {/* Bottom row: title + description */}
                <div className="tenet-card__bottom">
                  <h3 className="tenet-card__title">{card.title}</h3>
                  
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default CardsSection