/*
 * MODEL_REGISTRY (P2.5 — Model Eval Lab)
 *
 * Hard-coded model isimleri business logic içine DAĞITILMAZ -- her yer
 * buradan okur. Bugün hepsi enabled:false, role:CANDIDATE, status:EVAL_PENDING.
 * Hiçbiri PRIMARY ilan edilmedi (bkz. selection/role-selector.js -- gerçek
 * eval verisi olmadan kazanan uydurulmaz).
 *
 * Pricing bilgisi (varsa) sadece runtime/config metadata'dır -- business
 * safety logic'i (scoring/safety-rules.js) buna hiç bakmaz, sadece
 * scoring/model-score.js'in COST_SCORE hesaplamasında kullanılır.
 */

const MODEL_REGISTRY = [
  { provider: "openai", model_id: "gpt-5.6-sol", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "openai", model_id: "gpt-5.6-terra", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "anthropic", model_id: "claude-sonnet-5", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "anthropic", model_id: "claude-opus-5", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "anthropic", model_id: "claude-fable-5", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "google", model_id: "gemini-3.6-flash", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
  { provider: "xai", model_id: "grok-4.6", role: "CANDIDATE", enabled: false, structured_output_support: "UNKNOWN", reasoning_support: "UNKNOWN", context_limit: "UNKNOWN", status: "EVAL_PENDING", eval_version: null, pricing_metadata: null },
];

const VALID_ROLES = ["CANDIDATE", "PRIMARY", "JUDGE", "FAILOVER", "BULK_ECONOMY", "SHADOW", "REJECTED"];

function findModel(provider, modelId) {
  return MODEL_REGISTRY.find(m => m.provider === provider && m.model_id === modelId) || null;
}
function listByRole(role) {
  return MODEL_REGISTRY.filter(m => m.role === role);
}
function listEnabled() {
  return MODEL_REGISTRY.filter(m => m.enabled === true);
}

module.exports = { MODEL_REGISTRY, VALID_ROLES, findModel, listByRole, listEnabled };
