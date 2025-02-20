import { useEffect, useState } from 'react';
import { db } from './db';
import { useLocation, useNavigate } from 'react-router-dom';

export default function History() {
  const { state } = useLocation();
  const subject = state?.subject;
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      if (subject?.id) {
        const data = await db.getAttempts(subject.id);
        setHistory(data);
      }
    };
    loadHistory();
  }, [subject]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 hover:underline mb-4"
      >
        ← Back to Subjects
      </button>

      <h2 className="text-2xl font-bold mb-4">{subject?.name} History</h2>
      
      <div className="space-y-4">
        {history.map((attempt, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <p>Date: {new Date(attempt.timestamp).toLocaleString()}</p>
            <p>Score: {attempt.score}/{attempt.total}</p>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-gray-500">No attempts found for this subject</p>
        )}
      </div>
    </div>
  );
}