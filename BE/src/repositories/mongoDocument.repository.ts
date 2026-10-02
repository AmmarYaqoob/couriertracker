import type { Model } from "mongoose";
import type { CreateDocument, DocumentKind, DocumentRecord } from "../domain/document";
import type { ComplianceDocument, ComplianceDocumentSchema } from "../models/document.model";
import type { DocumentRepository } from "./document.repository";

function toRecord(doc: ComplianceDocument): DocumentRecord {
  return {
    id: doc.code,
    riderId: doc.riderId,
    riderName: doc.riderName,
    kind: doc.kind as DocumentKind,
    reference: doc.reference,
    issuedOn: doc.issuedOn,
    expiresOn: doc.expiresOn,
    fileName: doc.fileName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toDoc(data: CreateDocument) {
  return {
    code: data.id,
    riderId: data.riderId,
    riderName: data.riderName,
    kind: data.kind,
    reference: data.reference,
    issuedOn: data.issuedOn,
    expiresOn: data.expiresOn,
    fileName: data.fileName,
  };
}

export class MongoDocumentRepository implements DocumentRepository {
  constructor(private readonly documents: Model<ComplianceDocumentSchema>) {}

  async count(): Promise<number> {
    return this.documents.countDocuments();
  }

  async insertMany(rows: CreateDocument[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.documents.insertMany(rows.map(toDoc));
    return docs.length;
  }

  async list(): Promise<DocumentRecord[]> {
    const docs = await this.documents.find().sort({ riderId: 1, kind: 1 });
    return docs.map(toRecord);
  }

  async findByCode(code: string): Promise<DocumentRecord | null> {
    const doc = await this.documents.findOne({ code });
    return doc ? toRecord(doc) : null;
  }
}
