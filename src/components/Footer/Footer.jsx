import React from 'react'
import "./Footer.css"
import { FaLinkedin } from "react-icons/fa";
import { TiSocialYoutube } from "react-icons/ti";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <>
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="footer-logo">
                            <img src="/images/opulenza-logo.png" alt="logo" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="footer-links d-flex justify-content-end">
                            <ul>
                                <a href="/privacy">Privacy Policy</a>
                                <a href="/about">About Us</a>
                                <a href="/about">Concierge</a>
                                <a href="/services">Contact</a>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="footer-copyright text-center">
                            <p>Copyright © 2026 Opluenza. All rights reserved.</p>
                        </div>
                    </div>
                    {/* <div className="col-md-6">
                        <div className="footer-social d-flex justify-content-end gap-3">
                            <FaLinkedin />
                            <TiSocialYoutube />
                            <RiInstagramFill />
                            
                        </div>
                    </div> */}
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer