import { useState } from 'react';

import './sign-in-form.styles.scss'

import Button from '../button/button.component'

import {createAuthUserWithEmailAndPassword, signInWithGooglePopup, signInAuthUserWithEmailAndPassword} from '../../utils/firebase/firebase.utils'

import FormInput from '../../components/form-input/form-input.component';

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value })
    }

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            resetFormFields();
            const { user } = await signInAuthUserWithEmailAndPassword(email,password); 
        } catch(error) {
            if(error.code === 'auth/email-already-in-use') {
                alert('cannot create user, email already in use')
            } else {
                console.log('user create encountered an error ', error)
            }
        }
    }

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();
    }
    
    return (
        <div className='sign-up-container'>
            <form onSubmit={handleSubmit}>
                <div>
                    Sign Up Form
                </div>
                <div>
                    <FormInput 
                        type="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <FormInput 
                        type="password"
                        label="Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='buttons-container'>
                    <Button type='submit'>Sign In</Button>
                    <Button type='button' onClick={signInWithGoogle}>Google</Button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm