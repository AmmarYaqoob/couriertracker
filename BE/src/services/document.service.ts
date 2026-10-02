import {
  DOCUMENT_AS_OF,
  DOCUMENT_KINDS,
  DOCUMENT_LABELS,
  DOCUMENT_LEGAL,
  DOCUMENT_NAMES,
  daysLeftLabel,
  daysUntilExpiry,
  expiryBand,
  isDocumentBand,
  isDocumentKind,
  type DocumentBand,
  type DocumentKind,
  type DocumentRecord,
} from "../domain/document";
import { AppError } from "../errors/appError";
import type { DocumentRepository } from "../repositories/document.repository";

export interface DocumentListQuery {
  kind?: string;
  band?: string;
  search?: string;
}

export class DocumentService {
  constructor(private readonly documents: DocumentRepository) {}

  async list(query: DocumentListQuery) {
    const parsed = parseQuery(query);
    const all = await this.documents.list();
    const documents = all
      .map(toView)
      .filter((document) => matches(document, parsed.kind, parsed.band, parsed.search))
      .sort((left, right) => left.daysLeft - right.daysLeft || left.riderId.localeCompare(right.riderId));
    return {
      asOf: DOCUMENT_AS_OF,
      summary: summarize(all),
      kinds: DOCUMENT_KINDS.map((kind) => ({
        value: kind,
        label: DOCUMENT_LABELS[kind],
        name: DOCUMENT_NAMES[kind],
        legal: DOCUMENT_LEGAL[kind],
      })),
      filters: {
        kind: parsed.kind ?? "all",
        band: parsed.band ?? "all",
        search: parsed.search ?? "",
      },
      count: documents.length,
      documents,
    };
  }

  async getById(id: string) {
    const document = await this.documents.findByCode(id);
    if (!document) throw new AppError(404, "Document not found");
    return { document: toView(document) };
  }
}

function parseQuery(query: DocumentListQuery): {
  kind?: DocumentKind;
  band?: DocumentBand;
  search?: string;
} {
  const parsed: { kind?: DocumentKind; band?: DocumentBand; search?: string } = {};
  if (query.kind !== undefined && query.kind.toLowerCase() !== "all") {
    if (!isDocumentKind(query.kind)) throw new AppError(400, "Unknown document kind");
    parsed.kind = query.kind;
  }
  if (query.band !== undefined && query.band.toLowerCase() !== "all") {
    if (!isDocumentBand(query.band)) throw new AppError(400, "Unknown urgency band");
    parsed.band = query.band;
  }
  if (query.search !== undefined) {
    if (query.search.length > 80) throw new AppError(400, "Search must be 80 characters or fewer");
    parsed.search = query.search;
  }
  return parsed;
}

function matches(
  document: ReturnType<typeof toView>,
  kind?: DocumentKind,
  band?: DocumentBand,
  search?: string,
): boolean {
  if (kind && document.kind !== kind) return false;
  if (band && document.band !== band) return false;
  if (!search) return true;
  return `${document.riderName} ${document.riderId}`.toLowerCase().includes(search.toLowerCase());
}

function summarize(documents: DocumentRecord[]) {
  let expired = 0;
  let dueWithin14Days = 0;
  let dueWithin60Days = 0;
  const riders = new Set<string>();
  for (const document of documents) {
    const daysLeft = daysUntilExpiry(document.expiresOn);
    riders.add(document.riderId);
    if (daysLeft < 0) expired += 1;
    if (daysLeft < 14) dueWithin14Days += 1;
    if (daysLeft <= 60) dueWithin60Days += 1;
  }
  return {
    expired,
    dueWithin14Days,
    dueWithin60Days,
    total: documents.length,
    riders: riders.size,
  };
}

function toView(document: DocumentRecord) {
  const daysLeft = daysUntilExpiry(document.expiresOn);
  return {
    id: document.id,
    riderId: document.riderId,
    riderName: document.riderName,
    kind: document.kind,
    kindLabel: DOCUMENT_LABELS[document.kind],
    kindName: DOCUMENT_NAMES[document.kind],
    reference: document.reference,
    issuedOn: document.issuedOn,
    expiresOn: document.expiresOn,
    fileName: document.fileName,
    daysLeft,
    daysLeftLabel: daysLeftLabel(daysLeft),
    band: expiryBand(daysLeft),
  };
}
