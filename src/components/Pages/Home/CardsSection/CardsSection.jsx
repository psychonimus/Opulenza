import React from 'react'
import "./CardsSection.css"
import Header from '../../../Header/Header'

const cards = [
  {
    numeral: 'I',
    title: 'Private Access',
    description: 'A door without a sign.',
  },
  {
    numeral: 'II',
    title: 'Confidentiality',
    description: 'Silence, as a service.',
  },
  {
    numeral: 'III',
    title: 'Prestige',
    description: 'An address whispered,never spoken.',
    active: true,
  },
  {
    numeral: 'IV',
    title: 'Legacy',
    description: 'Bequeathed, not bought.',
  },
  {
    numeral: 'V',
    title: 'Curated Membership',
    description: 'Selected by hand.Refused by many.',
  },
]

const CardsSection = () => {
  return (
    <>
      <section className='cards-container'>
        <div className="container">
          <Header
            topText="The five tenets"
            mainText="A circle defined by"
            highlight="what it withholds"
            center={true}
          />

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
                  <p className="tenet-card__desc">
                    {card.description.split('\n').map((line, j) => (
                      <React.Fragment key={j}>{line}{j < card.description.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </p>
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