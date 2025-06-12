import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Echo endpoint that streams response word by word
app.post('/echo', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Split message into words and send each word with a delay
  const words = message.split(' ');
  
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 100)); // 0.1 second delay
    res.write(word + ' ');
  }

  res.end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
}); 