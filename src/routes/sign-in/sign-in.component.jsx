import { signInWithGooglePopup } from '../../utils/firebase/firebase.utils'

import Button from '../../components/button/button.component'

const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response)
}

const SignIn = () => {
    return (
        <div>
            <button onClick={logGoogleUser}>Click</button>
        </div>
    )
}

export default SignIn