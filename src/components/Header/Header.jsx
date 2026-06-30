import React from 'react'
import "./Header.css"

const Header = ({topText, mainText, highlight,center}) => {
    return (
        <>
            <div className="header">
                <p className={`header-top ${center ? 'justify-content-center' : 'justify-content-start'}`}> <span></span>{topText}<span></span></p>
                <h2 className={`header-main d-flex ${center ? 'justify-content-center' : 'justify-content-start'}`}>{mainText} <span> {highlight}</span></h2>
            </div>
        </>
    )
}

export default Header