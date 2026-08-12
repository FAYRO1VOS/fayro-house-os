/*
 * Cache Key Contract (P2 Foundation, Guardrail 5)
 *
 * GERÇEK BİR CACHE DEPOSU YOK -- sadece anahtar üretim sözleşmesi.
 * Cache key normalized_input + schema_version + prompt_version + provider +
 * model + context_pack_version birleşiminden üretilir; herhangi biri
 * değişince anahtar da değişir (eski/geçersiz sonuç yanlışlıkla yeniden
 * kullanılmaz).
 *
 * KURAL: Cache hiçbir approval/safety sonucunu bypass edemez -- bu katman
 * sadece SEMANTIC AI'ın çıktısını yeniden hesaplamaktan kaçınmak içindir;
 * V1.4 Safety Layer / Approval Gates her zaman AYRI ÇALIŞIR, cache'lenmez.
 */

const crypto = require("crypto");

function normalize(text) {
  return String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * @param {object} params
 * @param {string} params.rawInput
 * @param {string} params.schemaVersion
 * @param {string} params.promptVersion
 * @param {string} params.provider
 * @param {string} params.model
 * @param {string|null} [params.contextPackVersion] - context disabled ise null (V1'de her zaman null)
 * @returns {string} sha256 hex
 */
function buildCacheKey({ rawInput, schemaVersion, promptVersion, provider, model, contextPackVersion }) {
  if (!schemaVersion || !promptVersion || !provider || !model) {
    throw new Error("buildCacheKey: schemaVersion/promptVersion/provider/model zorunlu.");
  }
  const parts = [
    normalize(rawInput),
    schemaVersion,
    promptVersion,
    provider,
    model,
    contextPackVersion === undefined ? null : contextPackVersion,
  ];
  const raw = parts.map(p => (p === null ? "null" : String(p))).join("||");
  return crypto.createHash("sha256").update(raw).digest("hex");
}

module.exports = { buildCacheKey, normalize };
