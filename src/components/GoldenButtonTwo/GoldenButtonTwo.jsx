import React from 'react'
import "./GoldenButtonTwo.css"

const GoldenButtonTwo = ({Text, onClick}) => {
    return (
        <>
            <button onClick={onClick} className="golden-button-two mt-3">{Text}</button>
        </>
    )
}

export default GoldenButtonTwo