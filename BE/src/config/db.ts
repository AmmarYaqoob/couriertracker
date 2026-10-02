import mongoose from "mongoose";
import { env } from "./env";

const readyStateLabel: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
}

export function dbState(): string {
  return readyStateLabel[mongoose.connection.readyState] ?? "unknown";
}
