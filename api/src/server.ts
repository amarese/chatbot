import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

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

  // Add initial delay of 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Split message into words and send each word with delay
  const words = message.split(' ');
  
  for (const word of words) {
    res.write(word + ' ');
    // Increase delay between words to 0.3 seconds
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  res.end();
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
}); 