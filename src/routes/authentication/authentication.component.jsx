import './authentication.styles.scss'

import { Link } from 'react-router-dom';

import SignUpForm from '../../components/sign-up-form/sign-up-form.component'
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

import { UserContext } from '../../context/user/user.context';
import { useContext, useState } from 'react';

const Authentication = () => {
    const { currentUser } = useContext(UserContext);
    const [showSignIn, setShowSignIn] = useState(true)

    const toggleForm = () => {
        setShowSignIn(!showSignIn)
    }
    return (
        <>
            {
                currentUser ? (
                    <div className='authentication-container'>
                        <div>You have successfully logged in</div>
                        <div>
                            <Link to={'/'}>
                                Back
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='authentication-container'>
                        {showSignIn ? <SignInForm /> : <SignUpForm /> }
                        <div>
                            <p>
                        {showSignIn ? `Don't Have A Username? Create a Username` : 'Already have a Username? Sign In'}
                            </p>
                            <button onClick={toggleForm}>
                                {showSignIn ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </div>    
                )
            }
            
        </>
    )
}

export default Authentication