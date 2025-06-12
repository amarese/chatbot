import React from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin: '10px 0',
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 15px',
        borderRadius: '15px',
        backgroundColor: isUser ? '#007bff' : '#e9ecef',
        color: isUser ? 'white' : 'black',
      }}>
        {message.content}
      </div>
    </div>
  );
}; 