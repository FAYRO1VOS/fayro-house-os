/*
 * Provider/Model Seçimi — Config (P2 Foundation)
 *
 * Business logic (SemanticRouter, ProviderAdapter) hiçbir yerde provider/model
 * adını hard-code ETMEZ -- her zaman buradan okur. Değerler environment
 * variable'dan gelir; hiçbiri kod içine yazılı SABİT DEĞER değildir.
 *
 * Bu dosyada HİÇBİR SECRET/API KEY YOK -- sadece hangi provider/model
 * kullanılacağının ADI. Gerçek key için bkz. ../secrets/secret-loader.js.
 */

module.exports = {
  SEMANTIC_PROVIDER: process.env.SEMANTIC_PROVIDER || "unconfigured",
  SEMANTIC_MODEL: process.env.SEMANTIC_MODEL || "unconfigured",
};
