import { useNavigate } from 'react-router-dom';
import RoomForm from '../components/RoomForm';

function CreateRoom() {
  const navigate = useNavigate();

  const handleCreate = (formData) => {
    // Simulate API call to create room
    console.log('Creating room:', formData);
    alert(`Room "${formData.name}" created successfully!`);
    navigate('/dashboard');
  };

  return (
    <RoomForm onSubmit={handleCreate} onCancel={() => navigate('/dashboard')} />
  );
}

export default CreateRoom;