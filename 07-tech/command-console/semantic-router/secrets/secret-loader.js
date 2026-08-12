/*
 * Server-Side Secret Loading Interface (P2 Foundation)
 *
 * KURAL: Bu dosya SADECE server-side (Node) çalışacak kodlarda kullanılır.
 * Command Console (browser, ../../app.js) BUNU ASLA IMPORT ETMEZ -- V1.4
 * halihazırda client-side'da hiçbir credential tutmuyor, bu tasarım o
 * ilkeyi bozmaz.
 *
 * API key: source code'a yazılmaz, git'e girmez, Markdown'a yazılmaz,
 * test fixture'a yazılmaz, localStorage'a girmez, log/trace çıktısına girmez.
 * Bu dosya GERÇEK bir secret İÇERMEZ -- sadece environment variable'dan
 * OKUMA arayüzü tanımlar. Gerekli değişkenler için bkz. README.md.
 */

function loadSecret(envVarName) {
  const value = process.env[envVarName];
  return { found: Boolean(value), value: value || null };
}

function loadSemanticApiKey() {
  return loadSecret("SEMANTIC_API_KEY");
}

// Log/trace/rapor amaçlı: gerçek değeri ASLA döndürmez, sadece durumu.
function secretStatus(envVarName) {
  return loadSecret(envVarName).found ? "CONFIGURED" : "NOT_CONFIGURED";
}

module.exports = { loadSecret, loadSemanticApiKey, secretStatus };
