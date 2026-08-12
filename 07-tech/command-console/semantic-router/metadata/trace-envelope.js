/*
 * Trace Envelope (P2 Foundation, Guardrail 2)
 *
 * Her semantic request/response için izlenebilirlik metadata'sı üretir.
 * KURAL: Bu objede API key/token gibi HİÇBİR SECRET yer almaz -- sadece
 * hangi schema/prompt/provider/model/karar kullanıldığı.
 */

const crypto = require("crypto");

function generateTraceId() {
  return "trace-" + crypto.randomBytes(8).toString("hex");
}

/**
 * @param {object} params
 * @param {string} params.schemaVersion
 * @param {string} params.promptVersion
 * @param {string} params.provider
 * @param {string} params.model
 * @param {string} [params.routerDecision] - prefilter'ın kararı (DETERMINISTIC_ONLY/SEMANTIC_AI_REQUIRED/NEEDS_CLASSIFICATION)
 * @param {string[]} [params.reasonCodes]
 */
function buildTraceEnvelope({ schemaVersion, promptVersion, provider, model, routerDecision, reasonCodes }) {
  if (!schemaVersion || !promptVersion || !provider || !model) {
    throw new Error("buildTraceEnvelope: schemaVersion/promptVersion/provider/model zorunlu.");
  }
  return {
    trace_id: generateTraceId(),
    schema_version: schemaVersion,
    prompt_version: promptVersion,
    provider,
    model,
    created_at: new Date().toISOString(),
    router_decision: routerDecision || null,
    reason_codes: reasonCodes || [],
  };
}

module.exports = { generateTraceId, buildTraceEnvelope };
