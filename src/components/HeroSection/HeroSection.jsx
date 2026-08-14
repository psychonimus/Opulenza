import React, { useState, useRef } from 'react'
import './HeroSection.css'

const HeroSection = () => {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

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
  }

  return (
    <div className="hero-container">
      {/* Background Video */}
      <video ref={videoRef} className="hero-video" autoPlay loop muted={isMuted} playsInline preload="auto">
        <source src="/videos/Opulenza-bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content d-flex flex-column align-items-center">
        <h1 className="hero-title">Access <span>Reserved</span> <br /> for the <span>Exceptional</span></h1>
        <p className='hero-para'>The Private Reserve for Affluent Collectors</p>
        {/* <p className='hero-decor-para'>PRIVATE <span></span>DISCREET <span></span>SOVEREIGN</p> */}
      </div>

      {/* Audio Mute/Unmute Toggle Button */}
      <button
        className="mute-toggle-btn"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute background video" : "Mute background video"}
      >
        {isMuted ? (
          <svg  height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path id="volume-high-slash" d="m13.75 15v4.33a2.392 2.392 0 0 1 -1.4 2.191 2.4 2.4 0 0 1 -2.586-.348l-1.54-1.312a.75.75 0 1 1 .976-1.142l1.54 1.31a.908.908 0 0 0 .985.132.9.9 0 0 0 .529-.831v-4.33a.75.75 0 0 1 1.5 0zm4.7-4.96a.75.75 0 0 0 -1.434.44 5.217 5.217 0 0 1 -1.313 5.23.75.75 0 0 0 1.061 1.061 6.714 6.714 0 0 0 1.691-6.731zm2.981-3.181a.75.75 0 0 0 -1.315.722 9.273 9.273 0 0 1 -1.578 10.959.75.75 0 1 0 1.062 1.06 10.781 10.781 0 0 0 1.836-12.741zm.099-3.329-18 18a.75.75 0 0 1 -1.06-1.06l2.719-2.72h-1.689a2.253 2.253 0 0 1 -2.25-2.25v-7a2.253 2.253 0 0 1 2.25-2.25h1.77a1.264 1.264 0 0 0 .809-.3l3.686-3.122a2.419 2.419 0 0 1 3.985 1.842v4.519l6.72-6.719a.75.75 0 0 1 1.06 1.06zm-9.28 1.14a.9.9 0 0 0 -.529-.831.906.906 0 0 0 -.988.134l-3.688 3.127a2.774 2.774 0 0 1 -1.775.65h-1.77a.751.751 0 0 0 -.75.75v7a.751.751 0 0 0 .75.75h1.77a2.736 2.736 0 0 1 1.153.267l5.827-5.828z" fill="#c5a059" /></svg>
           ) : (
          <svg className="mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        )}
      </button>
    </div>
  )
}

export default HeroSection