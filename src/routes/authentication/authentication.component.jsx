import { useEffect, useState } from 'react';
import './authentication.styles.scss'

import SignUpForm from '../../components/sign-up-form/sign-up-form.component'
import SignInForm from '../../components/sign-in-form/sign-in-form.component'

import { getRedirectResult } from 'firebase/auth'

import { auth, signInWithGooglePopup, createUserDocumentFromAuth, signInWithGoogleRedirect } from '../../utils/firebase/firebase.utils'

import Button from '../../components/button/button.component'

const logGoogleUser = async () => {
    const {user} = await signInWithGooglePopup();
    createUserDocumentFromAuth(user)
}

const Authentication = () => {
    return (
        <div className='authentication-container'>
            <SignUpForm />
            <SignInForm />
        </div>
    )
}

export default Authentication