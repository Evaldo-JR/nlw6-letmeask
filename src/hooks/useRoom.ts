import { useEffect, useState } from 'react';

import { useAuth } from './useAuth';
import { dbRef, off, onValue } from '../services/firebase';

type FirebaseQuestions = Record<
    string,
    {
        author: {
            name: string;
            avatar: string;
        };
        content: string;
        isAnswered: boolean;
        isHighlighted: boolean;
        likes: Record<
            string,
            {
                authorId: string;
            }
        >;
    }
>;

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
};

export const useRoom = (roomId: string | undefined) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (!roomId) return;

        const roomRef = dbRef(`rooms/${roomId}`);
        onValue(roomRef, (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(
                        ([key, like]) => like.authorId === user?.id
                    )?.[0],
                };
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        });

        return () => {
            off(roomRef);
        };
    }, [roomId, user?.id]);

    return { questions, title };
};