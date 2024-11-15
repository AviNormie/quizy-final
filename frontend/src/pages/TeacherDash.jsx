import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router';

const TeacherDash = () => {
  const navigate = useNavigate()
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const length = quizzes.length
  
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const getAllQuizzes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/quizzes', {
          headers: {
            Authorization: token,
            },
            });
            console.log(response.data);
            setQuizzes(response.data.quizzes);
            } catch (error) {
              console.error(error);
              }
    }
    getAllQuizzes();
  }, [title])
  // Toggle form visibility
  const handleCreateQuizClick = (e) => {
    e.preventDefault();
    setShowQuizForm(!showQuizForm);
  };

  // Handle quiz form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!title || !description) {
      setErrorMessage('Title and description are required.');
      return;
    }

    const quizData = { title, description };

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/quiz',  // Backend URL
        quizData,
        {
          headers: {
            Authorization: token, // Attach JWT token for authentication
          },
        }
      );

      console.log('Quiz created successfully:', response.data);

      setTitle('');
      setDescription('');
      setShowQuizForm(false);
      setErrorMessage(''); 
    } catch (error) {
      if (error.response) {
        console.error('Error creating quiz:', error.response.data);
        setErrorMessage(error.response.data.message || 'Error creating quiz');
      } else {
        console.error('Error creating quiz:', error.message);
        setErrorMessage('Error creating quiz');
      }
    }
  };

  return (
  <>
  <div className='sticky top-0 z-50'>
    <Navbar/>
  </div>
    <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 p-4 text-white bg-blue-900">
        <h2 className="mb-8 text-3xl font-bold">Greetings!</h2>
        <nav className="space-y-4">
          <a href="#" className="block px-4 py-2 text-white bg-blue-700 rounded">Home</a>
          <a href="#" onClick={handleCreateQuizClick} className="block px-4 py-2 text-white bg-blue-700 rounded">
            Create Quiz
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button className="px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-700">Logout</button>
        </header>

        {/* Conditional Rendering of Create Quiz Form */}
        {showQuizForm && (
          <section className="p-6 mb-8 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Create New Quiz</h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block font-medium text-gray-700">Quiz Title</label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  placeholder="Enter quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Quiz Description</label>
                <textarea
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  placeholder="Enter quiz description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <button type="submit" className="px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-700">
                Save Quiz
              </button>
            </form>
          </section>
        )}

        {/* Stats Cards */}
        <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">Total Students</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">Quizzes Created</h3>
            <p className="text-2xl font-bold">{length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">Average Score</h3>
            <p className="text-2xl font-bold">85%</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">Upcoming Quiz</h3>
            <p className="text-2xl font-bold">3 Days Left</p>
          </div>
        </section>

        {/* Additional Content */}
        <section>
          <div className="w-full max-w-5xl mx-auto mt-10">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Available Quizzes</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="flex flex-col justify-between p-6 transition-transform transform bg-white shadow-lg rounded-xl hover:-translate-y-1 hover:shadow-2xl"
          >
            <div>
              <h3 className="mb-3 text-2xl font-semibold text-purple-800">{quiz.title}</h3>
              <p className="mb-2 text-gray-600">{quiz.description}</p>
              <p className="text-sm text-gray-500">Total Questions: {quiz.questions.length}</p>
            </div>

            <button
              onClick={() => navigate(`/question-add/${quiz._id}`)}
              className="px-4 py-2 mt-4 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Add Questions
            </button>
          </div>
        ))}
      </div>
    </div>
        </section>
      </main>
    </div>
    </>
  );
};

export default TeacherDash;