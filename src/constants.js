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
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

export const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY