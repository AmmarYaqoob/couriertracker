import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { DOCUMENT_KINDS } from "../domain/document";

const documentSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    riderId: { type: String, required: true, trim: true },
    riderName: { type: String, required: true, trim: true },
    kind: { type: String, required: true, enum: DOCUMENT_KINDS },
    reference: { type: String, required: true, trim: true },
    issuedOn: { type: String, required: true, trim: true },
    expiresOn: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "documents" },
);

documentSchema.index({ riderId: 1, kind: 1 });
documentSchema.index({ kind: 1 });
documentSchema.index({ expiresOn: 1 });

export type ComplianceDocumentSchema = InferSchemaType<typeof documentSchema>;
export type ComplianceDocument = HydratedDocument<ComplianceDocumentSchema>;
export const DocumentModel = model("ComplianceDocument", documentSchema);
