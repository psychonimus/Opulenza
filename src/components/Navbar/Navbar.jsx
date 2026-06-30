import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const LOGGED_IN_TABS = [
  { label: 'Concierge', path: '/concierge', activeOn: ['/concierge', '/bidPage', '/watchListing', '/watch', '/sell', '/whiskyListings', '/whisky'] },
  { label: 'Vault',     path: '/vault'     },
  { label: 'Profile',   path: '/profile'   },
]

const Navbar = () => {
  const location = useLocation()
  const isLoggedIn = location.pathname.startsWith('/concierge') ||
    location.pathname.startsWith('/bidPage') ||
    location.pathname.startsWith('/watchListing') ||
    location.pathname.startsWith('/watch') ||
    location.pathname.startsWith('/sell') ||
    location.pathname.startsWith('/whiskyListings') ||
    location.pathname.startsWith('/whisky') ||
    location.pathname.startsWith('/vault') ||
    location.pathname.startsWith('/profile')

  return (
    <div className="navbar-fixed-container">
      <nav className="custom-navbar">
        <ul className="nav-list">

          {/* Logo */}
          <li className="nav-logo-container">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="nav-logo"
            >
              <Link to={isLoggedIn ? '/concierge' : '/'}>
                <img src="/images/opulenza-logo.png" alt="Opulenza" />
              </Link>
            </motion.div>
          </li>

          {/* Logged-in navigation links */}
          {isLoggedIn && LOGGED_IN_TABS.map((tab) => {
            const isActive = tab.activeOn
              ? tab.activeOn.some(p => location.pathname.startsWith(p))
              : location.pathname === tab.path
            return (
              <li key={tab.path} className="nav-item">
                <Link
                  to={tab.path}
                  className={`nav-link-btn ${isActive ? 'active' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="active-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}
                  <span className="nav-text">{tab.label}</span>
                </Link>
              </li>
            )
          })}

        </ul>
      </nav>
    </div>
  )
}

export default Navbar
