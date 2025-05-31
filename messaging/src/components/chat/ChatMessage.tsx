import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn(
        'flex w-full mt-2',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col max-w-[70%] rounded-lg p-3',
          isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        {!isCurrentUser && (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {message.userName}
          </span>
        )}
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-70 mt-1">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
