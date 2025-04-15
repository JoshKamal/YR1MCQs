import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">MCQ Quiz App</h1>
        <p className="mb-4">
          This is a placeholder for the React application. The main application is at:
        </p>
        <a 
          href="/fixed_mcq_quiz_app.html" 
          className="text-blue-500 hover:underline block mb-2"
        >
          Launch MCQ Quiz App
        </a>
      </div>
    </div>
  );
}

export default App;