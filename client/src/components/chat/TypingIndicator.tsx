import React from 'react';
import { useChatContext } from '../../context/ChatContext';

export const TypingIndicator: React.FC = () => {
  const { users, selectedChat, typingStatus } = useChatContext();
  
  // Filter typing users for the current chat
  const typingUsers = typingStatus
    .filter(status => status.chatId === selectedChat)
    .map(status => users.find(u => u.id === status.userId)?.username)
    .filter(Boolean);

  if (typingUsers.length === 0) return null;

  return (
    <div 
      className="px-4 py-2 text-sm text-gray-500"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-1">
        <span className="font-medium">{typingUsers.join(', ')}</span>
        <span>{typingUsers.length === 1 ? 'is' : 'are'} typing</span>
        <div 
          className="flex gap-1 items-baseline" 
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};