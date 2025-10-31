import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!

if (!MONGODB_URL) {
  throw new Error("Please define MONGO_URL in env variables");
}

let cached = global.mongoose; //cached = ek object jo existing Mongoose connection ya promise ko store karega.
//global.mongoose = ek global storage jahan hum apna MongoDB connection ya promise rakhte hain taaki bar-bar naye connections na bane.
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function connectToDatabase() {
  const opts={
    bufferCommands:true,
    maxPoolSize:10 
  } 
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    mongoose.connect(MONGODB_URL,opts ).
      then(() => mongoose.connection)
  }

  try {
    cached.connection = await cached.promise
  } catch (error) { 
    cached.promise = null
    throw error;
  }
  return cached.connection;
}
