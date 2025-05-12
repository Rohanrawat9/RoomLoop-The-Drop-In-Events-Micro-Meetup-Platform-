import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to RoomLoop</h1>
      <p className="text-gray-600 mb-6">Join or create rooms for dynamic virtual collaboration.</p>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Get Started
      </button>
    </div>
  );
}

export default Home;