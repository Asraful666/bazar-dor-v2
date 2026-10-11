import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalForMongo = globalThis as unknown as {
  bazarDorMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.bazarDorMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

globalForMongo.bazarDorMongoClient = mongoClient;

export const db = mongoClient.db(
  process.env.MONGODB_DB_NAME || "bazar-dor-v2"
);