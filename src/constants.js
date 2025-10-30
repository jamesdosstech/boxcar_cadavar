export const trainList = [
    {
        id: 0,
        name: "Thomas",
    },
    {
        id: 1,
        name: "James",
    },
    {
        id: 2,
        name: "Doosetrain",
    },
    {
        id: 3,
        name: "Larry Hoover",
    },
    {
        id: 4,
        name: "Mary the Caboose",
    },
];
export const splashMessage = [
    {
        id: 0,
        welcomeMessage: "welcome to doosetrain, friends",
        subtitle: "live dj streams every Tuesday",
    },
    {
        id: 1,
        welcomeMessage: "welcome to doosetrain, friends",
        subtitle: "you're early! the next show starts in...",
        reminder: "see you friday!",
    },
];

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

export const youtubeApiKey = process.env.YOUTUBE_API_KEY