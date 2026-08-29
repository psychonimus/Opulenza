import React from 'react'
import Header from '../../../Header/Header'
import "./ConciergeHero.css"
import { useUser } from '../../../../services/showUserInfo/ShowUserInfo';

const ConciergeHero = () => {

    const { userInfo } = useUser()


    
    

    
    return (
        <>
            <section className="concierge-hero">
                <div className="container" style={{marginTop:"6rem"}}>
                    <Header
                        topText="The Concierge"
                        mainText="Hello"
                        highlight={userInfo?.firstName}
                        center={false}
                        eyebrow = {false}

                    />
                    {/* <p className='hero-para text-start'>A quiet evening within. The fire is lit, your usual seat is held.</p> */}

                    
                </div>
                

                
            </section>
        </>
    )
}

export default ConciergeHero