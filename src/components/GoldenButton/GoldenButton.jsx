import React from 'react'
import './GoldenButton.css'
import {Link} from 'react-router-dom'

const GoldenButton = ({text, link}) => {
  return (
    <>
        <Link to={link}><button className='golden-button'>{text}</button></Link>
       

    </>
  )
}

export default GoldenButton