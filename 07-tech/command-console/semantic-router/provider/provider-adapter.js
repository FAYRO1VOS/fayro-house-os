/*
 * ProviderAdapter — Interface / Stub (P2 Foundation)
 *
 * SemanticRouter -> ProviderAdapter -> (gelecekte) Anthropic / OpenAI / başka sağlayıcı.
 *
 * BU DOSYA GERÇEK BİR NETWORK ÇAĞRISI YAPMAZ. extractIntent() her zaman
 * ProviderNotImplementedError fırlatır -- P2 Foundation'ın amacı arayüzü
 * sabitlemek, gerçek sağlayıcıya bağlanmak değil (bkz. semantic-router/DESIGN.md).
 *
 * Gerçek bir sağlayıcı eklenecekse (P2.5+), bu sınıftan türeyen SOMUT bir
 * adapter (örn. AnthropicAdapter) yazılır; SemanticRouter'ın kendisi hiç
 * değişmez -- sadece hangi adapter enjekte edildiği değişir.
 */

class ProviderNotImplementedError extends Error {
  constructor(provider, model) {
    super(
      `Provider adapter stub: '${provider}/${model}' için gerçek entegrasyon henüz kurulmadı. ` +
      `Bu, P2 Foundation fazının kasıtlı bir sınırıdır -- network çağrısı bu fazda yasak.`
    );
    this.code = "PROVIDER_NOT_IMPLEMENTED";
    this.provider = provider;
    this.model = model;
  }
}

class ProviderAdapter {
  constructor({ provider, model }) {
    if (!provider || !model) {
      throw new Error("ProviderAdapter: provider ve model zorunlu (config.js'ten okunmalı, hard-code edilmemeli).");
    }
    this.provider = provider;
    this.model = model;
  }

  /**
   * @param {string} redactedInput - Redaction katmanından geçmiş, secret içermeyen metin
   * @param {object|null} contextPack - Guardrail 6, V1'de her zaman null
   * @returns {Promise<object>} INTENT_EXTRACTION contract'ına uygun ham çıktı
   */
  // eslint-disable-next-line no-unused-vars
  async extractIntent(redactedInput, contextPack) {
    throw new ProviderNotImplementedError(this.provider, this.model);
  }
}

module.exports = { ProviderAdapter, ProviderNotImplementedError };
