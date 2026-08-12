/*
 * Strict Schema Validator — Test Fixtures (P2 Foundation)
 * Çalıştırma: node validator.test.js
 */

const { validate, STATUS } = require("../validator/schema-validator");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

function makeValidOutput(overrides = {}) {
  return {
    schema_version: "1.0",
    prompt_version: "v1",
    provider: "unconfigured",
    model: "unconfigured",
    trace_id: "trace-abc123",
    created_at: new Date().toISOString(),
    raw_input: "Çağlayan cuma konseri için çekim planı hazırlansın.",
    global_constraints: [],
    intents: [
      {
        intent_id: "INTENT-1",
        title: "Çağlayan çekim planı",
        summary: "Cuma konseri için çekim planı",
        workspace: "caglayan",
        related_project: null,
        related_people: [],
        category: "content",
        primary_action: "CONCERT_CONTENT_SPRINT",
        sub_actions: ["çekim planı hazırla"],
        responsibilities: [],
        prohibited_actions: [],
        priority: "P2",
        deadline: null,
        responsible: "Furkan",
        risk_candidate: "LOW",
        approval_candidate: null,
        missing_information: [],
        confidence: 0.9,
        semantic_notes: "",
      },
    ],
    ...overrides,
  };
}

console.log("=== 1) Valid semantic JSON -> VALID ===");
{
  const r = validate(makeValidOutput());
  check("overallStatus=VALID", r.overallStatus === STATUS.VALID, r);
  check("sanitizedOutput dolu", r.sanitizedOutput !== null, r);
}

console.log("\n=== 2) Malformed JSON string -> INVALID_SCHEMA ===");
{
  const r = validate("{ bu gecerli json degil ");
  check("overallStatus=INVALID_SCHEMA", r.overallStatus === STATUS.INVALID_SCHEMA, r);
}

console.log("\n=== 3) Missing required top-level fields -> INVALID_SCHEMA ===");
{
  const obj = makeValidOutput();
  delete obj.schema_version;
  delete obj.trace_id;
  const r = validate(obj);
  check("overallStatus=INVALID_SCHEMA", r.overallStatus === STATUS.INVALID_SCHEMA, r);
  check("eksik alanlar raporlandı", r.topLevelErrors.some(e => e.includes("schema_version")), r);
}

console.log("\n=== 4) Missing required intent fields -> INVALID_SCHEMA ===");
{
  const obj = makeValidOutput();
  delete obj.intents[0].category;
  delete obj.intents[0].primary_action;
  const r = validate(obj);
  check("overallStatus=INVALID_SCHEMA", r.overallStatus === STATUS.INVALID_SCHEMA, r);
}

console.log("\n=== 5) Unknown workspace (hallucinated entity) -> UNKNOWN_ENTITY, backlog'a düşer ===");
{
  const obj = makeValidOutput();
  obj.intents[0].workspace = "musteri-x-uydurulmus";
  const r = validate(obj);
  check("intent status=UNKNOWN_ENTITY", r.intentResults[0].status === STATUS.UNKNOWN_ENTITY, r);
  check("sanitized workspace=backlog (gerçek entity OLUŞTURULMADI)", r.sanitizedOutput.intents[0].workspace === "backlog", r.sanitizedOutput);
}

console.log("\n=== 6) Unknown category -> NEEDS_CLASSIFICATION ===");
{
  const obj = makeValidOutput();
  obj.intents[0].category = "uydurma-kategori";
  const r = validate(obj);
  check("intent status=NEEDS_CLASSIFICATION", r.intentResults[0].status === STATUS.NEEDS_CLASSIFICATION, r);
  check("sanitized category=null (uydurulmadı)", r.sanitizedOutput.intents[0].category === null, r.sanitizedOutput);
}

console.log("\n=== 7) Unknown primary_action -> UNKNOWN_ACTION ===");
{
  const obj = makeValidOutput();
  obj.intents[0].primary_action = "ROBOT_TAKEOVER";
  const r = validate(obj);
  check("intent status=UNKNOWN_ACTION", r.intentResults[0].status === STATUS.UNKNOWN_ACTION, r);
  check("sanitized primary_action=UNKNOWN", r.sanitizedOutput.intents[0].primary_action === "UNKNOWN", r.sanitizedOutput);
}

console.log("\n=== 8) Fake/hallucinated entity + bilinmeyen priority birlikte -> yine reddedilir/sanitize edilir ===");
{
  const obj = makeValidOutput();
  obj.intents[0].workspace = "hayali-workspace";
  obj.intents[0].priority = "P9";
  const r = validate(obj);
  check("workspace backlog'a düştü", r.sanitizedOutput.intents[0].workspace === "backlog", r.sanitizedOutput);
  check("priority null'a düştü (uydurulmadı)", r.sanitizedOutput.intents[0].priority === null, r.sanitizedOutput);
}

console.log("\n=== 9) Geçersiz deadline (uydurulmuş tarih formatı) -> null'a düşer, INPUT_REQUIRED ===");
{
  const obj = makeValidOutput();
  obj.intents[0].deadline = "yakinda-bir-zaman";
  const r = validate(obj);
  check("deadline null'a düştü", r.sanitizedOutput.intents[0].deadline === null, r.sanitizedOutput);
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
