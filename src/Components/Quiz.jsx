import { useState, useEffect } from 'react';
import { db } from './db';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Quiz() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const subject = state?.subject;
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [attemptHistory, setAttemptHistory] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (subject) {
            setQuestions(subject.questions);
            loadAttemptHistory();
        }
    }, [subject]);

    const loadAttemptHistory = async () => {
        if (subject?.id) {
            const history = await db.getAttempts(subject.id);
            setAttemptHistory(history);
        }
    };

    useEffect(() => {
        let interval;
        if (!showScoreboard && currentQuestionIndex < questions.length) {
            if (!userAnswers[currentQuestionIndex]) {
                interval = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            handleNextQuestion();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
        return () => clearInterval(interval);
    }, [currentQuestionIndex, showScoreboard, userAnswers, questions.length]);

    const handleAnswerSelect = (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.options[currentQuestion.correctIndex];
        
        setUserAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[currentQuestionIndex] = {
                answer: selectedAnswer,
                isCorrect,
                questionId: currentQuestion.id,
            };
            return updatedAnswers;
        });

        setTimeout(() => handleNextQuestion(), 1500);
    };

    const handleNextQuestion = () => {
        setUserAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            
            if (!updatedAnswers[currentQuestionIndex]) {
                updatedAnswers[currentQuestionIndex] = {
                    answer: null,
                    isCorrect: false,
                    questionId: questions[currentQuestionIndex].id,
                };
            }

            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setTimeLeft(30);
            } else {
                setShowScoreboard(true);
                saveAttempt(updatedAnswers);
            }
            
            return updatedAnswers;
        });
    };

    const saveAttempt = async (answers) => {
        const score = answers.filter(answer => answer?.isCorrect).length;
        const attempt = {
            subjectId: subject.id,
            timestamp: new Date(),
            score,
            total: questions.length,
            details: answers
        };

        await db.saveAttempt(attempt);
        loadAttemptHistory();
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setTimeLeft(30);
        setShowScoreboard(false);
    };

    const handleClearHistory = async () => {
        if (!subject?.id) return;
        
        // Clear all attempts for this subject
        const attempts = await db.getAttempts(subject.id);
        const tx = (await db.initDB()).transaction('attempts', 'readwrite');
        const store = tx.objectStore('attempts');
        
        attempts.forEach(attempt => {
            store.delete(attempt.id);
        });

        tx.oncomplete = () => {
            setAttemptHistory([]);
        };
    };

    if (showScoreboard) {
        const score = userAnswers.filter(answer => answer?.isCorrect).length;
        return (
            <div className="max-w-2xl mx-auto p-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-500 hover:underline mb-4"
                >
                    ← Back to Subjects
                </button>
                
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <p className="text-lg mb-4">
                        Your Score: {score}/{questions.length}
                    </p>
                    <div className='flex justify-start items-center gap-4'>
                        <button
                            onClick={handleRetry}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Retry Quiz
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete All History
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-4">Attempt History</h3>
                <div className="space-y-4">
                    {attemptHistory.map((attempt, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg">
                            <p>Date: {new Date(attempt.timestamp).toLocaleString()}</p>
                            <p>Score: {attempt.score}/{attempt.total}</p>
                        </div>
                    ))}
                    {attemptHistory.length === 0 && (
                        <p className="text-gray-500">No previous attempts found</p>
                    )}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button 
                onClick={() => navigate(-1)}
                className="text-blue-500 hover:underline mb-4"
            >
                ← Back to Subjects
            </button>
            
            <h2 className="text-2xl font-bold mb-4">{subject?.name} Quiz</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded">
                        Time Left: {timeLeft}s
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = userAnswers[currentQuestionIndex]?.answer === option;
                        const isCorrect = index === currentQuestion.correctIndex;
                        let bgColor = 'bg-white hover:bg-gray-50';
                        
                        if (userAnswers[currentQuestionIndex]) {
                            if (isSelected) {
                                bgColor = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                            } else if (isCorrect) {
                                bgColor = 'bg-green-500 text-white';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={!!userAnswers[currentQuestionIndex]}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${bgColor} ${
                                    !userAnswers[currentQuestionIndex] ? 'hover:bg-gray-100' : ''
                                }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}