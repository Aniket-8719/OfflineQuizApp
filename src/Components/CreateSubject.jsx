import { useState, useEffect } from 'react';
import { db } from './db';

export default function CreateSubject() {
  const [subjectName, setSubjectName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });

  // Sync current question with index
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    } else {
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0
      });
    }
  }, [currentQuestionIndex, questions]);

  const handleAddQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(opt => !opt)) return;

    const newQuestions = [...questions];
    if (currentQuestionIndex < questions.length) {
      // Update existing question
      newQuestions[currentQuestionIndex] = currentQuestion;
    } else {
      // Add new question
      newQuestions.push({ ...currentQuestion, id: Date.now() });
    }
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(newQuestions.length);
  };

  const handleQuestionNavigation = (direction) => {
    setCurrentQuestionIndex(prev => {
      const newIndex = prev + direction;
      return Math.max(0, Math.min(newIndex, questions.length));
    });
  };

  const handleSaveSubject = async () => {
    if (!subjectName || questions.length === 0) return;
    
    await db.saveSubject({
      name: subjectName,
      questions: questions,
      createdAt: new Date()
    });
    
    setSubjectName('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create New Subject</h2>
        
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Questions ({questions.length} added)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuestionNavigation(-1)}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => handleQuestionNavigation(1)}
                disabled={currentQuestionIndex === questions.length}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {currentQuestionIndex < questions.length 
              ? `Editing question ${currentQuestionIndex + 1} of ${questions.length}`
              : "Adding new question"}
          </p>

          <textarea
            placeholder="Question Text"
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
            className="w-full p-2 border rounded"
          />

          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...currentQuestion.options];
                  newOptions[index] = e.target.value;
                  setCurrentQuestion({...currentQuestion, options: newOptions});
                }}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="radio"
                name="correctOption"
                checked={currentQuestion.correctIndex === index}
                onChange={() => setCurrentQuestion({...currentQuestion, correctIndex: index})}
              />
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentQuestionIndex < questions.length ? "Update Question" : "Add Question"}
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveSubject}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Save Subject
          </button>
        </div>
      </div>
    </div>
  );
}