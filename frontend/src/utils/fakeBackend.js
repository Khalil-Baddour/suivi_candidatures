// fakeBackend.js
// A tiny client-side backend simulator backed by localStorage.
// Provides async CRUD helpers with small artificial latency.

const STORAGE_KEY = "internship_applications_v1";
const DEFAULT_LATENCY_MS = 250;

const DEFAULT_DATA = [
  {
    id: "app_001",
    company: "OpenTech",
    contact: "Claire Martin",
    email: "claire.martin@opentech.io",
    position: "Stagiaire Frontend",
    status: "SENT",
    nextAction: "Relancer",
    nextActionDate: "2026-02-01",
    city: "Paris"
  },
  {
    id: "app_002",
    company: "DataForge",
    contact: "Thomas Bernard",
    email: "thomas.bernard@dataforge.fr",
    position: "Stagiaire Fullstack",
    status: "INTERVIEW",
    nextAction: "Préparer l’entretien",
    nextActionDate: "2026-01-20",
    city: "Lyon"
  },
  {
    id: "app_003",
    company: "GreenSoft",
    contact: "Sarah Lopez",
    email: "sarah@greensoft.org",
    position: "Stagiaire React",
    status: "REJECTED",
    nextAction: "Aucune",
    nextActionDate: null,
    city: "Remote"
  },
  {
    id: "app_004",
    company: "CloudNova",
    contact: "Julien Roche",
    email: "julien.roche@cloudnova.com",
    position: "Stagiaire Backend",
    status: "TO_APPLY",
    nextAction: "Envoyer la candidature",
    nextActionDate: "2026-01-18",
    city: "Toulouse"
  },
  {
    id: "app_005",
    company: "FinEdge",
    contact: "Nicolas Petit",
    email: "nicolas.petit@finedge.fr",
    position: "Stagiaire Frontend",
    status: "NO_RESPONSE",
    nextAction: "Relancer",
    nextActionDate: "2026-01-25",
    city: "Paris"
  }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...DEFAULT_DATA];
  const data = safeJsonParse(raw, null);
  return Array.isArray(data) ? data : [...DEFAULT_DATA];
}

function saveAll(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function ensureSeeded() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null) saveAll(DEFAULT_DATA);
}

function generateId(prefix = "app") {
  const rand = Math.random().toString(16).slice(2, 8);
  const now = Date.now().toString(16);
  return `${prefix}_${now}_${rand}`;
}

function validatePatch(patch) {
  const allowedKeys = new Set([
    "company",
    "contact",
    "email",
    "position",
    "status",
    "nextAction",
    "nextActionDate",
    "city"
  ]);

  for (const key of Object.keys(patch)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Unknown field in patch: ${key}`);
    }
  }
}

export function createFakeBackend(options = {}) {
  const latencyMs = typeof options.latencyMs === "number" ? options.latencyMs : DEFAULT_LATENCY_MS;
  ensureSeeded();

  return {
    async listApplications() {
      await sleep(latencyMs);
      return loadAll();
    },

    async getApplication(id) {
      await sleep(latencyMs);
      const all = loadAll();
      const found = all.find((a) => a.id === id);
      if (!found) throw new Error(`Not found: ${id}`);
      return found;
    },

    async createApplication(payload) {
      await sleep(latencyMs);

      const required = ["company", "contact", "email", "position", "status"];
      for (const k of required) {
        if (!payload || typeof payload[k] !== "string" || payload[k].trim() === "") {
          throw new Error(`Missing required field: ${k}`);
        }
      }

      const all = loadAll();
      const created = {
        id: generateId(),
        company: payload.company,
        contact: payload.contact,
        email: payload.email,
        position: payload.position,
        status: payload.status,
        nextAction: typeof payload.nextAction === "string" ? payload.nextAction : "Aucune",
        nextActionDate: payload.nextActionDate ?? null,
        city: typeof payload.city === "string" ? payload.city : ""
      };

      all.unshift(created);
      saveAll(all);
      return created;
    },

    async updateApplication(id, patch) {
      await sleep(latencyMs);
      if (!patch || typeof patch !== "object") throw new Error("Patch must be an object");

      validatePatch(patch);

      const all = loadAll();
      const idx = all.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error(`Not found: ${id}`);

      const updated = { ...all[idx], ...patch, id };
      all[idx] = updated;
      saveAll(all);
      return updated;
    },

    async deleteApplication(id) {
      await sleep(latencyMs);
      const all = loadAll();
      const next = all.filter((a) => a.id !== id);
      if (next.length === all.length) throw new Error(`Not found: ${id}`);
      saveAll(next);
      return { ok: true };
    },

    async reset() {
      await sleep(latencyMs);
      saveAll(DEFAULT_DATA);
      return { ok: true };
    },

    async clear() {
      await sleep(latencyMs);
      localStorage.removeItem(STORAGE_KEY);
      return { ok: true };
    },

    storageKey: STORAGE_KEY
  };
}
