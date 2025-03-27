import { PrismaClient } from '@prisma/client';
import mongoose, { Connection } from 'mongoose';

declare global {
  var prisma: PrismaClient | undefined;
}

const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = db;

export default db;

let connection: Connection | null;

export async function connectToDB(): Promise<Connection> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (connection) {
      console.log('Using existing database connection');

      return connection;
    }

    if (!MONGODB_URI) {
      throw new Error('MONGODB URI is missing');
    }

    console.log('Connecting to MongoDB...');
    const mongodbInstance = await mongoose.connect(MONGODB_URI);

    connection = mongodbInstance.connection;

    // Log connection events
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    // Handle process termination gracefully
    process.on('SIGINT', async () => {
      await connection?.close();
      console.log('MongoDB connection closed due to application termination');
      process.exit(0);
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}
