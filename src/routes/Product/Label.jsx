import React from 'react'
import './Label.style.scss'

const Label = ({label, value, func}) => {
  return (
    <div className='form-group'>
        <label className='form-label'>{label}:</label>
        <input className='form-input' value={value || ''} onChange={func} />
    </div>
  )
}

export default Label