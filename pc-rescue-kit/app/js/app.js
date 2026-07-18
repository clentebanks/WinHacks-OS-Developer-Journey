import { BrowserKnowledgeEngine } from "../../browser/knowledge-engine.browser.js";
import { BrowserDecisionEngine } from "../../browser/decision-engine.browser.js";
import { BrowserSessionEngine } from "../../browser/session-engine.browser.js";
import { loadWinHacksComponents } from "./components-loader.js";

const app = document.querySelector("#app");
const knowledge = new BrowserKnowledgeEngine({ baseUrl: ".." });
const sessions = new BrowserSessionEngine({ maxSessions: 50 });

let decision;
let session = sessions.load();

const symptoms = [
  {
    id: "SYM-PERF-001",
    slug: "pc-lenta",
    name: "PC lenta",
    icon: "⚡",
    active: true,
    questionId: "Q-PERF-001",
    description: "Lentitud general, disco al 100 %, CPU o RAM elevada."
  },
  {
    id: "SYM-BOOT-001",
    slug: "windows-no-inicia",
    name: "Windows no inicia",
    icon: "🧯",
    active: true,
    questionId: "Q-BOOT-001",
    description: "Reparación automática, actualizaciones, controladores y unidad de arranque."
  },
  {
    id: "SYM-BSOD-001",
    slug: "pantalla-azul",
    name: "Pantalla azul",
    icon: "🟦",
    active: true,
    questionId: "Q-BSOD-001",
    description: "Controladores, memoria, fallos aleatorios y cambios recientes."
  },
  {
    id: "SYM-NET-001",
    slug: "sin-internet",
    name: "Sin Internet",
    icon: "🌐",
    active: true,
    questionId: "Q-NET-001",
    description: "DNS, IP, Wi-Fi y conectividad."
  },
  {
    id: "SYM-SEC-001",
    slug: "virus-malware",
    name: "Virus o malware",
    icon: "🛡️",
    active: true,
    questionId: "Q-SEC-001",
    description: "Alertas, cuarentena, archivos sospechosos y amenazas persistentes."
  },
  {
    id: "SYM-GAM-001",
    slug: "gaming-lento",
    name: "Gaming lento",
    icon: "🎮",
    active: true,
    questionId: "Q-GAM-001",
    description: "FPS bajos, stutter, GPU incorrecta y energía."
  }
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-HN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDuration(start, end = new Date().toISOString()) {
  if (!start) return "Sin datos";

  const milliseconds = Math.max(0, new Date(end) - new Date(start));
  const minutes = Math.max(1, Math.round(milliseconds / 60000));

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} h ${remaining} min` : `${hours} h`;
}

function setView(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getCurrentSession() {
  session = sessions.load();
  return session;
}

function getSessionStatusLabel(status) {
  const labels = {
    started: "Iniciada",
    diagnosing: "En diagnóstico",
    "plan-generated": "Plan generado",
    finished: "Finalizada",
    "no-match": "Sin plan"
  };
  return labels[status] || status || "Desconocido";
}

function getResultMessage() {
  if (!session) return "";

  switch (session.symptom.id) {
    case "SYM-NET-001":
      return "Has completado el diagnóstico guiado de conectividad. Comprueba la estabilidad de la red durante los próximos minutos.";
    case "SYM-SEC-001":
      return "Has completado el diagnóstico guiado de seguridad. Revisa nuevamente el Historial de protección después del próximo reinicio.";
    case "SYM-BOOT-001":
      return "Has completado el diagnóstico guiado de arranque. Si la unidad no fue detectada o Windows sigue sin iniciar, evita más cambios y busca asistencia técnica.";
    case "SYM-BSOD-001":
      return "Has completado el diagnóstico guiado de pantalla azul. Conserva el código de detención y comprueba la estabilidad durante varios reinicios.";
    case "SYM-GAM-001":
      return "Has completado el diagnóstico guiado de gaming. Compara FPS, estabilidad y temperatura usando la misma escena del juego.";
    default:
      return "Has completado el diagnóstico guiado de rendimiento. Supervisa nuevamente el recurso detectado y repite el análisis si la lentitud regresa.";
  }
}

function renderWelcome() {
  session = sessions.load();
  const historyCount = sessions.list().length;

  setView(`
    <section class="hero">
      <span class="eyebrow">Sistema profesional de rescate</span>
      <h1>Recupera tu PC siguiendo el orden correcto.</h1>
      <p>Diagnostica, repara y valida Windows sin optimizadores milagro, scripts desconocidos ni cambios al azar.</p>
      <div class="actions">
        <button class="btn btn-primary" id="start">Iniciar diagnóstico</button>
        ${session ? '<button class="btn btn-secondary" id="resume">Continuar sesión</button>' : ""}
        <button class="btn btn-secondary" id="history">Historial ${historyCount ? `(${historyCount})` : ""}</button>
        <button class="btn btn-secondary" id="dashboard">Dashboard</button>
      </div>
    </section>

    <div class="grid">
      <article class="card">
        <span class="badge">1</span>
        <h3>Diagnóstico primero</h3>
        <p>El sistema recopila evidencias antes de recomendar una reparación.</p>
      </article>
      <article class="card">
        <span class="badge">2</span>
        <h3>Plan personalizado</h3>
        <p>Las reglas convierten tus respuestas en un orden técnico de trabajo.</p>
      </article>
      <article class="card">
        <span class="badge">3</span>
        <h3>Expediente técnico</h3>
        <p>Cada sesión queda guardada para reanudarla, revisarla o imprimir su reporte.</p>
      </article>
    </div>
  `);

  document.querySelector("#start").onclick = renderSymptoms;
  document.querySelector("#resume")?.addEventListener("click", resumeSession);
  document.querySelector("#history").onclick = renderHistory;
  document.querySelector("#dashboard").onclick = renderDashboard;
}

function renderSymptoms() {
  setView(`
    <section class="section-head">
      <span class="eyebrow">Paso 1 de 4</span>
      <h2>¿Qué problema tiene tu PC?</h2>
      <p>Selecciona el síntoma principal. Hay seis diagnósticos guiados disponibles.</p>
    </section>

    <div class="grid">
      ${symptoms.map((item) => `
        <button class="card symptom-card" data-symptom="${item.id}">
          <span class="card-icon">${item.icon}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <span class="badge" style="margin-top:16px">Disponible</span>
        </button>
      `).join("")}
    </div>

    <div class="actions">
      <button class="btn btn-secondary" id="back">Volver</button>
    </div>
  `);

  document.querySelectorAll("[data-symptom]").forEach((button) => {
    button.onclick = () => startSymptom(button.dataset.symptom);
  });
  document.querySelector("#back").onclick = renderWelcome;
}

async function startSymptom(symptomId) {
  const config = symptoms.find((item) => item.id === symptomId);
  const symptom = await knowledge.loadById(symptomId);

  session = sessions.create(
    {
      id: symptom.id,
      slug: symptom.slug,
      name: symptom.name
    },
    {
      questionId: config.questionId,
      knowledgeVersion: knowledge.index?.generatedAt || "1.0.0"
    }
  );

  renderQuestion();
}

async function renderQuestion() {
  if (!session) return renderWelcome();

  const question = await knowledge.loadById(
    session.questionId || "Q-PERF-001"
  );

  setView(`
    <div class="progress-wrap">
      <div class="progress-meta">
        <span>Diagnóstico</span>
        <span>25 %</span>
      </div>
      <div class="progress"><span style="width:25%"></span></div>
    </div>

    <section class="card question-card">
      <span class="eyebrow">Paso 2 de 4</span>
      <h2>${escapeHtml(question.text)}</h2>
      <p style="color:var(--muted)">${escapeHtml(getQuestionHint())}</p>

      <div class="options">
        ${question.answers.map((answer, index) => `
          <button class="option" data-answer="${index}">
            ${escapeHtml(answer.label)}
          </button>
        `).join("")}
      </div>
    </section>

    <div class="actions">
      <button class="btn btn-secondary" id="back">Cambiar síntoma</button>
    </div>
  `);

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.onclick = async () => {
      const answer = question.answers[Number(button.dataset.answer)];

      session.answers = [{
        questionId: question.id,
        value: answer.value,
        label: answer.label,
        answeredAt: new Date().toISOString()
      }];

      session.evidence = [...new Set(answer.addsEvidence || [])];
      session.status = "diagnosing";
      sessions.save(session);

      const plan = await decision.buildPlan(session.evidence);

      session.plan = plan;
      session.matchedRules = plan.matchedRules || [];
      session.status = plan.status;
      session.completedSteps = [];
      sessions.save(session);

      plan.status === "plan-generated"
        ? renderPlan()
        : renderNoMatch();
    };
  });

  document.querySelector("#back").onclick = renderSymptoms;
}

function getQuestionHint() {
  switch (session?.symptom?.id) {
    case "SYM-NET-001":
      return "Selecciona la situación que mejor describe la conexión de este equipo.";
    case "SYM-SEC-001":
      return "No restaures archivos en cuarentena ni ejecutes herramientas desconocidas durante el diagnóstico.";
    case "SYM-BOOT-001":
      return "No formatees, reinstales Windows ni cambies opciones de BIOS/UEFI sin confirmar primero la causa.";
    case "SYM-BSOD-001":
      return "Anota el código de detención si aparece. No uses limpiadores de registro ni actualizadores automáticos.";
    case "SYM-GAM-001":
      return "Compara siempre el mismo juego, escena y configuración. No instales optimizadores desconocidos.";
    default:
      return "Abre el Administrador de tareas con Ctrl + Shift + Esc y observa la pestaña Procesos.";
  }
}

function allSteps(target = session) {
  if (!target?.plan) return [];

  return [
    ...(target.plan.procedures || []).map((item) => ({
      ...item,
      kind: "procedure"
    })),
    ...(target.plan.validations || []).map((item) => ({
      ...item,
      kind: "validation"
    }))
  ];
}

function renderPlan() {
  const steps = allSteps();
  const completed = steps.filter((_, index) =>
    session.completedSteps?.includes(index)
  ).length;

  const progress = steps.length
    ? Math.round((completed / steps.length) * 100)
    : 0;

  setView(`
    <div class="progress-wrap">
      <div class="progress-meta">
        <span>Plan de rescate</span>
        <span>${progress || 50} %</span>
      </div>
      <div class="progress">
        <span style="width:${progress || 50}%"></span>
      </div>
    </div>

    <section class="section-head">
      <span class="eyebrow">Paso 3 de 4</span>
      <h2>Plan técnico generado</h2>
      <p>Completa los pasos en orden. La sesión se guarda automáticamente.</p>
    </section>

    ${renderSafetyNotice(steps)}

    <div class="plan-list">
      ${steps.map((step, index) => renderStep(step, index)).join("")}
    </div>

    <div class="actions">
      <button class="btn btn-secondary" id="history">Ver historial</button>
      <button class="btn btn-secondary" id="restart">Reiniciar diagnóstico</button>
      <button class="btn btn-primary" id="finish" ${completed !== steps.length ? "disabled" : ""}>
        Ver resultado
      </button>
    </div>
  `);

  document.querySelectorAll("[data-complete]").forEach((button) => {
    button.onclick = () => toggleStep(Number(button.dataset.complete));
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.onclick = async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copiado";
      setTimeout(() => (button.textContent = "Copiar"), 1200);
    };
  });

  document.querySelector("#history").onclick = renderHistory;
  document.querySelector("#restart").onclick = resetApp;
  document.querySelector("#finish").onclick = finishSession;
}

function renderSafetyNotice(steps) {
  if (session.symptom.id === "SYM-BOOT-001") {
    return '<div class="notice">No ejecutes format, clean ni delete desde DiskPart. Si la unidad no aparece, detén el proceso y revisa el hardware.</div>';
  }

  if (steps.some((step) => step.id === "WHPRS-SEC-004")) {
    return '<div class="notice">El examen sin conexión reiniciará el equipo. Guarda todo el trabajo antes de continuar.</div>';
  }

  if (steps.some((step) => step.id === "WHPRS-REP-003")) {
    return '<div class="notice">Antes de ejecutar CHKDSK con reparación, guarda los archivos importantes y asegura una fuente de energía estable.</div>';
  }

  if (session.symptom.id === "SYM-SEC-001") {
    return '<div class="notice">No restaures elementos en cuarentena ni descargues supuestos limpiadores de malware.</div>';
  }

  return '<div class="notice">Completa primero los pasos de diagnóstico. No cierres procesos ni deshabilites aplicaciones que no reconozcas.</div>';
}

function renderStep(step, index) {
  const done = session.completedSteps?.includes(index);
  const command = step.commands?.[0]?.command;

  return `
    <article class="card step-card ${done ? "done" : ""}">
      <span class="step-number">${done ? "✓" : index + 1}</span>

      <div>
        <span class="badge">
          ${step.kind === "validation" ? "Validación" : escapeHtml(step.phase)}
        </span>
        <h3>${escapeHtml(step.name)}</h3>
        <p>${escapeHtml(
          step.goal ||
          step.expected ||
          step.description ||
          "Completa este paso y confirma el resultado."
        )}</p>
        <div class="step-meta">
          Riesgo: ${step.risk || 1}/5
          ${step.estimatedTime ? `· Tiempo: ${escapeHtml(step.estimatedTime)}` : ""}
        </div>

        ${command ? `
          <div class="command-box">
            <code>${escapeHtml(command)}</code>
            <button
              class="copy-btn"
              data-copy="${escapeHtml(command)}"
            >Copiar</button>
          </div>
        ` : ""}
      </div>

      <button
        class="btn ${done ? "btn-secondary" : "btn-primary"} check-btn"
        data-complete="${index}"
      >${done ? "Desmarcar" : "Completar"}</button>
    </article>
  `;
}

function toggleStep(index) {
  session.completedSteps ||= [];
  session.stepLog ||= [];

  if (session.completedSteps.includes(index)) {
    session.completedSteps = session.completedSteps.filter(
      (item) => item !== index
    );
    session.stepLog.push({
      step: index,
      action: "uncompleted",
      at: new Date().toISOString()
    });
  } else {
    session.completedSteps.push(index);
    session.stepLog.push({
      step: index,
      action: "completed",
      at: new Date().toISOString()
    });
  }

  sessions.save(session);
  renderPlan();
}

function finishSession() {
  const steps = allSteps();
  const completed = session.completedSteps?.length || 0;
  const completion = steps.length ? completed / steps.length : 0;

  const healthScore = Math.min(
    100,
    Math.round(70 + completion * 20 + (session.matchedRules?.length ? 5 : 0))
  );

  const label =
    healthScore >= 95 ? "Excelente" :
    healthScore >= 85 ? "Muy bueno" :
    healthScore >= 70 ? "Bueno" :
    "Requiere seguimiento";

  session.status = "finished";
  session.completedAt = new Date().toISOString();
  session.result = {
    healthScore,
    label,
    completedAt: session.completedAt,
    duration: formatDuration(session.createdAt, session.completedAt),
    message: getResultMessage(),
    recommendations: [
      "Conserva este reporte para futuras comparaciones.",
      "Repite el diagnóstico si el síntoma regresa.",
      "No apliques ajustes adicionales sin una nueva evidencia."
    ]
  };

  sessions.save(session);
  renderResult();
}

function renderResult() {
  if (!session) return renderWelcome();

  if (!session.result) {
    return renderPlan();
  }

  setView(`
    <section class="card result-card">
      <span class="eyebrow">Sesión completada</span>
      <h2>Plan de rescate finalizado</h2>

      <div
        class="score-ring"
        style="background:conic-gradient(var(--green) 0 ${session.result.healthScore}%, #172838 ${session.result.healthScore}% 100%)"
      >
        <strong>${session.result.healthScore}</strong>
      </div>

      <h3>Estado: ${escapeHtml(session.result.label)}</h3>
      <p>${escapeHtml(session.result.message)}</p>

      <div class="result-summary">
        <div>
          <span>ID de sesión</span>
          <strong>${escapeHtml(session.id)}</strong>
        </div>
        <div>
          <span>Duración</span>
          <strong>${escapeHtml(session.result.duration)}</strong>
        </div>
        <div>
          <span>Pasos completados</span>
          <strong>${session.completedSteps?.length || 0}/${allSteps().length}</strong>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" id="report">Ver reporte</button>
        <button class="btn btn-secondary" id="history">Historial</button>
        <button class="btn btn-secondary" id="new">Nueva sesión</button>
        <button class="btn btn-secondary" id="home">Inicio</button>
      </div>
    </section>
  `);

  document.querySelector("#report").onclick = () => renderReport(session);
  document.querySelector("#history").onclick = renderHistory;
  document.querySelector("#new").onclick = resetApp;
  document.querySelector("#home").onclick = renderWelcome;
}


function renderDashboard() {
  const stats = sessions.getStats();
  const maxCount = Math.max(1, ...stats.bySymptom.map((item) => item.count));

  setView(`
    <section class="section-head">
      <span class="eyebrow">Panel de control</span>
      <h2>Dashboard de diagnósticos</h2>
      <p>Resumen de los expedientes guardados localmente en este navegador.</p>
    </section>

    <div class="dashboard-grid">
      ${dashboardMetric("Sesiones", stats.total, "Total registrado")}
      ${dashboardMetric("Finalizadas", stats.finished, "Expedientes cerrados")}
      ${dashboardMetric("Pendientes", stats.pending, "Sesiones por continuar")}
      ${dashboardMetric("WHS promedio", stats.averageScore ?? "—", "Health Score")}
    </div>

    <section class="card dashboard-panel">
      <div class="dashboard-panel-head">
        <div>
          <span class="eyebrow">Frecuencia</span>
          <h3>Problemas diagnosticados</h3>
        </div>
        <span class="badge">${stats.total} sesiones</span>
      </div>

      ${stats.bySymptom.length ? `
        <div class="dashboard-bars">
          ${stats.bySymptom.map((item) => `
            <div class="dashboard-bar-row">
              <div class="dashboard-bar-label">
                <span>${escapeHtml(item.name)}</span>
                <strong>${item.count}</strong>
              </div>
              <div class="dashboard-bar-track">
                <span style="width:${Math.max(8, Math.round((item.count / maxCount) * 100))}%"></span>
              </div>
            </div>
          `).join("")}
        </div>
      ` : `
        <div class="empty-dashboard">
          <p>No hay suficientes sesiones para mostrar estadísticas.</p>
        </div>
      `}
    </section>

    <section class="card backup-panel">
      <div>
        <span class="eyebrow">Respaldo</span>
        <h3>Exportar o importar expedientes</h3>
        <p>Guarda una copia JSON para mover el historial a otro navegador o equipo.</p>
      </div>

      <div class="backup-actions">
        <button class="btn btn-primary" id="export-backup">Exportar copia</button>
        <label class="btn btn-secondary file-button">
          Importar copia
          <input type="file" id="import-backup" accept="application/json,.json">
        </label>
      </div>
    </section>

    <div class="actions">
      <button class="btn btn-secondary" id="history">Historial</button>
      <button class="btn btn-primary" id="new-session">Nueva sesión</button>
      <button class="btn btn-secondary" id="home">Inicio</button>
    </div>
  `);

  document.querySelector("#export-backup").onclick = exportSessionBackup;
  document.querySelector("#import-backup").onchange = importSessionBackup;
  document.querySelector("#history").onclick = renderHistory;
  document.querySelector("#new-session").onclick = renderSymptoms;
  document.querySelector("#home").onclick = renderWelcome;
}

function dashboardMetric(label, value, detail) {
  return `
    <article class="card dashboard-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(detail)}</p>
    </article>
  `;
}

function exportSessionBackup() {
  const payload = sessions.exportAll();
  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `winhacks-pc-rescue-sessions-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importSessionBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const replace = confirm(
      "Pulsa Aceptar para reemplazar el historial actual. Pulsa Cancelar para combinar ambas copias."
    );

    const imported = sessions.importAll(payload, { replace });
    alert(`${imported} sesiones importadas correctamente.`);
    session = sessions.load();
    renderDashboard();
  } catch (error) {
    alert(`No se pudo importar la copia: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function renderHistory() {
  const history = sessions.list();

  setView(`
    <section class="section-head">
      <span class="eyebrow">Expedientes técnicos</span>
      <h2>Historial de sesiones</h2>
      <p>Reanuda diagnósticos pendientes, consulta reportes finalizados o elimina expedientes locales.</p>
    </section>

    ${history.length ? `
      <div class="history-list">
        ${history.map((item) => `
          <article class="card history-card">
            <div class="history-main">
              <div class="history-title">
                <span class="card-icon">${getSymptomIcon(item.symptom?.id)}</span>
                <div>
                  <h3>${escapeHtml(item.symptom?.name || "Sesión")}</h3>
                  <p>${escapeHtml(item.id)}</p>
                </div>
              </div>

              <div class="history-meta">
                <span class="status-pill status-${escapeHtml(item.status)}">
                  ${escapeHtml(getSessionStatusLabel(item.status))}
                </span>
                <span>${formatDate(item.updatedAt)}</span>
                <span>${item.completedSteps}/${item.totalSteps} pasos</span>
                ${item.healthScore !== null ? `<span>WHS ${item.healthScore}</span>` : ""}
              </div>
            </div>

            <div class="history-actions">
              <button class="btn btn-primary" data-open="${escapeHtml(item.id)}">
                ${item.status === "finished" ? "Ver reporte" : "Continuar"}
              </button>
              <button class="btn btn-secondary" data-delete="${escapeHtml(item.id)}">
                Eliminar
              </button>
            </div>
          </article>
        `).join("")}
      </div>

      <div class="actions">
        <button class="btn btn-secondary" id="clear-all">Eliminar todo</button>
        <button class="btn btn-secondary" id="dashboard">Dashboard</button>
        <button class="btn btn-primary" id="new-session">Nueva sesión</button>
        <button class="btn btn-secondary" id="home">Inicio</button>
      </div>
    ` : `
      <section class="card empty-state">
        <span class="card-icon">📂</span>
        <h3>Todavía no hay sesiones guardadas</h3>
        <p>Completa o inicia un diagnóstico para crear el primer expediente técnico.</p>
        <div class="actions">
          <button class="btn btn-primary" id="new-session">Iniciar diagnóstico</button>
          <button class="btn btn-secondary" id="home">Inicio</button>
        </div>
      </section>
    `}
  `);

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.onclick = () => openHistorySession(button.dataset.open);
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.delete;
      if (confirm("¿Eliminar esta sesión del historial?")) {
        sessions.remove(id);
        if (session?.id === id) session = null;
        renderHistory();
      }
    };
  });

  document.querySelector("#clear-all")?.addEventListener("click", () => {
    if (confirm("¿Eliminar todas las sesiones guardadas en este navegador?")) {
      sessions.clearAll();
      session = null;
      renderHistory();
    }
  });

  document.querySelector("#dashboard")?.addEventListener("click", renderDashboard);
  document.querySelector("#new-session")?.addEventListener("click", renderSymptoms);
  document.querySelector("#home")?.addEventListener("click", renderWelcome);
}

function openHistorySession(id) {
  session = sessions.setCurrent(id);

  if (!session) {
    return renderNoMatch("La sesión solicitada ya no existe.");
  }

  if (session.status === "finished") {
    return renderReport(session);
  }

  if (session.plan?.status === "plan-generated") {
    return renderPlan();
  }

  renderQuestion();
}

function buildReportText(target) {
  const steps = allSteps(target);
  const lines = [
    "WINHACKS PC RESCUE KIT",
    "REPORTE TÉCNICO",
    "",
    `ID: ${target.id}`,
    `Fecha: ${formatDate(target.createdAt)}`,
    `Finalizado: ${formatDate(target.completedAt)}`,
    `Duración: ${target.result?.duration || formatDuration(target.createdAt, target.updatedAt)}`,
    `Síntoma: ${target.symptom?.name || "Sin datos"}`,
    `Estado: ${target.result?.label || getSessionStatusLabel(target.status)}`,
    `WinHacks Health Score: ${target.result?.healthScore ?? "Pendiente"}`,
    "",
    "RESPUESTAS",
    ...(target.answers?.length
      ? target.answers.map((item) => `- ${item.label}`)
      : ["- Sin respuestas"]),
    "",
    "EVIDENCIAS",
    ...(target.evidence?.length
      ? target.evidence.map((item) => `- ${item}`)
      : ["- Sin evidencias"]),
    "",
    "REGLAS ACTIVADAS",
    ...(target.matchedRules?.length
      ? target.matchedRules.map((item) => `- ${item.id}: ${item.name}`)
      : ["- Sin reglas"]),
    "",
    "PROCEDIMIENTOS Y VALIDACIONES",
    ...steps.map((item, index) =>
      `${target.completedSteps?.includes(index) ? "✓" : "○"} ${index + 1}. ${item.name}`
    ),
    "",
    "RECOMENDACIONES",
    ...(target.result?.recommendations?.length
      ? target.result.recommendations.map((item) => `- ${item}`)
      : ["- Completa la sesión antes de cerrar el expediente."])
  ];

  return lines.join("\n");
}

function renderReport(target) {
  session = target;
  const steps = allSteps(target);

  setView(`
    <section class="report-sheet">
      <header class="report-header">
        <div>
          <span class="eyebrow">WinHacks PC Rescue Kit</span>
          <h1>Reporte técnico</h1>
          <p>Expediente generado y almacenado localmente en este navegador.</p>
        </div>
        <div class="report-score">
          <span>WHS</span>
          <strong>${target.result?.healthScore ?? "—"}</strong>
        </div>
      </header>

      <div class="report-grid">
        ${reportField("ID", target.id)}
        ${reportField("Síntoma", target.symptom?.name || "Sin datos")}
        ${reportField("Inicio", formatDate(target.createdAt))}
        ${reportField("Finalización", formatDate(target.completedAt))}
        ${reportField("Duración", target.result?.duration || formatDuration(target.createdAt, target.updatedAt))}
        ${reportField("Estado", target.result?.label || getSessionStatusLabel(target.status))}
      </div>

      <section class="report-section">
        <h2>Evidencia registrada</h2>
        <ul>
          ${(target.answers || []).map((item) =>
            `<li>${escapeHtml(item.label)}</li>`
          ).join("") || "<li>Sin respuestas registradas.</li>"}
          ${(target.evidence || []).map((item) =>
            `<li><code>${escapeHtml(item)}</code></li>`
          ).join("")}
        </ul>
      </section>

      <section class="report-section">
        <h2>Reglas activadas</h2>
        <ul>
          ${(target.matchedRules || []).map((item) =>
            `<li><strong>${escapeHtml(item.id)}</strong> — ${escapeHtml(item.name)}</li>`
          ).join("") || "<li>Sin reglas registradas.</li>"}
        </ul>
      </section>

      <section class="report-section">
        <h2>Procedimientos y validaciones</h2>
        <div class="report-steps">
          ${steps.map((item, index) => `
            <div class="report-step">
              <span class="${target.completedSteps?.includes(index) ? "report-ok" : "report-pending"}">
                ${target.completedSteps?.includes(index) ? "✓" : "○"}
              </span>
              <div>
                <strong>${index + 1}. ${escapeHtml(item.name)}</strong>
                <p>${escapeHtml(item.goal || item.expected || item.description || "")}</p>
              </div>
            </div>
          `).join("") || "<p>La sesión todavía no tiene un plan.</p>"}
        </div>
      </section>

      <section class="report-section">
        <h2>Recomendaciones</h2>
        <ul>
          ${(target.result?.recommendations || [
            "Completa todos los pasos antes de cerrar el expediente."
          ]).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>

      <div class="actions report-controls">
        <button class="btn btn-primary" id="print">Imprimir / Guardar PDF</button>
        <button class="btn btn-secondary" id="copy-report">Copiar resumen</button>
        <button class="btn btn-secondary" id="history">Historial</button>
        <button class="btn btn-secondary" id="home">Inicio</button>
      </div>
    </section>
  `);

  document.querySelector("#print").onclick = () => window.print();

  document.querySelector("#copy-report").onclick = async (event) => {
    await navigator.clipboard.writeText(buildReportText(target));
    event.currentTarget.textContent = "Resumen copiado";
    setTimeout(() => {
      event.currentTarget.textContent = "Copiar resumen";
    }, 1400);
  };

  document.querySelector("#history").onclick = renderHistory;
  document.querySelector("#home").onclick = renderWelcome;
}

function reportField(label, value) {
  return `
    <div class="report-field">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function getSymptomIcon(id) {
  return symptoms.find((item) => item.id === id)?.icon || "🧰";
}

function renderNoMatch(message = "No encontramos una regla compatible con esta respuesta en la versión actual.") {
  setView(`
    <section class="error">
      <h2>No se pudo generar el plan</h2>
      <p>${escapeHtml(message)}</p>
      <div class="actions">
        <button class="btn btn-primary" id="retry">Volver al diagnóstico</button>
        <button class="btn btn-secondary" id="history">Historial</button>
      </div>
    </section>
  `);

  document.querySelector("#retry").onclick = renderQuestion;
  document.querySelector("#history").onclick = renderHistory;
}

function resumeSession() {
  session = sessions.load();

  if (!session) return renderWelcome();
  if (session.status === "finished") return renderResult();
  if (session.plan?.status === "plan-generated") return renderPlan();

  renderQuestion();
}

function resetApp() {
  sessions.clearCurrent();
  session = null;
  renderSymptoms();
}


function setConnectionState() {
  const banner = document.querySelector("#connection-status");
  if (!banner) return;

  const online = navigator.onLine;
  banner.hidden = online;
  banner.textContent = online
    ? ""
    : "Estás sin conexión. Puedes consultar datos ya cargados, pero algunos recursos podrían no estar disponibles.";
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("./service-worker.js", {
      scope: "./"
    });
  } catch (error) {
    console.warn("No se pudo registrar el Service Worker.", error);
  }
}

function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    console.error("Error no controlado:", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Promesa rechazada:", event.reason);
  });
}

(async function boot() {
  try {
    installGlobalErrorHandlers();
    setConnectionState();
    window.addEventListener("online", setConnectionState);
    window.addEventListener("offline", setConnectionState);

    await Promise.all([
      loadWinHacksComponents(),
      registerServiceWorker(),
      knowledge.init()
    ]);

    decision = new BrowserDecisionEngine(knowledge);
    renderWelcome();
  } catch (error) {
    console.error(error);
    setView(`
      <section class="error">
        <h2>No se pudo iniciar PC Rescue Kit</h2>
        <p>Abre la aplicación mediante un servidor local o desde Netlify. No funcionará correctamente con file://.</p>
        <pre>${escapeHtml(error.message)}</pre>
      </section>
    `);
  }
})();
