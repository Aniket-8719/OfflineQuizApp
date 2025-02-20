import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import CreateSubject from './Components/CreateSubject';
import PracticeQuiz from './Components/PracticeQuiz';
import Quiz from './Components/Quiz';
import History from './Components/History';

export default function App() {
  return (
      <div className="max-w-4xl mx-auto p-4">
        <nav className="mb-8">
          <Link to="/" className="text-blue-500 hover:underline mr-4">
            Home
          </Link>
          <Link to="/create" className="text-blue-500 hover:underline mr-4">
            Create Subject
          </Link>
          <Link to="/practice" className="text-blue-500 hover:underline">
            Practice Quiz
          </Link>  
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateSubject />} />
          <Route path="/practice" element={<PracticeQuiz />} />
          <Route path="/quiz/:subjectId" element={<Quiz />} />
          <Route path="/history/:subjectId" element={<History />} />
        </Routes>
      </div>
  );
}