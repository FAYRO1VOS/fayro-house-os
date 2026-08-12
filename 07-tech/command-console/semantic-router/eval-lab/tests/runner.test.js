/* Provider-Neutral Runner — Test Fixtures (P2.5). Çalıştırma: node runner.test.js */

const { runFixture, runEval } = require("../runner/eval-runner");
const { MockGoodProvider, MockBadProvider } = require("../runner/mock-providers");
const { ProviderAdapter } = require("../../provider/provider-adapter");
const { FIXTURES } = require("../gold-dataset/fixtures");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

(async () => {
  console.log("=== 1) MockGoodProvider gerçekten ProviderAdapter'ı extend ediyor (provider-agnostic kanıtı) ===");
  {
    const good = new MockGoodProvider();
    check("instanceof ProviderAdapter", good instanceof ProviderAdapter);
  }

  console.log("\n=== 2) runFixture: MockGoodProvider ile yüksek skor, kritik hata yok ===");
  {
    const fx7 = FIXTURES.find(f => f.id === "FIX-0007");
    const result = await runFixture(new MockGoodProvider(), fx7);
    check("criticalFails boş", result.criticalFails.length === 0, result.criticalFails);
    check("schemaCompliance=1", result.metricScores.schemaCompliance === 1, result.metricScores);
    check("prohibitedActionAccuracy=1", result.metricScores.prohibitedActionAccuracy === 1, result.metricScores);
    check("latencyMs ölçüldü (sayı)", typeof result.runtimeMetrics.latencyMs === "number");
    check("estimatedCost null (mock'ta gerçek maliyet yok)", result.runtimeMetrics.estimatedCost === null);
  }

  console.log("\n=== 3) runFixture: MockBadProvider ile CRITICAL SAFETY FAIL üretiliyor ===");
  {
    const fx7 = FIXTURES.find(f => f.id === "FIX-0007"); // prohibited_actions fixture
    const result = await runFixture(new MockBadProvider(), fx7);
    check("criticalFails dolu", result.criticalFails.length > 0, result.criticalFails);
    check("PROHIBITED_ACTION_TREATED_AS_ALLOWED var", result.criticalFails.includes("PROHIBITED_ACTION_TREATED_AS_ALLOWED"), result.criticalFails);
  }

  console.log("\n=== 4) runEval: tüm 22 fixture MockGoodProvider ile hatasız çalışıyor ===");
  {
    const results = await runEval(new MockGoodProvider(), FIXTURES);
    check("22 sonuç döndü", results.length === FIXTURES.length, results.length);
    const allRan = results.every(r => r.fixtureId && r.metricScores);
    check("her fixture için sonuç üretildi", allRan);
  }

  console.log("\n=== 5) Gerçek network/API çağrısı YAPILMADI (stub provider hâlâ hata fırlatıyor) ===");
  {
    const realish = new ProviderAdapter({ provider: "anthropic", model: "claude-sonnet-5" });
    let threw = false, code = null;
    try { await realish.extractIntent("test", null); } catch (e) { threw = true; code = e.code; }
    check("stub adapter hâlâ PROVIDER_NOT_IMPLEMENTED fırlatıyor", threw && code === "PROVIDER_NOT_IMPLEMENTED");
  }

  console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
  process.exitCode = fail > 0 ? 1 : 0;
})();
