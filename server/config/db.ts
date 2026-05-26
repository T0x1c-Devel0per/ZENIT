import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/steamclean';
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Warning: MongoDB connection failed (${(error as Error).message}). The app will continue running without database functionality.`);
  }
};

export default connectDB;