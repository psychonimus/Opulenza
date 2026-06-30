import React from 'react'
import './HeroSection.css'

const HeroSection = () => {
  return (
    <div className="hero-container">
      {/* Background Video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/videos/Opulenza-bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content d-flex flex-column align-items-center">
        <h1 className="hero-title">Access <span>Reserved</span> <br /> for the <span>Exceptional</span></h1>
        <p className='hero-para'>A private digital sanctuary for a selected circle.</p>
        {/* <p className='hero-decor-para'>PRIVATE <span></span>DISCREET <span></span>SOVEREIGN</p> */}
      </div>
    </div>
  )
}

export default HeroSection