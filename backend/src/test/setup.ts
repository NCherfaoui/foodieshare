/// <reference types="jest" />

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { RedisService } from "../config/redis";

let mongo: MongoMemoryServer;

// Configuration avant tous les tests
beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret"; // Assurez-vous que JWT_SECRET est défini

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(mongoUri);
  }

  // Mock Redis
  jest
    .spyOn(RedisService.prototype, "get")
    .mockImplementation(() => Promise.resolve(null));
  jest
    .spyOn(RedisService.prototype, "set")
    .mockImplementation(() => Promise.resolve());
});

// Nettoyage avant chaque test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Arrêt de MongoDB et nettoyage après tous les tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});