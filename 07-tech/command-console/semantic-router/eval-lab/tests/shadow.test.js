/* Shadow Mode — Test Fixtures (P2.5). Çalıştırma: node shadow.test.js */

const { runShadow, isShadowResultSafe } = require("../shadow/shadow-runner");
const { MockGoodProvider, MockBadProvider } = require("../runner/mock-providers");
const { FIXTURES } = require("../gold-dataset/fixtures");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

(async () => {
  const fx = FIXTURES.find(f => f.id === "FIX-0001");

  console.log("=== 1) Shadow sonucu HER ZAMAN actionable=false ===");
  {
    const r = await runShadow(new MockGoodProvider(), new MockBadProvider(), fx.raw_input, null, fx);
    check("shadowResult.actionable=false", r.shadowResult.actionable === false, r.shadowResult);
    check("isShadowResultSafe=true", isShadowResultSafe(r.shadowResult));
  }

  console.log("\n=== 2) Primary çıktı her zaman gerçek akışa devam eder, shadow'dan bağımsız ===");
  {
    const r = await runShadow(new MockGoodProvider(), new MockBadProvider(), fx.raw_input, null, fx);
    check("primaryOutput mevcut", r.primaryOutput && Array.isArray(r.primaryOutput.intents));
    check("primaryOutput MockGoodProvider'dan geldi", r.primaryOutput.model === "mock-good-v1", r.primaryOutput.model);
  }

  console.log("\n=== 3) Shadow model hata verse bile primary etkilenmez ===");
  {
    class ThrowingShadow extends MockBadProvider {
      async extractIntent() { throw new Error("shadow model çöktü (simülasyon)"); }
    }
    const r = await runShadow(new MockGoodProvider(), new ThrowingShadow(), fx.raw_input, null, fx);
    check("primaryOutput yine üretildi", r.primaryOutput && Array.isArray(r.primaryOutput.intents));
    check("shadowResult.error dolu", typeof r.shadowResult.error === "string" && r.shadowResult.error.length > 0);
    check("shadowResult.actionable yine false", r.shadowResult.actionable === false);
  }

  console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
  process.exitCode = fail > 0 ? 1 : 0;
})();
