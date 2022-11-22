import { useState, useContext } from 'react';

import './sign-up-form.styles.scss';

import Button from '../button/button.component'
import FormInput from '../../components/form-input/form-input.component';

import {createAuthUserWithEmailAndPassword, createUserDocumentFromAuth} from '../../utils/firebase/firebase.utils'

// import { UserContext } from '../../context/user/user.context';

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {displayName, email, password, confirmPassword} = formFields;
    
    // const {setCurrentUser} = useContext(UserContext);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value })
    }

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        resetFormFields();
        if (password !== confirmPassword) {
            alert('these passwords are not the same B-( ');
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email,password);
            // setCurrentUser(user);
            await createUserDocumentFromAuth( user, { displayName });
            resetFormFields();
        } catch(error) {
            if(error.code === 'auth/email-already-in-use') {
                alert('cannot create user, email already in use')
            } else {
                console.log('user create encountered an error ', error)
            }
        }
    }
    
    return (
        <div className='sign-up-container'>
            <form onSubmit={handleSubmit}>
                <div className='sign-up-header'>
                    Sign Up Form
                </div>
                <div>
                    <FormInput 
                        type="text"
                        label="Display Name"
                        name="displayName"
                        value={displayName}
                        onChange={handleChange} 
                        required 
                    />
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
                <div>
                    <FormInput 
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='buttons-container'>
                    <Button type='submit'>Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm