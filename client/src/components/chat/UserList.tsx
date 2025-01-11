import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Users } from 'lucide-react';
import { cn } from '../../lib/utils';

export const UserList: React.FC = () => {
  const { users, currentUser, selectedChat, setSelectedChat } = useChatContext();

  return (
    <div className="w-full md:w-64 bg-gray-800 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-white">
        <Users className="w-5 h-5" />
        <h2 className="font-semibold">Users</h2>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => setSelectedChat('public')}
          className={cn(
            "w-full text-left px-3 py-2 rounded",
            selectedChat === 'public' 
              ? "bg-blue-600 text-white" 
              : "text-gray-300 hover:bg-gray-700"
          )}
        >
          Public Chat
        </button>

        {users
          .filter(user => user.id !== currentUser?.id)
          .map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedChat(user.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded flex items-center justify-between",
                selectedChat === user.id 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              )}
            >
              <span>{user.username}</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </button>
          ))}
      </div>
    </div>
  );
};