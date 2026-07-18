const fs = require("fs-extra");
const path = require("path");

class KnowledgeEngine {
  constructor(options = {}) {
    this.root = options.root || path.join(__dirname, "..");
    this.indexFile = path.join(this.root, "generated", "knowledge-index.json");
    this.index = null;
    this.cache = new Map();
  }

  async init() {
    if (!(await fs.pathExists(this.indexFile))) {
      throw new Error(
        "No existe pc-rescue-kit/generated/knowledge-index.json. Ejecuta: npm run knowledge:index"
      );
    }

    this.index = await fs.readJson(this.indexFile);
    return this;
  }

  ensureReady() {
    if (!this.index) {
      throw new Error("KnowledgeEngine no ha sido inicializado. Usa await engine.init().");
    }
  }

  getSummary() {
    this.ensureReady();

    return {
      generatedAt: this.index.generatedAt,
      totalItems: this.index.totalItems,
      totals: this.index.totals
    };
  }

  list(type) {
    this.ensureReady();

    const records = this.index.byType?.[type];
    return records ? Object.values(records) : [];
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

    if (this.cache.has(record.path)) {
      return this.cache.get(record.path);
    }

    const filePath = path.join(this.root, record.path);

    if (!(await fs.pathExists(filePath))) {
      throw new Error(`El archivo indexado no existe: ${record.path}`);
    }

    const data = await fs.readJson(filePath);
    this.cache.set(record.path, data);
    return data;
  }

  async loadById(id) {
    return this.loadRecord(this.findRecordById(id));
  }

  async load(type, slug) {
    return this.loadRecord(this.findRecordBySlug(type, slug));
  }

  async getById(id) {
    return this.loadById(id);
  }

  async getBySlug(type, slug) {
    return this.load(type, slug);
  }

  async getProcedure(slugOrId) {
    if (String(slugOrId).startsWith("WHPRS-")) {
      return this.loadById(slugOrId);
    }

    return this.load("procedures", slugOrId);
  }

  async getRule(idOrSlug) {
    if (String(idOrSlug).startsWith("RULE-")) {
      return this.loadById(idOrSlug);
    }

    return this.load("rules", idOrSlug);
  }

  async getValidation(idOrSlug) {
    if (String(idOrSlug).startsWith("VAL-")) {
      return this.loadById(idOrSlug);
    }

    return this.load("validations", idOrSlug);
  }

  async search(query, options = {}) {
    this.ensureReady();

    const term = String(query || "").trim().toLowerCase();
    if (!term) return [];

    const types = options.types || Object.keys(this.index.byType || {});
    const limit = Number.isInteger(options.limit) ? options.limit : 20;
    const results = [];

    for (const type of types) {
      for (const record of this.list(type)) {
        const haystack = `${record.id || ""} ${record.slug || ""} ${record.name || ""}`.toLowerCase();

        if (haystack.includes(term)) {
          results.push(record);
        }
      }
    }

    return results.slice(0, limit);
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = KnowledgeEngine;
