import React from 'react'
import { createPortal } from 'react-dom'
import './CommonBackdrop.css'

const CommonBackdrop = ({ label = 'Please wait' }) => {
  return createPortal(
    <div className="cb-overlay" aria-live="polite" aria-label={label}>
      <div className="cb-ring-wrap">
        <div className="cb-ring" />
        <div className="cb-ring-inner" />
        <div className="cb-dot" />
      </div>

      <span className="cb-label">{label}</span>

      <div className="cb-bar-wrap">
        <div className="cb-bar" />
      </div>
    </div>,
    document.body
  )
}

export default CommonBackdrop
