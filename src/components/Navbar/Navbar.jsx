import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'


const LOGGED_IN_TABS = [
  { label: 'Concierge', path: '/concierge', activeOn: ['/concierge', '/bidPage', '/watchListing', '/watch', '/sell', '/whiskyListings', '/whisky', '/cigarsListings', '/cigar', '/penListings', '/pen', '/yachtListings', '/yacht', '/explore'] },
  { label: 'Vault',     path: '/vault'     },
  { label: 'Profile',   path: '/profile'   },
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  // Re-check auth whenever the route changes (covers login / logout navigations)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [location.pathname])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    // localStorage.removeItem('user')
    setIsLoggedIn(false)
    setMenuOpen(false)
    navigate('/')
  }

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

          {/* Desktop: Logged-in navigation links */}
          {isLoggedIn && LOGGED_IN_TABS.map((tab) => {
            const isActive = tab.activeOn
              ? tab.activeOn.some(p => location.pathname.startsWith(p))
              : location.pathname === tab.path
            return (
              <li key={tab.path} className="nav-item nav-item--desktop">
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

      {/* Desktop logout button — fixed to top-right, outside the pill */}
      {isLoggedIn && (
        <motion.button
          id="navbar-logout-btn"
          className="nav-logout-btn nav-logout-btn--desktop"
          onClick={handleLogout}
          title="Log out"
        >
          <svg className="nav-logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="nav-text">Logout</span>
        </motion.button>
      )}

      {/* Mobile hamburger — fixed to top-right, outside the pill */}
      {isLoggedIn && (
        <motion.button
          className="nav-hamburger-btn nav-hamburger-btn--right"
          onClick={() => setMenuOpen(prev => !prev)}
          // whileTap={{ scale: 0.92 }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
        </motion.button>
      )}

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && isLoggedIn && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {LOGGED_IN_TABS.map((tab) => {
              const isActive = tab.activeOn
                ? tab.activeOn.some(p => location.pathname.startsWith(p))
                : location.pathname === tab.path
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {tab.label}
                  {isActive && <span className="nav-mobile-dot" />}
                </Link>
              )
            })}

            <div className="nav-mobile-divider" />

            <button className="nav-mobile-logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
