import React, { useState, useEffect, useRef } from 'react'
import './HeroSection.css'

const HeroSection = () => {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const pref = sessionStorage.getItem('audioPreference')
    if (pref) {
      const shouldMute = pref !== 'allow'
      setIsMuted(shouldMute)
      if (videoRef.current) {
        videoRef.current.muted = shouldMute
      }
    } else {
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAudioChoice = (allow) => {
    const shouldMute = !allow
    setIsMuted(shouldMute)
    if (videoRef.current) {
      videoRef.current.muted = shouldMute
      if (!shouldMute) {
        videoRef.current.play().catch(err => {
          console.log("Autoplay play audio failed:", err)
        })
      }
    }
    sessionStorage.setItem('audioPreference', allow ? 'allow' : 'deny')
    setShowPopup(false)
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    if (videoRef.current) {
      videoRef.current.muted = newMutedState
      if (!newMutedState) {
        videoRef.current.play().catch(err => {
          console.log("Play on unmute failed:", err)
        })
      }
    }
    sessionStorage.setItem('audioPreference', newMutedState ? 'deny' : 'allow')
  }

  return (
    <div className="hero-container">
      {/* Background Video */}
      <video ref={videoRef} className="hero-video" autoPlay loop muted playsInline>
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

      {/* Audio Mute/Unmute Toggle Button */}
      <button 
        className="mute-toggle-btn" 
        onClick={toggleMute} 
        aria-label={isMuted ? "Unmute background video" : "Mute background video"}
      >
        {isMuted ? (
          <svg className="mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0 -1.707 -.707L13.586 8H12a3 3 0 0 0 -3 1z"></path>
          </svg>
        ) : (
          <svg className="mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        )}
      </button>

      {/* Audio Experience Popup */}
      {showPopup && (
        <div className="audio-popup-overlay">
          <div className="audio-popup">
            <img src="/images/opulenza-logo.png" alt="Opulenza Logo" className="audio-popup-logo" />
            
            <div className="audio-popup-circle-icon">
              <svg className="audio-popup-speaker" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </div>

            <h2 className="audio-popup-title">Experience Opulenza</h2>
            <p className="audio-popup-desc">
              This site features an immersive audio experience.<br />
              Would you like to enable sound?
            </p>

            <div className="audio-popup-divider"></div>

            <div className="audio-popup-actions">
              <button 
                className="audio-popup-btn audio-popup-btn-allow" 
                onClick={() => handleAudioChoice(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                Enable Sound
              </button>
              <button 
                className="audio-popup-btn audio-popup-btn-deny" 
                onClick={() => handleAudioChoice(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0 -1.707 -.707L13.586 8H12a3 3 0 0 0 -3 1z"></path>
                </svg>
                Stay Muted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroSection