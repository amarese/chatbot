import { WebSocketServer } from 'ws';
import { Server } from 'http';
import fetch from 'node-fetch';
import { Message, IMessage } from './db';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    let userId: string | null = null;

    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'init') {
          userId = message.userId;
          // Load previous messages
          const previousMessages = await Message.find({ userId }).sort({ timestamp: 1 });
          ws.send(JSON.stringify({ type: 'history', messages: previousMessages }));
          return;
        }

        if (message.type === 'message' && userId) {
          // Save user message
          const userMessage: IMessage = {
            userId,
            content: message.message,
            sender: 'user',
            timestamp: Date.now(),
          };
          await Message.create(userMessage);
          ws.send(JSON.stringify(userMessage));

          // Call API and stream response
          const response = await fetch(`${API_URL}/echo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message.message }),
          });

          if (!response.body) throw new Error('No response body');

          let botMessage = '';
          for await (const chunk of response.body as any) {
            const text = chunk.toString();
            botMessage += text;
            ws.send(JSON.stringify({
              userId,
              content: text,
              sender: 'bot',
              timestamp: Date.now(),
            }));
          }

          // Save complete bot message
          await Message.create({
            userId,
            content: botMessage,
            sender: 'bot',
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'An error occurred while processing your message',
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}; 