import type { CreateDocument, DocumentRecord } from "../domain/document";

export interface DocumentRepository {
  count(): Promise<number>;
  insertMany(rows: CreateDocument[]): Promise<number>;
  list(): Promise<DocumentRecord[]>;
  findByCode(code: string): Promise<DocumentRecord | null>;
}
