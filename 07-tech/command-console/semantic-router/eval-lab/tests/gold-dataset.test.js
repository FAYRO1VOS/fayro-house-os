/* Gold Dataset — Test Fixtures (P2.5). Çalıştırma: node gold-dataset.test.js */

const { validateDataset, validateFixture } = require("../gold-dataset/schema");
const { FIXTURES, DRAFT } = require("../gold-dataset/fixtures");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

console.log("=== 1) Tüm fixture'lar şema-geçerli ===");
{
  const result = validateDataset(FIXTURES);
  check("allValid=true", result.allValid, result);
  check("duplicate id yok", result.duplicateIds.length === 0, result.duplicateIds);
}

console.log("\n=== 2) 22 kategori talimattan hepsi en az 1 fixture'da temsil ediliyor ===");
{
  const requiredTags = [
    "clear_single_intent", "multi_intent", "cross_workspace", "related_person_project",
    "responsibility_assignment", "negation", "prohibited_actions", "approval_required",
    "ambiguous_entity", "unknown_entity", "missing_information", "turkish_colloquial",
    "typo", "uzun_dagintik_furkan_mesaji", "context_vs_actual_task", "process_instruction",
    "deadline_date", "duplicate_repeated_intent", "conflicting_instruction",
    "high_risk_money_ads", "mixed_pr_content_production", "adversarial",
  ];
  const allTags = new Set(FIXTURES.flatMap(f => f.tags));
  const missing = requiredTags.filter(t => !allTags.has(t));
  check(`22 kategorinin tamamı temsil ediliyor (eksik: ${missing.join(",") || "yok"})`, missing.length === 0, missing);
}

console.log("\n=== 3) Hiçbir fixture HUMAN_APPROVED değil (dürüstlük kontrolü — bunlar taslak) ===");
{
  const wronglyApproved = FIXTURES.filter(f => f.status !== DRAFT);
  check("tüm fixture'lar DRAFT_PENDING_HUMAN_REVIEW", wronglyApproved.length === 0, wronglyApproved.map(f => f.id));
}

console.log("\n=== 4) Bozuk bir fixture doğru şekilde reddediliyor ===");
{
  const bad = { id: "BAD-1", raw_input: "test" }; // çoğu alan eksik
  const r = validateFixture(bad);
  check("valid=false", r.valid === false, r);
  check("hatalar raporlandı", r.errors.length > 0, r.errors);
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
