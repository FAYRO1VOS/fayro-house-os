/*
 * Trace Envelope + Cache Contract — Test Fixtures (P2 Foundation)
 * Çalıştırma: node metadata.test.js
 */

const { buildTraceEnvelope } = require("../metadata/trace-envelope");
const { buildCacheKey } = require("../metadata/cache-contract");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

console.log("=== TRACE ENVELOPE ===");

console.log("\n=== 1) Metadata/trace üretimi -> tüm zorunlu alanlar var ===");
{
  const t = buildTraceEnvelope({ schemaVersion: "1.0", promptVersion: "v1", provider: "unconfigured", model: "unconfigured", routerDecision: "SEMANTIC_AI_REQUIRED", reasonCodes: ["MULTI_INTENT"] });
  check("trace_id var", typeof t.trace_id === "string" && t.trace_id.length > 0, t);
  check("created_at ISO tarih", !isNaN(Date.parse(t.created_at)), t);
  check("router_decision doğru", t.router_decision === "SEMANTIC_AI_REQUIRED", t);
  check("reason_codes doğru", t.reason_codes.includes("MULTI_INTENT"), t);
}

console.log("\n=== 2) İki ayrı çağrı farklı trace_id üretir ===");
{
  const t1 = buildTraceEnvelope({ schemaVersion: "1.0", promptVersion: "v1", provider: "p", model: "m" });
  const t2 = buildTraceEnvelope({ schemaVersion: "1.0", promptVersion: "v1", provider: "p", model: "m" });
  check("trace_id'ler farklı", t1.trace_id !== t2.trace_id, { t1: t1.trace_id, t2: t2.trace_id });
}

console.log("\n=== 3) Trace envelope'da HİÇBİR secret alanı yok ===");
{
  const t = buildTraceEnvelope({ schemaVersion: "1.0", promptVersion: "v1", provider: "unconfigured", model: "unconfigured" });
  const keys = Object.keys(t).join(",").toLowerCase();
  check("key/secret/token/password alanı yok", !/key|secret|token|password/.test(keys), { keys: Object.keys(t) });
}

console.log("\n=== CACHE CONTRACT ===");

console.log("\n=== 4) Aynı girdi + aynı versiyon -> aynı cache key ===");
{
  const base = { rawInput: "Çağlayan çekim planla", schemaVersion: "1.0", promptVersion: "v1", provider: "anthropic", model: "model-a", contextPackVersion: null };
  const k1 = buildCacheKey(base);
  const k2 = buildCacheKey({ ...base });
  check("aynı anahtar", k1 === k2, { k1, k2 });
}

console.log("\n=== 5) Provider/model değişince cache key değişir ===");
{
  const base = { rawInput: "Çağlayan çekim planla", schemaVersion: "1.0", promptVersion: "v1", provider: "anthropic", model: "model-a", contextPackVersion: null };
  const k1 = buildCacheKey(base);
  const k2 = buildCacheKey({ ...base, provider: "openai" });
  const k3 = buildCacheKey({ ...base, model: "model-b" });
  check("provider değişince key değişir", k1 !== k2, { k1, k2 });
  check("model değişince key değişir", k1 !== k3, { k1, k3 });
}

console.log("\n=== 6) Schema/prompt version değişince cache key değişir ===");
{
  const base = { rawInput: "Çağlayan çekim planla", schemaVersion: "1.0", promptVersion: "v1", provider: "anthropic", model: "model-a", contextPackVersion: null };
  const k1 = buildCacheKey(base);
  const k2 = buildCacheKey({ ...base, schemaVersion: "1.1" });
  const k3 = buildCacheKey({ ...base, promptVersion: "v2" });
  check("schema_version değişince key değişir", k1 !== k2, { k1, k2 });
  check("prompt_version değişince key değişir", k1 !== k3, { k1, k3 });
}

console.log("\n=== 7) Normalize edilmiş input (boşluk/büyük-küçük farkı) aynı key üretir ===");
{
  const base = { schemaVersion: "1.0", promptVersion: "v1", provider: "anthropic", model: "model-a", contextPackVersion: null };
  const k1 = buildCacheKey({ ...base, rawInput: "Çağlayan   çekim planla" });
  const k2 = buildCacheKey({ ...base, rawInput: "çağlayan çekim planla" });
  check("normalize sonrası aynı key", k1 === k2, { k1, k2 });
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
