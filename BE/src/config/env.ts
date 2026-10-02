import dotenv from "dotenv";

dotenv.config();

function read(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

const port = Number(read("PORT", "4000"));
if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

const sessionTtlHours = Number(read("SESSION_TTL_HOURS", "168"));
if (!Number.isFinite(sessionTtlHours) || sessionTtlHours <= 0) {
  throw new Error("SESSION_TTL_HOURS must be a positive number");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  mongodbUri: read("MONGODB_URI", "mongodb://127.0.0.1:27017/delivery"),
  sessionTtlMs: sessionTtlHours * 60 * 60 * 1000,
};
