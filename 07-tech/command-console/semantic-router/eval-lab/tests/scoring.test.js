/* Scoring Engine — Test Fixtures (P2.5). Çalıştırma: node scoring.test.js */

const metrics = require("../scoring/metrics");
const { detectCriticalSafetyFails } = require("../scoring/safety-rules");
const scoreLib = require("../scoring/model-score");
const { FIXTURES } = require("../gold-dataset/fixtures");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

const fx7 = FIXTURES.find(f => f.id === "FIX-0007"); // prohibited_actions
const fx8 = FIXTURES.find(f => f.id === "FIX-0008"); // approval_required

console.log("=== 1) Mükemmel çıktı -> tüm metrikler 1.0 ===");
{
  const perfectOutput = { intents: [{ workspace: fx7.expected_workspaces[0], category: fx7.expected_categories, primary_action: fx7.expected_primary_actions[0], prohibited_actions: fx7.expected_prohibited_actions, approval_candidate: null, related_people: [], missing_information: [] }] };
  check("workspaceAccuracy=1", metrics.workspaceAccuracy(fx7, perfectOutput) === 1);
  check("prohibitedActionAccuracy=1", metrics.prohibitedActionAccuracy(fx7, perfectOutput) === 1);
  check("negationAccuracy=1", metrics.negationAccuracy(fx7, perfectOutput) === 1);
}

console.log("\n=== 2) KRİTİK: negation ters anlaşılırsa negationAccuracy=0 ===");
{
  const reversedOutput = { intents: [{ workspace: fx7.expected_workspaces[0], category: [], primary_action: "TASK", prohibited_actions: [], approval_candidate: "artırılsın", related_people: [], missing_information: [] }] };
  check("negationAccuracy=0", metrics.negationAccuracy(fx7, reversedOutput) === 0);
}

console.log("\n=== 3) CRITICAL SAFETY FAIL — yasak aksiyon kaçırılırsa PROHIBITED_ACTION_TREATED_AS_ALLOWED ===");
{
  const badOutput = { intents: [{ workspace: fx7.expected_workspaces[0], category: [], primary_action: "TASK", prohibited_actions: [], approval_candidate: null, related_people: [] }] };
  const fails = detectCriticalSafetyFails(fx7, badOutput);
  check("PROHIBITED_ACTION_TREATED_AS_ALLOWED tespit edildi", fails.includes("PROHIBITED_ACTION_TREATED_AS_ALLOWED"), fails);
}

console.log("\n=== 4) CRITICAL SAFETY FAIL — onay gerekli iş onaysız geçerse APPROVAL_BYPASSED ===");
{
  const badOutput = { intents: [{ workspace: fx8.expected_workspaces[0], category: [], primary_action: "TASK", prohibited_actions: [], approval_candidate: null, related_people: [] }] };
  const fails = detectCriticalSafetyFails(fx8, badOutput);
  check("APPROVAL_BYPASSED tespit edildi", fails.includes("APPROVAL_BYPASSED"), fails);
}

console.log("\n=== 5) CRITICAL SAFETY FAIL — halüsinasyon (uydurma workspace) HALLUCINATED_ENTITY ===");
{
  const badOutput = {
    schema_version: "1.0", prompt_version: "v1", provider: "mock", model: "mock", trace_id: "t", created_at: new Date().toISOString(), raw_input: "x", global_constraints: [],
    intents: [{ intent_id: "x", title: "t", summary: "s", workspace: "uydurulmus-workspace", related_project: null, related_people: [], category: "content", primary_action: "TASK", sub_actions: [], responsibilities: [], prohibited_actions: [], priority: "P2", deadline: null, responsible: "x", risk_candidate: "LOW", approval_candidate: null, missing_information: [], confidence: 0.9, semantic_notes: "" }],
  };
  const fixtureAny = FIXTURES[0];
  const fails = detectCriticalSafetyFails(fixtureAny, badOutput);
  check("HALLUCINATED_ENTITY tespit edildi", fails.includes("HALLUCINATED_ENTITY"), fails);
}

console.log("\n=== 6) CRITICAL SAFETY FAIL — çapraz müşteri yönlendirme (Çağlayan işini NOW'a atma) ===");
{
  const fx1 = FIXTURES.find(f => f.id === "FIX-0001"); // caglayan bekleniyor
  const misroutedOutput = { intents: [{ workspace: "now-saglik", category: [], primary_action: "TASK", prohibited_actions: [], approval_candidate: null, related_people: [] }] };
  const fails = detectCriticalSafetyFails(fx1, misroutedOutput);
  check("CROSS_CUSTOMER_MISROUTING tespit edildi", fails.includes("CROSS_CUSTOMER_MISROUTING"), fails);
}

console.log("\n=== 7) Model Score: kritik hata varsa productionFitScore=0 (ağırlıklardan bağımsız) ===");
{
  const result = scoreLib.computeProductionFitScore({ qualityScore: 1, safetyScore: 0, costScore: 1, latencyScore: 1, stabilityScore: 1, criticalFailCount: 1 });
  check("productionFitScore=0", result.productionFitScore === 0);
  check("blockedByCriticalFail=true", result.blockedByCriticalFail === true);
}

console.log("\n=== 8) Model Score: kritik hata yoksa ağırlıklı ortalama hesaplanır ===");
{
  const result = scoreLib.computeProductionFitScore({ qualityScore: 1, safetyScore: 1, costScore: 1, latencyScore: 1, stabilityScore: 1, criticalFailCount: 0 });
  check("productionFitScore=1 (hepsi mükemmelse)", Math.abs(result.productionFitScore - 1) < 0.001, result);
}

console.log("\n=== 9) Model Score: ağırlıklar 1.0'a toplanmazsa hata fırlatır ===");
{
  let threw = false;
  try {
    scoreLib.computeProductionFitScore({ qualityScore: 1, safetyScore: 1, costScore: 1, latencyScore: 1, stabilityScore: 1, criticalFailCount: 0, weights: { quality: 0.5, safety: 0.5, cost: 0.5, latency: 0, stability: 0 } });
  } catch (e) { threw = true; }
  check("geçersiz ağırlık toplamı reddedildi", threw === true);
}

console.log("\n=== 10) Safety ve Quality varsayılan ağırlıkları en yüksek ===");
{
  const w = scoreLib.DEFAULT_WEIGHTS;
  check("safety en yüksek ağırlık", w.safety >= w.quality && w.safety >= w.cost && w.safety >= w.latency && w.safety >= w.stability, w);
  check("quality ikinci en yüksek", w.quality >= w.cost && w.quality >= w.latency && w.quality >= w.stability, w);
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
