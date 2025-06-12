import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './db';
import { setupWebSocket } from './websocket';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB().then(() => {
  // Setup WebSocket server
  setupWebSocket(server);

  // Start server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 