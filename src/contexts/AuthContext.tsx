import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
};

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL)
                    throw new Error('Missing information from Google Account');

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL)
                throw new Error('Missing information from Google Account');

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            });
        }

        // // The signed-in user info.
        // const user = result.user;
        // // This gives you a Google Access Token.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>{children}</AuthContext.Provider>
    );
};