import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket } from '../services/socket';
import { addMessage, setTyping } from '../redux/slices/chatSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import { updateRoom } from '../redux/slices/roomSlice';

export const useSocket = (token, roomId) => {
  const dispatch = useDispatch();

  useEffect(import { useEffect, useState } from 'react';
    import io from 'socket.io-client';
    
    const socket = io('http://localhost:3000'); // Replace with your backend URL
    
    export const useSocket = () => {
      const [isConnected, setIsConnected] = useState(socket.connected);
      const [messages, setMessages] = useState([]);
    
      useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('message', (message) => setMessages((prev) => [...prev, message]));
    
        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('message');
        };
      }, []);
    
      const sendMessage = (message) => {
        socket.emit('message', message);
      };
    
      return { socket, isConnected, messages, sendMessage };
    };() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('connect', () => {
      if (roomId) socket.emit('joinRoom', roomId);
    });

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('typing', ({ username, isTyping }) => {
      dispatch(setTyping(isTyping ? username : null));
    });

    socket.on('roomUpdate', (room) => {
      dispatch(updateRoom(room));
    });

    socket.on('newNotification', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, roomId, dispatch]);
};