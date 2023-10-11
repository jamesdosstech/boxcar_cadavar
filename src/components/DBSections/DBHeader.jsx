import React, { useContext } from 'react'
import { UserContext } from '../../context/user/user.context'

const DBHeader = () => {
    const {currentUser} = useContext(UserContext)
    // console.log(currentUser)
  return (
    <div>
        <p>Welcome to Doosetrain Shop! 
            {currentUser?.displayName && (
                <span>{` Hello ${currentUser?.displayName}!`}</span>
            )}
        </p>
    </div>
  )
}

export default DBHeader