export class BrowserKnowledgeEngine {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "..";
    this.index = null;
    this.cache = new Map();
  }

  async init() {
    const response = await fetch(`${this.baseUrl}/generated/knowledge-index.json`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar knowledge-index.json");
    this.index = await response.json();
    return this;
  }

  ensureReady() {
    if (!this.index) throw new Error("Knowledge Engine no inicializado.");
  }

  list(type) {
    this.ensureReady();
    const records = this.index.byType?.[type] || {};
    return Object.values(records);
  }

  findRecordById(id) {
    this.ensureReady();
    return this.index.byId?.[id] || null;
  }

  findRecordBySlug(type, slug) {
    this.ensureReady();
    return this.index.bySlug?.[`${type}:${slug}`] || null;
  }

  async loadRecord(record) {
    if (!record) return null;
    if (this.cache.has(record.path)) return this.cache.get(record.path);

    const response = await fetch(`${this.baseUrl}/${record.path}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo cargar ${record.path}`);

    const data = await response.json();
    this.cache.set(record.path, data);
    return data;
  }

  async loadById(id) {
    return this.loadRecord(this.findRecordById(id));
  }

  async load(type, slug) {
    return this.loadRecord(this.findRecordBySlug(type, slug));
  }
}
