import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './Message';
import { Message as MessageType, ChatState } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'ws://localhost:8080';

export const Chat: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    userId: localStorage.getItem('userId'),
    isConnected: false,
  });
  const [inputMessage, setInputMessage] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentBotMessageRef = useRef<MessageType | null>(null);
  const lastUserMessageRef = useRef<string>('');

  useEffect(() => {
    if (!state.userId) {
      const newUserId = uuidv4();
      localStorage.setItem('userId', newUserId);
      setState(prev => ({ ...prev, userId: newUserId }));
    }

    const ws = new WebSocket(BACKEND_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }));
      if (state.userId) {
        ws.send(JSON.stringify({ type: 'init', userId: state.userId }));
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'history') {
        setState(prev => ({
          ...prev,
          messages: message.messages,
        }));
        return;
      }

      if (message.sender === 'bot') {
        if (!currentBotMessageRef.current) {
          // 새로운 봇 메시지 시작
          currentBotMessageRef.current = {
            id: uuidv4(),
            content: message.content,
            sender: 'bot',
            timestamp: Date.now(),
          };
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, currentBotMessageRef.current!],
          }));
        } else {
          // 기존 봇 메시지에 내용 추가
          currentBotMessageRef.current.content += message.content;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === currentBotMessageRef.current!.id
                ? currentBotMessageRef.current!
                : msg
            ),
          }));
        }
      } else if (message.content !== lastUserMessageRef.current) {
        // 사용자 메시지 처리 (중복 체크)
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
        lastUserMessageRef.current = message.content;
        // 새로운 사용자 메시지가 오면 봇 메시지 참조 초기화
        currentBotMessageRef.current = null;
      }
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    return () => {
      ws.close();
    };
  }, [state.userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const message: MessageType = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: Date.now(),
    };

    // 메시지 전송 전에 lastUserMessageRef 업데이트
    lastUserMessageRef.current = inputMessage;

    wsRef.current.send(JSON.stringify({
      type: 'message',
      userId: state.userId,
      message: inputMessage,
    }));

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    setInputMessage('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        marginBottom: '20px',
      }}>
        {state.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{
        display: 'flex',
        gap: '10px',
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #dee2e6',
          }}
        />
        <button
          type="submit"
          disabled={!state.isConnected}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: state.isConnected ? 'pointer' : 'not-allowed',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}; 