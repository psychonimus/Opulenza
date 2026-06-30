import React, { useState } from 'react'
import "./GoodiesCard.css"
import GoldenButtonTwo from '../../../GoldenButtonTwo/GoldenButtonTwo'
import GiftClaimModal from '../GiftClaimModal/GiftClaimModal'

const GoodiesCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="goodies-card-section py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="h-100 goodies-card-content d-flex flex-column justify-content-center">
                                {/* <h6>EXCLUSIVE ACQUISITION</h6> */}
                                <h2>A Welcome <span>Gesture</span> Awaits</h2>
                                <p>Enjoy a special welcome gift as you begin your journey with us.</p>
                                <GoldenButtonTwo 
                                    Text="CLAIM MY GIFT"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="goodies-card-image d-flex justify-content-center align-items-center">
                                <img src="/images/goodies-card.png" alt="" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <GiftClaimModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    )
}

export default GoodiesCard