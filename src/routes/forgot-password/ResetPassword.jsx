import { useState } from "react";
import { auth } from '../../utils/firebase/firebase.utils'
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleChange = (event) => {
        setEmail(event.target.value);
    }

    const handleResetPassword = async (event) => {
        event.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className='forgot-password-container'>
            {resetSent ? (
                <div className='reset-confirmation'>
                    An email with instructions to reset your password has been sent to your inbox.
                </div>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div className='forgot-password-header'>
                        Forgot Your Password?
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='buttons-container'>
                        <button type='submit'>Reset Password</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default ResetPassword