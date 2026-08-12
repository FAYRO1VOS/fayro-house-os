/* Role Selector — Test Fixtures (P2.5). Çalıştırma: node selection.test.js */

const { selectRoles } = require("../selection/role-selector");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

console.log("=== 1) Veri yoksa hiçbir rol atanmaz, gerçek model UYDURULMAZ ===");
{
  const r = selectRoles([]);
  check("primary=null", r.primary === null, r);
  check("reason=NO_MODEL_SCORES_PROVIDED", r.reason === "NO_MODEL_SCORES_PROVIDED", r);
}

console.log("\n=== 2) Sentetik (mock) skorlarla en yüksek productionFitScore PRIMARY seçilir ===");
{
  const scores = [
    { modelId: "model-a", productionFitScore: 0.6, safetyScore: 0.7, costScore: 0.5, blockedByCriticalFail: false },
    { modelId: "model-b", productionFitScore: 0.9, safetyScore: 0.8, costScore: 0.3, blockedByCriticalFail: false },
    { modelId: "model-c", productionFitScore: 0.4, safetyScore: 0.9, costScore: 0.9, blockedByCriticalFail: false },
  ];
  const r = selectRoles(scores);
  check("primary=model-b (en yüksek productionFitScore)", r.primary === "model-b", r);
}

console.log("\n=== 3) Kritik hatası olan model PRIMARY/JUDGE olamaz ===");
{
  const scores = [
    { modelId: "model-x", productionFitScore: 0.99, safetyScore: 0.99, costScore: 0.9, blockedByCriticalFail: true }, // en yüksek skor ama YASAKLI
    { modelId: "model-y", productionFitScore: 0.7, safetyScore: 0.7, costScore: 0.6, blockedByCriticalFail: false },
  ];
  const r = selectRoles(scores);
  check("primary=model-y (model-x kritik hata nedeniyle elenmiş)", r.primary === "model-y", r);
  check("model-x excludedForCriticalFail listesinde", r.excludedForCriticalFail.includes("model-x"), r);
}

console.log("\n=== 4) Tüm modeller kritik hatalıysa hiçbir rol atanmaz ===");
{
  const scores = [
    { modelId: "model-a", productionFitScore: 0.9, safetyScore: 0.9, costScore: 0.9, blockedByCriticalFail: true },
    { modelId: "model-b", productionFitScore: 0.8, safetyScore: 0.8, costScore: 0.8, blockedByCriticalFail: true },
  ];
  const r = selectRoles(scores);
  check("primary=null, reason=NO_ELIGIBLE_MODEL_ALL_CRITICAL_FAIL", r.primary === null && r.reason === "NO_ELIGIBLE_MODEL_ALL_CRITICAL_FAIL", r);
}

console.log("\n=== 5) JUDGE, PRIMARY'den farklı bir model olmalı ===");
{
  const scores = [
    { modelId: "model-a", productionFitScore: 0.9, safetyScore: 0.95, costScore: 0.5, blockedByCriticalFail: false },
    { modelId: "model-b", productionFitScore: 0.6, safetyScore: 0.8, costScore: 0.5, blockedByCriticalFail: false },
  ];
  const r = selectRoles(scores);
  check("primary != judge", r.primary !== r.judge, r);
  check("judge=model-b", r.judge === "model-b", r);
}

console.log("\n=== 6) BULK_ECONOMY en yüksek costScore'a (en ucuz) sahip uygun modeldir ===");
{
  const scores = [
    { modelId: "model-a", productionFitScore: 0.9, safetyScore: 0.9, costScore: 0.2, blockedByCriticalFail: false },
    { modelId: "model-b", productionFitScore: 0.5, safetyScore: 0.6, costScore: 0.95, blockedByCriticalFail: false },
  ];
  const r = selectRoles(scores);
  check("bulkEconomy=model-b (en ucuz)", r.bulkEconomy === "model-b", r);
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
