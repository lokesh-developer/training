import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Message, User, TypingStatus } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { socket, emit, on } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useRef(Date.now().toString()).current;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Join the chat
    emit('user:join', currentUserId);

    // Listen for messages
    on('chat:message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user updates
    on('users:update', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    // Listen for typing status
    on('user:typing', ({ userId, isTyping }: TypingStatus) => {
      setTypingUsers((prev) => {
        if (isTyping && !prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev.filter((id) => id !== userId);
      });
    });

    return () => {
      socket?.off('chat:message');
      socket?.off('users:update');
      socket?.off('user:typing');
    };
  }, [socket, emit, on, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    emit('chat:message', text);
  };

  const getTypingIndicator = () => {
    const typingUserNames = users
      .filter((user) => typingUsers.includes(user.id) && user.id !== currentUserId)
      .map((user) => user.name);

    if (typingUserNames.length === 0) return null;
    if (typingUserNames.length === 1) return `${typingUserNames[0]} is typing...`;
    if (typingUserNames.length === 2) return `${typingUserNames.join(' and ')} are typing...`;
    return 'Several people are typing...';
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.userId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          {getTypingIndicator()}
        </div>
      )}

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};
