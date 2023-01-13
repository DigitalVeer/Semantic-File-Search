import React from 'react'
import './boxes-spinner.scss'
const BoxesSpinner = ({ color, center }) => {
  return (
    <div
      style={{ '--color': color ? color : '#fff' }}
      className={`spinner boxes ${center ? 'spinner__center' : ''}`}
    ></div>
  )
}

export default BoxesSpinner
