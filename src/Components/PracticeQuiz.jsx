import { useEffect, useState } from 'react';
import { db } from './db';
import { Link } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';

export default function PracticeQuiz() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      const data = await db.getAllSubjects();
      setSubjects(data);
    };
    loadSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Subject</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="relative p-4 bg-white rounded-lg shadow-md hover:bg-gray-50">
            <Link
              to={`/quiz/${subject.id}`}
              state={{ subject }}
              className="block"
            >
              <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
              <p>{subject.questions.length} questions</p>
            </Link>
            
            <Link
              to={`/history/${subject.id}`}
              state={{ subject }}
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-500 transition-colors"
              title="View History"
            >
              <FaHistory className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}