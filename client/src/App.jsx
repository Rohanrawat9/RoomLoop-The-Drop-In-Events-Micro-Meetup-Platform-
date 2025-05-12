import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateRoom from './pages/CreateRoom';
import RoomView from './pages/RoomView';
import LoginRegister from './pages/LoginRegister';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/room/:id" element={<RoomView />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;