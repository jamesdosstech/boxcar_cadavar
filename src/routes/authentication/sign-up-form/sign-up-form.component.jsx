import { useState, useContext } from 'react';

// import './sign-up-form.styles.scss';

import Button from '../../../components/button/button.component'
import FormInput from '../../../components/form-input/form-input.component';
import { updateProfile } from 'firebase/auth';
import {createAuthUserWithEmailAndPassword, createUserDocumentFromAuth} from '../../../utils/firebase/firebase.utils'

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
            await updateProfile(user, {
                displayName: displayName
            })
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
        <input
          type="text"
          name="displayName"
          value={displayName}
          onChange={handleChange}
          placeholder="Display Name"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        {/* <div className='buttons-container'> */}
          <button className='nav-link' type='submit'>Submit</button>
        {/* </div> */}
      </form>
    </div>
    )
}

export default SignUpForm