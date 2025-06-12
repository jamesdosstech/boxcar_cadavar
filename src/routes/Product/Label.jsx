import React from 'react'

const Label = ({label, value, func}) => {
  return (
    <div style={{}}>
        <label style={{color: 'white', padding: '20px'}}>{label}:
          <input style={{backgroundColor: 'white'}} value={value || ''} onChange={func} />
        </label>
    </div>
  )
}

export default Label