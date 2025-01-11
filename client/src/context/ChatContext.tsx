import React, { createContext, useContext, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  isTyping: boolean;
}

interface Message {
  id: number;
  content: string;
  from: string;
  to: string;
  timestamp: string;
}

interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
  chatId: string;
}

interface ChatContextType {
  socket: Socket | null;
  currentUser: User | null;
  users: User[];
  messages: Message[];
  selectedChat: string;
  typingStatus: TypingStatus[];
  setSocket: (socket: Socket) => void;
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedChat: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState('public');
  const [typingStatus, setTypingStatus] = useState<TypingStatus[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('typingStatus', (status: TypingStatus) => {
        setTypingStatus(prev => {
          const filtered = prev.filter(s => s.userId !== status.userId);
          if (status.isTyping) {
            return [...filtered, status];
          }
          return filtered;
        });
      });

      return () => {
        socket.off('typingStatus');
      };
    }
  }, [socket]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ChatContext.Provider value={{
      socket,
      currentUser,
      users,
      messages,
      selectedChat,
      typingStatus,
      setSocket,
      setCurrentUser,
      setUsers,
      addMessage,
      setMessages,
      setSelectedChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};