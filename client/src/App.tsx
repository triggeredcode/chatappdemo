import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LoginForm } from './components/chat/LoginForm';
import { UserList } from './components/chat/UserList';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { TypingIndicator } from './components/chat/TypingIndicator';
import { useChatContext } from './context/ChatContext';
import { Users } from 'lucide-react';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const { 
    setSocket, 
    socket,
    setCurrentUser, 
    currentUser,
    setUsers,
    addMessage,
    setMessages,
    selectedChat,
    users
  } = useChatContext();

  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('userList', (users) => {
      setUsers(users);
    });

    newSocket.on('message', (message) => {
      addMessage(message);
    });

    newSocket.on('chatHistory', (messages) => {
      setMessages(messages);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && selectedChat !== 'public') {
      socket.emit('getChatHistory', { with: selectedChat });
    }
  }, [selectedChat, socket]);

  const handleLogin = (username: string) => {
    if (socket && isConnected) {
      socket.emit('login', { username });
      setCurrentUser({
        id: socket.id,
        username,
        isTyping: false
      });
    }
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const selectedChatName = selectedChat === 'public' 
    ? 'Public Chat' 
    : `Chat with ${users.find(u => u.id === selectedChat)?.username}`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile user list */}
      <div className={`
        fixed inset-0 bg-gray-800 z-20 transition-transform duration-300 md:hidden
        ${showUsers ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button
          onClick={() => setShowUsers(false)}
          className="absolute top-4 right-4 text-white"
        >
          ✕
        </button>
        <UserList />
      </div>

      {/* Desktop user list */}
      <div className="hidden md:block">
        <UserList />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow flex items-center justify-between">
          <h1 className="px-4 py-3 text-xl font-semibold flex-1">
            {selectedChatName}
          </h1>
          <button
            onClick={() => setShowUsers(true)}
            className="md:hidden px-4 py-3 text-gray-600 hover:text-gray-900"
          >
            <Users className="w-6 h-6" />
            <span className="sr-only">Show Users</span>
          </button>
        </div>
        <MessageList />
        <TypingIndicator />
        <MessageInput />
      </div>
    </div>
  );
}

export default App;