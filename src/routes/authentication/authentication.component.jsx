import './authentication.styles.scss'

import { Link } from 'react-router-dom';

import SignUpForm from '../../components/sign-up-form/sign-up-form.component'
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

import Splash from '../../routes/splash/splash.component';

import { UserContext } from '../../context/user/user.context';
import { useContext } from 'react';

const Authentication = () => {
    const { currentUser } = useContext(UserContext);

    const date = new Date();
    const dateCopy = new Date(date.getTime());
    const nextFriday = new Date(
        dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
        )
    );  

    const actualNextFriday = nextFriday.getTime();  

    const timeAfterThreeDays = actualNextFriday;
    return (
        <>
            {
                currentUser ? (
                    <div>
                        <Splash targetDate={timeAfterThreeDays} />   
                    </div>
                ) : (
                    <div className='authentication-container'>
                        <SignUpForm />
                        <SignInForm />
                    </div>    
                )
            }
            
        </>
    )
}

export default Authentication