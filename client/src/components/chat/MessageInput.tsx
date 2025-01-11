import React, { useState, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Send } from 'lucide-react';
import { debounce } from '../../lib/utils';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { socket, selectedChat } = useChatContext();

  // Debounced typing indicator
  const debouncedTypingStatus = useCallback(
    debounce((typing: boolean) => {
      socket?.emit('typing', { to: selectedChat, isTyping: typing });
      setIsTyping(typing);
    }, 500),
    [socket, selectedChat]
  );

  const handleTyping = () => {
    if (!isTyping) {
      socket?.emit('typing', { to: selectedChat, isTyping: true });
      setIsTyping(true);
    }
    debouncedTypingStatus(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit('sendMessage', {
      content: message,
      to: selectedChat,
    });

    setMessage('');
    setIsTyping(false);
    socket.emit('typing', { to: selectedChat, isTyping: false });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 bg-white border-t"
      aria-label="Message input form"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Message input"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};