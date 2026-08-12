/*
 * Gold Dataset Fixture Contract (P2.5)
 *
 * Her fixture bu şekli taşımak ZORUNDA. "expected_*" alanları LLM tarafından
 * ÜRETİLMEZ -- insan tarafından yazılır/onaylanır. Bu dosyadaki fixture'lar
 * (../fixtures.js) Claude Code tarafından İLK TASLAK olarak hazırlandı ve
 * her biri status:"DRAFT_PENDING_HUMAN_REVIEW" taşıyor -- Furkan/Enes
 * onaylamadan "gold" (otoriter doğru cevap) sayılmazlar.
 */

const REQUIRED_FIXTURE_FIELDS = [
  "id", "raw_input", "context_pack",
  "expected_intent_count", "expected_workspaces", "expected_related_projects",
  "expected_related_people", "expected_categories", "expected_primary_actions",
  "expected_responsibilities", "expected_prohibited_actions", "expected_approval",
  "expected_missing_information", "expected_global_constraints",
  "severity", "difficulty", "tags", "status",
];

const VALID_SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const VALID_DIFFICULTY = ["EASY", "MEDIUM", "HARD", "ADVERSARIAL"];
const VALID_FIXTURE_STATUS = ["DRAFT_PENDING_HUMAN_REVIEW", "HUMAN_APPROVED", "REJECTED"];

function isArray(v) { return Array.isArray(v); }

/** @returns {{valid: boolean, errors: string[]}} */
function validateFixture(fixture) {
  const errors = [];
  if (typeof fixture !== "object" || fixture === null) {
    return { valid: false, errors: ["fixture bir obje değil"] };
  }
  for (const field of REQUIRED_FIXTURE_FIELDS) {
    if (!(field in fixture)) errors.push(`Eksik alan: ${field}`);
  }
  if (errors.length > 0) return { valid: false, errors };

  if (typeof fixture.id !== "string" || !fixture.id) errors.push("id boş olamaz");
  if (typeof fixture.raw_input !== "string" || !fixture.raw_input) errors.push("raw_input boş olamaz");
  if (typeof fixture.expected_intent_count !== "number") errors.push("expected_intent_count sayı değil");
  for (const arrField of ["expected_workspaces", "expected_related_projects", "expected_related_people", "expected_categories", "expected_primary_actions", "expected_responsibilities", "expected_prohibited_actions", "expected_missing_information", "expected_global_constraints", "tags"]) {
    if (!isArray(fixture[arrField])) errors.push(`${arrField} bir dizi değil`);
  }
  if (typeof fixture.expected_approval !== "boolean") errors.push("expected_approval boolean değil");
  if (!VALID_SEVERITY.includes(fixture.severity)) errors.push(`Geçersiz severity: ${fixture.severity}`);
  if (!VALID_DIFFICULTY.includes(fixture.difficulty)) errors.push(`Geçersiz difficulty: ${fixture.difficulty}`);
  if (!VALID_FIXTURE_STATUS.includes(fixture.status)) errors.push(`Geçersiz status: ${fixture.status}`);

  return { valid: errors.length === 0, errors };
}

function validateDataset(fixtures) {
  const results = fixtures.map(f => ({ id: f && f.id, ...validateFixture(f) }));
  const invalid = results.filter(r => !r.valid);
  const ids = fixtures.map(f => f && f.id);
  const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  return {
    allValid: invalid.length === 0 && duplicateIds.length === 0,
    invalidCount: invalid.length,
    invalidResults: invalid,
    duplicateIds: [...new Set(duplicateIds)],
  };
}

module.exports = { REQUIRED_FIXTURE_FIELDS, VALID_SEVERITY, VALID_DIFFICULTY, VALID_FIXTURE_STATUS, validateFixture, validateDataset };
