import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800">
        Hello, my name is Aniket
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        This is your newly set up React project!
      </p>

      <h2 className="text-2xl font-semibold mt-6">📌 What's Included:</h2>
      <ul className="list-disc text-gray-700 mt-2">
        <li>React + Tailwind CSS</li>
        <li>React Router</li>
        <li>React Icons</li>
      </ul>

      <div className="mt-6 flex space-x-4">
        <a
          href="https://github.com/Aniket-8719"
          className="text-gray-600 text-2xl"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/aniket-savita-bb295a230/"
          className="text-blue-600 text-2xl"
        >
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
};

export default Home;
