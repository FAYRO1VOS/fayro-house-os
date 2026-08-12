/*
 * Strict Schema Validator (P2 Foundation)
 *
 * ../contracts/intent-extraction-contract.md'nin çıktı şemasını doğrular.
 * LLM'in JSON döndürmesi KABUL İÇİN YETERLİ DEĞİL -- tip, zorunlu alan ve
 * enum kontrolü burada yapılır. Hiçbir eksik alan UYDURULMAZ; ya reddedilir
 * ya da INPUT_REQUIRED/NEEDS_CLASSIFICATION ile işaretlenir (fail-closed).
 *
 * Enum kaynakları V1.4 (../../app.js) ve STANDARDS/PRIORITY_STANDARD.md ile
 * BİREBİR aynı tutulmuştur (aşağıdaki listeler bu dosyalardan elle senkronize
 * edildi -- bkz. DESIGN.md "Source of Truth Drift" bölümü, aynı bilinen risk).
 */

const VALID_WORKSPACES = [
  "furkan-brand", "caglayan", "now-saglik", "ciooman",
  "fayro-sales", "yacht", "gallery-opportunity", "personal-ops", "backlog",
];
const VALID_CATEGORIES = ["money", "content", "ads", "leads", "coordination", "production", "pr"];
const VALID_PRIORITIES = ["P0", "P1", "P2", "P3"];
const VALID_PRIMARY_ACTIONS = [
  "RESPONSIBILITY_ALIGNMENT", "CONCERT_CONTENT_SPRINT", "REVIEW",
  "CONTENT_SHOOT_PLAN", "ARCHIVE", "TASK", "UNKNOWN",
];
const VALID_RISK = ["LOW", "HIGH", "UNKNOWN"];

const REQUIRED_TOP_FIELDS = [
  "schema_version", "prompt_version", "provider", "model", "trace_id",
  "created_at", "raw_input", "global_constraints", "intents",
];
const REQUIRED_INTENT_FIELDS = [
  "intent_id", "title", "summary", "workspace", "related_project",
  "related_people", "category", "primary_action", "sub_actions",
  "responsibilities", "prohibited_actions", "priority", "deadline",
  "responsible", "risk_candidate", "approval_candidate",
  "missing_information", "confidence", "semantic_notes",
];

const STATUS = {
  VALID: "VALID",
  INPUT_REQUIRED: "INPUT_REQUIRED",
  NEEDS_CLASSIFICATION: "NEEDS_CLASSIFICATION",
  INVALID_SCHEMA: "INVALID_SCHEMA",
  UNKNOWN_ENTITY: "UNKNOWN_ENTITY",
  UNKNOWN_ACTION: "UNKNOWN_ACTION",
};

function isPlainObject(v) { return typeof v === "object" && v !== null && !Array.isArray(v); }
function isNonEmptyString(v) { return typeof v === "string" && v.length > 0; }
function isIsoDateOrNull(v) {
  if (v === null) return true;
  if (typeof v !== "string") return false;
  return !isNaN(Date.parse(v));
}
function isConfidence(v) { return typeof v === "number" && v >= 0 && v <= 1; }

/**
 * Malformed JSON string'i güvenle parse eder. Hata fırlatmaz.
 * @returns {{ok: boolean, value: any, error: string|null}}
 */
function safeParseJson(text) {
  if (typeof text !== "string") {
    // Zaten obje olarak geldiyse (örn. test'te) doğrudan kabul et.
    if (isPlainObject(text)) return { ok: true, value: text, error: null };
    return { ok: false, value: null, error: "Girdi ne string ne obje." };
  }
  try {
    return { ok: true, value: JSON.parse(text), error: null };
  } catch (e) {
    return { ok: false, value: null, error: "MALFORMED_JSON: " + e.message };
  }
}

/**
 * Tek bir intent'i doğrular. Hiçbir alanı uydurmaz -- eksik/hatalı ise
 * ilgili status ile birlikte döner, sanitizedIntent'te workspace/category
 * gibi güvenilmez alanlar backlog/NEEDS_CLASSIFICATION'a düşürülür.
 */
function validateIntent(intent, index) {
  const errors = [];
  if (!isPlainObject(intent)) {
    return { index, status: STATUS.INVALID_SCHEMA, errors: [`intents[${index}] bir obje değil`], sanitized: null };
  }

  for (const field of REQUIRED_INTENT_FIELDS) {
    if (!(field in intent)) errors.push(`Eksik alan: ${field}`);
  }
  if (errors.length > 0) {
    return { index, status: STATUS.INVALID_SCHEMA, errors, sanitized: null };
  }

  let status = STATUS.VALID;
  const sanitized = { ...intent };

  if (!VALID_WORKSPACES.includes(intent.workspace)) {
    errors.push(`Bilinmeyen workspace: ${intent.workspace}`);
    sanitized.workspace = "backlog";
    status = STATUS.UNKNOWN_ENTITY;
  }
  if (!VALID_CATEGORIES.includes(intent.category)) {
    errors.push(`Bilinmeyen category: ${intent.category}`);
    sanitized.category = null;
    if (status === STATUS.VALID) status = STATUS.NEEDS_CLASSIFICATION;
  }
  if (!VALID_PRIMARY_ACTIONS.includes(intent.primary_action)) {
    errors.push(`Bilinmeyen primary_action: ${intent.primary_action}`);
    sanitized.primary_action = "UNKNOWN";
    status = STATUS.UNKNOWN_ACTION;
  }
  if (intent.priority !== null && intent.priority !== undefined && !VALID_PRIORITIES.includes(intent.priority)) {
    errors.push(`Bilinmeyen priority: ${intent.priority}`);
    sanitized.priority = null;
    if (status === STATUS.VALID) status = STATUS.NEEDS_CLASSIFICATION;
  }
  if (intent.risk_candidate !== null && intent.risk_candidate !== undefined && !VALID_RISK.includes(intent.risk_candidate)) {
    errors.push(`Bilinmeyen risk_candidate: ${intent.risk_candidate}`);
    sanitized.risk_candidate = "UNKNOWN";
  }
  if (!isIsoDateOrNull(intent.deadline)) {
    errors.push(`deadline ISO tarih değil ve null değil: ${intent.deadline}`);
    sanitized.deadline = null; // uydurulmaz, null'a düşer
    if (status === STATUS.VALID) status = STATUS.INPUT_REQUIRED;
  }
  if (!isConfidence(intent.confidence)) {
    errors.push(`confidence 0-1 arası sayı değil: ${intent.confidence}`);
    sanitized.confidence = 0;
    if (status === STATUS.VALID) status = STATUS.NEEDS_CLASSIFICATION;
  }
  if (!isNonEmptyString(intent.title) || !isNonEmptyString(intent.summary)) {
    errors.push("title/summary boş olamaz");
    return { index, status: STATUS.INVALID_SCHEMA, errors, sanitized: null };
  }
  if (!Array.isArray(intent.sub_actions) || !Array.isArray(intent.responsibilities) ||
      !Array.isArray(intent.prohibited_actions) || !Array.isArray(intent.related_people) ||
      !Array.isArray(intent.missing_information)) {
    errors.push("dizi olması gereken bir alan dizi değil (sub_actions/responsibilities/prohibited_actions/related_people/missing_information)");
    return { index, status: STATUS.INVALID_SCHEMA, errors, sanitized: null };
  }

  return { index, status, errors, sanitized };
}

/**
 * Ana giriş noktası. Ham LLM çıktısını (string veya obje) doğrular.
 * @returns {{overallStatus: string, topLevelErrors: string[], intentResults: object[], sanitizedOutput: object|null}}
 */
function validate(rawOutput) {
  const parsed = safeParseJson(rawOutput);
  if (!parsed.ok) {
    return { overallStatus: STATUS.INVALID_SCHEMA, topLevelErrors: [parsed.error], intentResults: [], sanitizedOutput: null };
  }
  const output = parsed.value;
  if (!isPlainObject(output)) {
    return { overallStatus: STATUS.INVALID_SCHEMA, topLevelErrors: ["Kök eleman bir obje değil"], intentResults: [], sanitizedOutput: null };
  }

  const topLevelErrors = [];
  for (const field of REQUIRED_TOP_FIELDS) {
    if (!(field in output)) topLevelErrors.push(`Eksik üst-seviye alan: ${field}`);
  }
  if (!Array.isArray(output.intents)) topLevelErrors.push("intents bir dizi değil");
  if (!Array.isArray(output.global_constraints)) topLevelErrors.push("global_constraints bir dizi değil");

  if (topLevelErrors.length > 0) {
    return { overallStatus: STATUS.INVALID_SCHEMA, topLevelErrors, intentResults: [], sanitizedOutput: null };
  }

  const intentResults = output.intents.map((intent, i) => validateIntent(intent, i));
  const anyInvalidSchema = intentResults.some(r => r.status === STATUS.INVALID_SCHEMA);
  const anyIssue = intentResults.some(r => r.status !== STATUS.VALID);

  let overallStatus = STATUS.VALID;
  if (anyInvalidSchema) overallStatus = STATUS.INVALID_SCHEMA;
  else if (anyIssue) overallStatus = STATUS.NEEDS_CLASSIFICATION; // en az bir intent tam güvenilir değil

  const sanitizedOutput = anyInvalidSchema ? null : {
    ...output,
    intents: intentResults.map(r => r.sanitized).filter(Boolean),
  };

  return { overallStatus, topLevelErrors: [], intentResults, sanitizedOutput };
}

module.exports = {
  validate, validateIntent, safeParseJson, STATUS,
  VALID_WORKSPACES, VALID_CATEGORIES, VALID_PRIORITIES, VALID_PRIMARY_ACTIONS, VALID_RISK,
};
