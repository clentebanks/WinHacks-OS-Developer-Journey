const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

class SessionEngine {
  constructor(options = {}) {
    this.root = options.root || path.join(__dirname, "..");
    this.sessionsDir = path.join(this.root, "sessions");
  }

  async init() {
    await fs.ensureDir(this.sessionsDir);
    return this;
  }

  createSessionId() {
    const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const random = crypto.randomBytes(3).toString("hex");
    return `WHPRS-${stamp}-${random}`;
  }

  getSessionPath(sessionId) {
    return path.join(this.sessionsDir, `${sessionId}.json`);
  }

  async createSession(input = {}) {
    const now = new Date().toISOString();
    const session = {
      id: this.createSessionId(),
      version: "1.0.0",
      status: "started",
      createdAt: now,
      updatedAt: now,
      device: input.device || {},
      symptom: input.symptom || null,
      answers: [],
      evidence: [],
      matchedRules: [],
      plan: {
        status: "not-generated",
        procedures: [],
        validations: [],
        blocked: []
      },
      progress: {
        currentStep: 0,
        completedSteps: 0,
        totalSteps: 0
      },
      history: [
        {
          at: now,
          type: "session-created",
          message: "Sesión de rescate creada."
        }
      ],
      result: null
    };

    await this.save(session);
    return session;
  }

  async save(session) {
    session.updatedAt = new Date().toISOString();
    await fs.writeJson(this.getSessionPath(session.id), session, { spaces: 2 });
    return session;
  }

  async load(sessionId) {
    const file = this.getSessionPath(sessionId);

    if (!(await fs.pathExists(file))) {
      throw new Error(`La sesión no existe: ${sessionId}`);
    }

    return fs.readJson(file);
  }

  async addAnswer(sessionId, answer) {
    const session = await this.load(sessionId);

    session.answers.push({
      questionId: answer.questionId,
      value: answer.value,
      label: answer.label || "",
      at: new Date().toISOString()
    });

    for (const item of answer.evidence || []) {
      if (!session.evidence.includes(item)) {
        session.evidence.push(item);
      }
    }

    session.status = "diagnosing";
    session.history.push({
      at: new Date().toISOString(),
      type: "answer-recorded",
      message: `Respuesta registrada para ${answer.questionId}.`
    });

    return this.save(session);
  }

  async applyPlan(sessionId, plan) {
    const session = await this.load(sessionId);

    session.matchedRules = plan.matchedRules || [];
    session.plan = {
      status: plan.status,
      procedures: (plan.procedures || []).map((item, index) => ({
        ...item,
        order: index + 1,
        state: "pending",
        startedAt: null,
        completedAt: null,
        validatedAt: null,
        notes: ""
      })),
      validations: (plan.validations || []).map((item, index) => ({
        ...item,
        order: (plan.procedures || []).length + index + 1,
        state: "pending",
        completedAt: null,
        notes: ""
      })),
      blocked: plan.blocked || []
    };

    session.progress = {
      currentStep: 1,
      completedSteps: 0,
      totalSteps:
        session.plan.procedures.length +
        session.plan.validations.length
    };

    session.status = "plan-ready";
    session.history.push({
      at: new Date().toISOString(),
      type: "plan-generated",
      message: `Plan generado con ${session.progress.totalSteps} pasos.`
    });

    return this.save(session);
  }

  async updateStep(sessionId, stepId, state, notes = "") {
    const allowedStates = [
      "pending",
      "running",
      "completed",
      "validated",
      "failed",
      "skipped"
    ];

    if (!allowedStates.includes(state)) {
      throw new Error(`Estado no permitido: ${state}`);
    }

    const session = await this.load(sessionId);
    const allSteps = [
      ...session.plan.procedures,
      ...session.plan.validations
    ];

    const step = allSteps.find(
      (item) => item.id === stepId
    );

    if (!step) {
      throw new Error(`Paso no encontrado: ${stepId}`);
    }

    const now = new Date().toISOString();
    step.state = state;
    step.notes = notes;

    if (state === "running" && !step.startedAt) {
      step.startedAt = now;
    }

    if (state === "completed") {
      step.completedAt = now;
    }

    if (state === "validated") {
      step.validatedAt = now;
      step.completedAt = step.completedAt || now;
    }

    const finishedStates = new Set([
      "completed",
      "validated",
      "failed",
      "skipped"
    ]);

    session.progress.completedSteps = allSteps.filter(
      (item) => finishedStates.has(item.state)
    ).length;

    const nextPending = allSteps.find(
      (item) => item.state === "pending"
    );

    session.progress.currentStep = nextPending
      ? nextPending.order
      : session.progress.totalSteps;

    if (allSteps.length && allSteps.every(
      (item) => finishedStates.has(item.state)
    )) {
      session.status = "finished";
    } else if (state === "failed") {
      session.status = "attention-required";
    } else {
      session.status = "in-progress";
    }

    session.history.push({
      at: now,
      type: "step-updated",
      message: `${stepId} cambió a ${state}.`
    });

    return this.save(session);
  }

  async finishSession(sessionId, result = {}) {
    const session = await this.load(sessionId);

    session.status = "finished";
    session.result = {
      completedAt: new Date().toISOString(),
      healthScore: result.healthScore ?? null,
      statusLabel: result.statusLabel || "",
      summary: result.summary || "",
      recommendations: result.recommendations || []
    };

    session.history.push({
      at: new Date().toISOString(),
      type: "session-finished",
      message: "Sesión de rescate finalizada."
    });

    return this.save(session);
  }

  async listSessions() {
    await fs.ensureDir(this.sessionsDir);

    const files = await fs.readdir(this.sessionsDir);
    const sessions = [];

    for (const file of files.filter((name) => name.endsWith(".json"))) {
      const session = await fs.readJson(path.join(this.sessionsDir, file));
      sessions.push({
        id: session.id,
        status: session.status,
        symptom: session.symptom,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        progress: session.progress
      });
    }

    return sessions.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }
}

module.exports = SessionEngine;
