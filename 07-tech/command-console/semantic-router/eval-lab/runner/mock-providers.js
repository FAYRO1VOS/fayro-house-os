/*
 * Mock Providers (P2.5)
 *
 * Gerçek sağlayıcı SDK'sı kurulmadı, network çağrısı yapılmadı. Bu mock'lar
 * ../../provider/provider-adapter.js'teki AYNI ProviderAdapter arayüzünü
 * (extends) kullanır -- bu, runner'ın gerçekten provider-agnostic olduğunu
 * kanıtlar: yarın gerçek bir AnthropicAdapter/OpenAIAdapter eklendiğinde
 * runner'da HİÇBİR DEĞİŞİKLİK gerekmeyecek.
 *
 * ÖNEMLİ: Bu mock'lar fixture'ın "expected_*" alanlarına bakarak cevap
 * üretir -- bu GERÇEK bir model değerlendirmesi DEĞİLDİR, sadece runner/
 * scoring mekaniğinin doğru çalıştığını test etmek içindir.
 *   MockGoodProvider -> gold'a sadık (yüksek skor beklenir)
 *   MockBadProvider  -> kasıtlı kusurlu: prohibited action'ları hiç
 *                       yakalamaz (CRITICAL SAFETY FAIL testi için)
 */

const { ProviderAdapter } = require("../../provider/provider-adapter");

function buildOutputFromFixture(fixture, { faithful }) {
  const wsList = fixture.expected_workspaces.length ? fixture.expected_workspaces : ["backlog"];
  const count = Math.max(fixture.expected_intent_count, 0);
  const intents = [];
  for (let i = 0; i < count; i++) {
    intents.push({
      intent_id: `MOCK-${fixture.id}-${i}`,
      title: "mock-intent",
      summary: fixture.raw_input,
      workspace: wsList[i % wsList.length],
      related_project: fixture.expected_related_projects[0] || null,
      related_people: faithful ? fixture.expected_related_people : [],
      category: fixture.expected_categories[0] || "content",
      primary_action: fixture.expected_primary_actions[0] || "TASK",
      sub_actions: [],
      responsibilities: faithful ? fixture.expected_responsibilities : [],
      prohibited_actions: faithful ? fixture.expected_prohibited_actions : [], // BAD: kasıtlı boş
      priority: "P2",
      deadline: null,
      responsible: "Furkan",
      risk_candidate: faithful && fixture.expected_approval ? "HIGH" : "LOW",
      approval_candidate: faithful ? (fixture.expected_approval ? "onay gerekli (mock)" : null) : null, // BAD: hep null
      missing_information: faithful ? fixture.expected_missing_information : [],
      confidence: 0.9,
      semantic_notes: "mock output",
    });
  }
  return {
    schema_version: "1.0",
    prompt_version: "eval-v1",
    provider: "mock",
    model: faithful ? "mock-good-v1" : "mock-bad-v1",
    trace_id: "trace-mock-" + fixture.id,
    created_at: new Date().toISOString(),
    raw_input: fixture.raw_input,
    global_constraints: fixture.expected_global_constraints,
    intents,
  };
}

class MockGoodProvider extends ProviderAdapter {
  constructor() { super({ provider: "mock", model: "mock-good-v1" }); }
  async extractIntent(redactedInput, contextPack, fixture) {
    if (!fixture) throw new Error("MockGoodProvider yalnızca test amaçlıdır, fixture parametresi zorunlu.");
    return buildOutputFromFixture(fixture, { faithful: true });
  }
}

class MockBadProvider extends ProviderAdapter {
  constructor() { super({ provider: "mock", model: "mock-bad-v1" }); }
  async extractIntent(redactedInput, contextPack, fixture) {
    if (!fixture) throw new Error("MockBadProvider yalnızca test amaçlıdır, fixture parametresi zorunlu.");
    return buildOutputFromFixture(fixture, { faithful: false });
  }
}

module.exports = { MockGoodProvider, MockBadProvider };
