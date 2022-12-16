import { useState, useContext } from 'react';

import './sign-in-form.styles.scss'

import Button from '../button/button.component'
import FormInput from '../../components/form-input/form-input.component';

import { UserContext } from '../../context/user/user.context';

import { signInWithGooglePopup, signInAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;

    // const { setCurrentUser } = useContext(UserContext);
    
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
            const { user } = await signInAuthUserWithEmailAndPassword(
                email,
                password
                ); 
            // setCurrentUser(user);
        } catch(error) {
            switch(error.code) {
                case 'auth/wrong-password':
                    alert('wrong password homie');
                    break;
                case 'auth/user-not-found':
                    alert('you aint in the sys homie');
                    break;
                default:
                    console.log(error);
            }
        }
    }

    const signInWithGoogle = async () => {
        // const {user} = await signInWithGooglePopup();
        // await createUserDocumentFromAuth(user);
        // setCurrentUser(user);
        await signInWithGooglePopup();
    }
    
    return (
        <div className='sign-in-container'>
            <form onSubmit={handleSubmit}>
                <div className='sign-in-header'>
                    Sign In To Chat
                </div>
                <div>
                    <FormInput 
                        type="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        // required
                    />
                </div>
                <div>
                    <FormInput 
                        type="password"
                        label="Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        // required
                    />
                </div>
                <div className='buttons-container'>
                    <Button type='submit'>Sign In</Button>
                    {/* <Button type='button' onClick={signInWithGoogle} buttonType='google'>Google</Button> */}
                </div>
            </form>
        </div>
    )
}

export default SignUpForm