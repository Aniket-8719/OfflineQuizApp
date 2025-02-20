import { FaLinkedin, FaGithub, FaFilePdf } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Quiz Platform</h1>
        <h2 className="text-xl text-gray-800">Welcome to the Interactive Quiz Platform!</h2>
        <p className="text-gray-600 mt-2">
          Create new subjects with questions or practice existing quizzes.
        </p>
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-lg font-semibold">Developed by</h3>
        <p className="text-gray-700 text-lg font-medium">Aniket Savita</p>
        <p className="text-gray-600">MERN Stack Developer</p>
        <div className="mt-3 flex justify-center space-x-6">
          <a
            href="https://www.linkedin.com/in/aniket07013/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FaLinkedin size={24} className="mr-1" />
            LinkedIn
          </a>
          <a
            href="https://github.com/Aniket-8719"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-800 hover:text-gray-600 transition"
          >
            <FaGithub size={24} className="mr-1" />
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/1n9fWMAUOv0mbxAiIy8wmmbWQ2rrzczg4/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-red-600 hover:text-red-800 transition"
          >
            <FaFilePdf size={24} className="mr-1" />
            Resume
          </a>
        </div>
      </div>
    </div>
  );
}
