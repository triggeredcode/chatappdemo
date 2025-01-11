import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';

export const MessageList: React.FC = () => {
  const { messages, currentUser, selectedChat, users } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages.filter(msg => 
    (selectedChat === 'public' && msg.to === 'public') ||
    (msg.from === selectedChat && msg.to === currentUser?.id) ||
    (msg.from === currentUser?.id && msg.to === selectedChat)
  );

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return 'You';
    return users.find(u => u.id === userId)?.username || 'Unknown User';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map(message => (
        <div
          key={message.id}
          className={`flex ${message.from === currentUser?.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.from === currentUser?.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            <div className="text-sm font-semibold mb-1">
              {getUserName(message.from)}
            </div>
            <p className="break-words">{message.content}</p>
            <div className="text-xs mt-1 opacity-75">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};