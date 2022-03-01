import { initializeApp } from 'firebase/app';
import {
    getDatabase,
    ref,
    remove,
    onValue,
    off,
    update as dbUpdate,
    push as dbPush,
    get as dbGet,
    child as dbChild,
} from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

function dbRef(path?: string | undefined) {
    return ref(database, path);
}

export { app, auth, database, onValue, off, remove, dbUpdate, dbRef, dbPush, dbGet, dbChild };
