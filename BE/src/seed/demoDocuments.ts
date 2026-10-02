import type { DocumentRepository } from "../repositories/document.repository";
import { buildPortalDocuments } from "./portalDocuments";

export async function seedDemoDocuments(documents: DocumentRepository): Promise<number> {
  if ((await documents.count()) > 0) return 0;
  return documents.insertMany(buildPortalDocuments());
}
