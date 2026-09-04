import React from 'react'
import "./Footer.css"
import { Link } from 'react-router-dom'
import { useUser } from '../../services/showUserInfo/ShowUserInfo'

const Footer = () => {
    const { userInfo } = useUser()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main-row">
                    <div className="footer-logo-col">
                        <div className="footer-logo">
                            <Link to="/">
                                <img src="/images/opulenza-logo.png" alt="Opulenza Reserve Logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="footer-links-col">
                        <nav className="footer-links" aria-label="Footer Navigation">
                            <ul>
                                {userInfo && (
                                    <li><Link to="/concierge">Concierge</Link></li>
                                )}
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/terms">Terms & Conditions</Link></li>
                                <li><Link to="/policy">Privacy Policy</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom-row">
                    <div className="footer-copyright">
                        <p>Copyright © 2026 Opulenza Reserve. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer