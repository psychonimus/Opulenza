import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  const navRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

  // stage: 'expanded' | 'collapsingCenter' | 'collapsedRight' | 'expandingCenter'
  const [stage, setStage] = useState('expanded')
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const [rightOffset, setRightOffset] = useState(0)
  const expandScrollY = useRef(0)
  const transitionTimeoutRef = useRef(null)

  const isCollapsed = stage === 'collapsingCenter' || stage === 'collapsedRight'
  const showHamburger = isCollapsed || menuOpen || isMobile

  // Re-check auth whenever the route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [location.pathname])

  // Track window size for mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Calculate pixel shift needed to slide pill to right edge
  const updateRightOffset = useCallback(() => {
    if (!navRef.current) return
    const navWidth = navRef.current.offsetWidth
    const containerWidth = window.innerWidth
    const padding = containerWidth <= 768 ? 16 : 32
    const offset = (containerWidth / 2) - (navWidth / 2) - padding
    setRightOffset(Math.max(0, offset))
  }, [])

  useEffect(() => {
    updateRightOffset()
    window.addEventListener('resize', updateRightOffset)
    return () => window.removeEventListener('resize', updateRightOffset)
  }, [updateRightOffset, stage])

  // Scroll listener for collapse/expand sequence
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollThreshold = 60

      if (scrollY > scrollThreshold) {
        if (stage === 'expanded') {
          if (!isManuallyExpanded) {
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
            setStage('collapsingCenter')
            transitionTimeoutRef.current = setTimeout(() => {
              setStage('collapsedRight')
            }, 250)
          } else if (Math.abs(scrollY - expandScrollY.current) > 15) {
            // User manually expanded, but has started scrolling again -> re-collapse
            setIsManuallyExpanded(false)
            if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
            setStage('collapsingCenter')
            transitionTimeoutRef.current = setTimeout(() => {
              setStage('collapsedRight')
            }, 250)
          }
        }
      } else if (scrollY <= 15) {
        setIsManuallyExpanded(false)
        if (stage === 'collapsedRight') {
          if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
          setStage('expandingCenter')
          transitionTimeoutRef.current = setTimeout(() => {
            setStage('expanded')
          }, 300)
        } else if (stage === 'collapsingCenter') {
          if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
          setStage('expanded')
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [stage, isManuallyExpanded])

  const handleBurgerClick = () => {
    if (isMobile) {
      setMenuOpen(prev => !prev)
      return
    }

    if (stage === 'collapsedRight' || stage === 'collapsingCenter') {
      // Un-collapse: move to center first, then expand
      setIsManuallyExpanded(true)
      expandScrollY.current = window.scrollY
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      setStage('expandingCenter')
      transitionTimeoutRef.current = setTimeout(() => {
        setStage('expanded')
      }, 300)
    } else if (stage === 'expanded' && window.scrollY > 60) {
      // Collapse back: center collapse then slide right
      setIsManuallyExpanded(false)
      setMenuOpen(false)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      setStage('collapsingCenter')
      transitionTimeoutRef.current = setTimeout(() => {
        setStage('collapsedRight')
      }, 250)
    } else {
      // Toggle dropdown menu
      setMenuOpen(prev => !prev)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setMenuOpen(false)
    navigate('/')
  }

  const targetX = stage === 'collapsedRight' ? rightOffset : 0

  return (
    <div className="navbar-fixed-container">
      <motion.nav
        ref={navRef}
        className={`custom-navbar ${isCollapsed ? 'custom-navbar--collapsed' : ''}`}
        animate={{ x: targetX }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 26,
          mass: 0.8
        }}
      >
        <ul className="nav-list">

          {/* Logo */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.li
                className="nav-logo-container"
                initial={{ opacity: 0, width: 0, scale: 0.9 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="nav-logo"
                >
                  <Link to={isLoggedIn ? '/concierge' : '/'}>
                    <img src="/images/opulenza-logo.png" alt="Opulenza" />
                  </Link>
                </motion.div>
              </motion.li>
            )}
          </AnimatePresence>

          {/* Desktop: Logged-in navigation links */}
          <AnimatePresence>
            {!isCollapsed && isLoggedIn && LOGGED_IN_TABS.map((tab) => {
              const isActive = tab.activeOn
                ? tab.activeOn.some(p => location.pathname.startsWith(p))
                : location.pathname === tab.path
              return (
                <motion.li
                  key={tab.path}
                  className="nav-item nav-item--desktop"
                  initial={{ opacity: 0, width: 0, scale: 0.9 }}
                  animate={{ opacity: 1, width: 'auto', scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.9 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
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
                </motion.li>
              )
            })}
          </AnimatePresence>

          {/* Burger menu button inside the navbar pill (visible when collapsed or on mobile) */}
          <AnimatePresence>
            {showHamburger && (
              <motion.li
                className="nav-hamburger-container"
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="nav-hamburger-btn"
                  onClick={handleBurgerClick}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                >
                  <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
                  <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
                  <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
                </button>
              </motion.li>
            )}
          </AnimatePresence>

        </ul>
      </motion.nav>

      {/* Desktop logout button — fixed to top-right, outside the pill */}
      <AnimatePresence>
        {isLoggedIn && !isCollapsed && (
          <motion.button
            id="navbar-logout-btn"
            className="nav-logout-btn nav-logout-btn--desktop"
            onClick={handleLogout}
            title="Log out"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="nav-logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="nav-text">Logout</span>
          </motion.button>
        )}
      </AnimatePresence>

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


