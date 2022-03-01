import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Question } from '../components/Question';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { dbRef, dbUpdate, remove } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
};

export const AdminRoom = () => {
    const navigate = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        const roomRef = dbRef(`rooms/${roomId}`);
        await dbUpdate(roomRef, {
            endedAt: new Date(),
        });

        navigate('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            const questionRef = dbRef(`rooms/${roomId}/questions/${questionId}`);
            await remove(questionRef);
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const questionRef = dbRef(`rooms/${roomId}/questions/${questionId}`);
        await dbUpdate(questionRef, {
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        const questionRef = dbRef(`rooms/${roomId}/questions/${questionId}`);
        await dbUpdate(questionRef, {
            isHighlighted: true,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map((question) => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCheckQuestionAsAnswered(question.id)
                                            }
                                        >
                                            <img
                                                src={checkImg}
                                                alt="Marcar pergunta como respondida"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};
