export class BrowserSessionEngine {
  constructor(options = {}) {
    this.currentKey = options.currentKey || "whprs-current-session";
    this.indexKey = options.indexKey || "whprs-session-index";
    this.sessionPrefix = options.sessionPrefix || "whprs-session:";
    this.maxSessions = Number.isInteger(options.maxSessions)
      ? options.maxSessions
      : 50;
  }

  create(symptom, metadata = {}) {
    const now = new Date().toISOString();
    const session = {
      id: `WHPRS-WEB-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      version: "2.0.0",
      knowledgeVersion: metadata.knowledgeVersion || "1.0.0",
      status: "started",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      symptom,
      questionId: metadata.questionId || null,
      answers: [],
      evidence: [],
      matchedRules: [],
      plan: null,
      completedSteps: [],
      stepLog: [],
      result: null
    };

    return this.save(session);
  }

  save(session) {
    if (!session?.id) {
      throw new Error("No se puede guardar una sesión sin ID.");
    }

    session.updatedAt = new Date().toISOString();

    localStorage.setItem(
      `${this.sessionPrefix}${session.id}`,
      JSON.stringify(session)
    );
    localStorage.setItem(this.currentKey, session.id);

    const index = this.readIndex();
    const summary = this.toSummary(session);
    const nextIndex = [
      summary,
      ...index.filter((item) => item.id !== session.id)
    ]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, this.maxSessions);

    localStorage.setItem(this.indexKey, JSON.stringify(nextIndex));

    const validIds = new Set(nextIndex.map((item) => item.id));
    for (const item of index) {
      if (!validIds.has(item.id)) {
        localStorage.removeItem(`${this.sessionPrefix}${item.id}`);
      }
    }

    return session;
  }

  load(id = null) {
    const sessionId = id || localStorage.getItem(this.currentKey);
    if (!sessionId) return null;

    const raw = localStorage.getItem(`${this.sessionPrefix}${sessionId}`);
    if (!raw) {
      if (!id) localStorage.removeItem(this.currentKey);
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  list() {
    return this.readIndex()
      .map((item) => {
        const session = this.load(item.id);
        return session ? this.toSummary(session) : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  setCurrent(id) {
    const session = this.load(id);
    if (!session) return null;
    localStorage.setItem(this.currentKey, id);
    return session;
  }

  remove(id) {
    localStorage.removeItem(`${this.sessionPrefix}${id}`);

    const index = this.readIndex().filter((item) => item.id !== id);
    localStorage.setItem(this.indexKey, JSON.stringify(index));

    if (localStorage.getItem(this.currentKey) === id) {
      localStorage.removeItem(this.currentKey);
    }
  }

  clearCurrent() {
    localStorage.removeItem(this.currentKey);
  }

  clearAll() {
    for (const item of this.readIndex()) {
      localStorage.removeItem(`${this.sessionPrefix}${item.id}`);
    }
    localStorage.removeItem(this.currentKey);
    localStorage.removeItem(this.indexKey);
  }

  exportAll() {
    const sessions = this.list()
      .map((item) => this.load(item.id))
      .filter(Boolean);

    return {
      app: "WinHacks PC Rescue Kit",
      formatVersion: "1.0.0",
      exportedAt: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions
    };
  }

  importAll(payload, options = {}) {
    const replace = options.replace === true;

    if (!payload || !Array.isArray(payload.sessions)) {
      throw new Error("El archivo no contiene una copia válida de sesiones.");
    }

    if (replace) {
      this.clearAll();
    }

    let imported = 0;

    for (const session of payload.sessions) {
      if (!session?.id || !session?.symptom) continue;

      const safeSession = {
        ...session,
        updatedAt: session.updatedAt || new Date().toISOString()
      };

      this.save(safeSession);
      imported++;
    }

    return imported;
  }

  getStats() {
    const items = this.list();
    const finished = items.filter((item) => item.status === "finished");
    const pending = items.filter((item) => item.status !== "finished");
    const scores = finished
      .map((item) => item.healthScore)
      .filter((value) => Number.isFinite(value));

    const bySymptom = {};

    for (const item of items) {
      const name = item.symptom?.name || "Sin clasificar";
      bySymptom[name] = (bySymptom[name] || 0) + 1;
    }

    return {
      total: items.length,
      finished: finished.length,
      pending: pending.length,
      averageScore: scores.length
        ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
        : null,
      bySymptom: Object.entries(bySymptom)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    };
  }

  readIndex() {
    const raw = localStorage.getItem(this.indexKey);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  toSummary(session) {
    const steps = [
      ...(session.plan?.procedures || []),
      ...(session.plan?.validations || [])
    ];

    return {
      id: session.id,
      status: session.status,
      symptom: session.symptom,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      completedAt: session.completedAt || null,
      completedSteps: session.completedSteps?.length || 0,
      totalSteps: steps.length,
      healthScore: session.result?.healthScore ?? null,
      label: session.result?.label || ""
    };
  }
}
