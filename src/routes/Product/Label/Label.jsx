import React from 'react'
import './Label.styles.scss'
const Label = ({label, value, func}) => {
  return (
    <div className='label-container'>
        <label className='label pink'>{label}:
          <input className='input blue' value={value || ''} onChange={func} />
        </label>
    </div>
  )
}

export default Label