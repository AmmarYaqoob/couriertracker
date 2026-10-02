import { AppError } from "../errors/appError";

export function parseDefectDescription(input: unknown): string {
  if (typeof input !== "object" || input === null) {
    throw new AppError(400, "Description is required");
  }
  const description = (input as { description?: unknown }).description;
  if (typeof description !== "string" || !description.trim()) {
    throw new AppError(400, "Description is required");
  }
  const text = description.trim();
  if (text.length > 200) {
    throw new AppError(400, "Description is too long");
  }
  return text;
}
