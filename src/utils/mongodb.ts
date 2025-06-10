import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (db && client) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    if (!client) {
      client = new MongoClient(uri, options);
      await client.connect();
      
      await client.db('admin').command({ ping: 1 });
      console.log('Successfully connected to MongoDB');
    }

    const dbName = process.env.MONGODB_DB_NAME;
    db = client.db(dbName);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (client) {
      await client.close();
      client = null;
      db = null;
    }
    throw error;
  }
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

export const withDatabase = async <T>(
  operation: (db: Db) => Promise<T>
): Promise<T> => {
  try {
    const database = await connectToDatabase();
    return await operation(database);
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const database = await connectToDatabase();
    await database.admin().ping();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};