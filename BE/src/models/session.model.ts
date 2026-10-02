import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SessionSchema = InferSchemaType<typeof sessionSchema>;
export type SessionDocument = HydratedDocument<SessionSchema>;
export const SessionModel = model("Session", sessionSchema);
