import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot';

export interface IMessage {
  userId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const messageSchema = new mongoose.Schema<IMessage>({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  timestamp: { type: Number, required: true },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 