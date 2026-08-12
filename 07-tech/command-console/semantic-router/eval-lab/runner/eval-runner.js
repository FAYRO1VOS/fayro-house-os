/*
 * Provider-Neutral Eval Runner (P2.5)
 *
 * Aynı gold fixture seti, HERHANGİ bir ProviderAdapter implementasyonuyla
 * (mock veya gerçek) çalıştırılabilir -- runner hiçbir provider'a bağımlı
 * DEĞİLDİR, sadece ../../provider/provider-adapter.js arayüzünü bilir.
 *
 * Bugün gerçek network çağrısı yapan bir adapter yok (bkz. mock-providers.js).
 */

const metrics = require("../scoring/metrics");
const { detectCriticalSafetyFails } = require("../scoring/safety-rules");
const { validate } = require("../../validator/schema-validator");

async function runFixture(adapter, fixture) {
  const start = Date.now();
  const rawOutput = await adapter.extractIntent(fixture.raw_input, fixture.context_pack, fixture);
  const latencyMs = Date.now() - start;

  const validation = validate(rawOutput);
  const criticalFails = detectCriticalSafetyFails(fixture, rawOutput);

  const metricScores = {
    intentSplitAccuracy: metrics.intentSplitAccuracy(fixture, rawOutput),
    workspaceAccuracy: metrics.workspaceAccuracy(fixture, rawOutput),
    entityAccuracy: metrics.entityAccuracy(fixture, rawOutput),
    relationAccuracy: metrics.relationAccuracy(fixture, rawOutput),
    categoryAccuracy: metrics.categoryAccuracy(fixture, rawOutput),
    actionAccuracy: metrics.actionAccuracy(fixture, rawOutput),
    responsibilityAccuracy: metrics.responsibilityAccuracy(fixture, rawOutput),
    negationAccuracy: metrics.negationAccuracy(fixture, rawOutput),
    prohibitedActionAccuracy: metrics.prohibitedActionAccuracy(fixture, rawOutput),
    approvalAccuracy: metrics.approvalAccuracy(fixture, rawOutput),
    missingInfoAccuracy: metrics.missingInfoAccuracy(fixture, rawOutput),
    schemaCompliance: validation.overallStatus === "VALID" ? 1 : (validation.overallStatus === "INVALID_SCHEMA" ? 0 : 0.5),
    hallucinationRate: validation.intentResults.length
      ? validation.intentResults.filter(r => r.status === "UNKNOWN_ENTITY" || r.status === "UNKNOWN_ACTION").length / validation.intentResults.length
      : 0,
  };

  // Runtime metrikleri: MOCK'ta latencyMs dışındakiler her zaman null --
  // gerçek token/maliyet verisi ancak gerçek bir provider ile ölçülebilir.
  const runtimeMetrics = { latencyMs, inputTokens: null, outputTokens: null, estimatedCost: null };

  return { fixtureId: fixture.id, metricScores, criticalFails, runtimeMetrics, rawOutput, validation };
}

async function runEval(adapter, fixtures) {
  const results = [];
  for (const fixture of fixtures) {
    results.push(await runFixture(adapter, fixture));
  }
  return results;
}

module.exports = { runFixture, runEval };
