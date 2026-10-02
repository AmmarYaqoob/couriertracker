import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { ROLES } from "../domain/roles";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ROLES },
    title: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    lastActiveAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });

export type UserSchema = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchema>;
export const UserModel = model("User", userSchema);
