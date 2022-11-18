import {intitalizeApp, initializeApp} from 'firebase/app'
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAsxtaefK62L21AezkX6S4sDCRj90lU7DQ",
    authDomain: "doosetrain-52f13.firebaseapp.com",
    projectId: "doosetrain-52f13",
    storageBucket: "doosetrain-52f13.appspot.com",
    messagingSenderId: "279844528484",
    appId: "1:279844528484:web:4d55f1956b7de676c49a71",
    measurementId: "G-DSHDM3JS4Q"
  };

const firebaseApp = initializeApp(firebaseConfig)
const provider = new GoogleAuthProvider();
export const auth = getAuth();

provider.setCustomParameters({
    prompt: 'select_account'
});


export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

