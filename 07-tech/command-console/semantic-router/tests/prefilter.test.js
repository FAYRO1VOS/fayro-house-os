/*
 * Semantic Router Pre-Filter — Test Fixtures (P1)
 * Çalıştırma: node prefilter.test.js
 * Bağımlılık yok, gerçek AI/network çağrısı yok.
 */

const { decide } = require("../prefilter/prefilter");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

console.log("=== 1) CLEAR_SINGLE_INTENT -> DETERMINISTIC_ONLY ===");
{
  const r = decide("Çağlayan cuma konseri için çekim planı hazırlansın.");
  check("decision=DETERMINISTIC_ONLY", r.decision === "DETERMINISTIC_ONLY", r);
  check("reason=CLEAR_SINGLE_INTENT", r.reasonCodes.includes("CLEAR_SINGLE_INTENT"), r);
}

console.log("\n=== 2) Güçlü/net workspace ifadesi, negation yok -> DETERMINISTIC_ONLY ===");
{
  const r = decide("NOW Yaşam Sağlık reklam bütçesini artır.");
  check("decision=DETERMINISTIC_ONLY", r.decision === "DETERMINISTIC_ONLY", r);
}

console.log("\n=== 2b) Sadece jenerik \"now \" ile eşleşen kısa mesaj -> AMBIGUOUS_ENTITY beklenir (guardrail çalışıyor) ===");
{
  const r = decide("NOW reklam bütçesini artır.");
  check("decision=SEMANTIC_AI_REQUIRED (now-saglik'in tek/güçlü olmayan ifadesi)", r.decision === "SEMANTIC_AI_REQUIRED", r);
  check("reason AMBIGUOUS_ENTITY var", r.reasonCodes.includes("AMBIGUOUS_ENTITY"), r);
}

console.log("\n=== 3) Çoklu negation (4 farklı yasaklı fiil) -> SEMANTIC_AI_REQUIRED / SEMANTIC_NEGATION_COMPLEXITY ===");
{
  const r = decide("NOW Yaşam Sağlık tarafında reklam bütçesini artırma, azaltma, kampanya kapatma veya yeni kampanya yayınlama.");
  check("decision=SEMANTIC_AI_REQUIRED", r.decision === "SEMANTIC_AI_REQUIRED", r);
  check("reason SEMANTIC_NEGATION_COMPLEXITY var", r.reasonCodes.includes("SEMANTIC_NEGATION_COMPLEXITY"), r);
}

console.log("\n=== 4) Tek negation (1 fiil) -> negation complexity TETİKLENMEMELİ ===");
{
  const r = decide("Çağlayan için yeni kampanya yayınlama.");
  check("SEMANTIC_NEGATION_COMPLEXITY yok (eşik=2, burada 1)", !r.reasonCodes.includes("SEMANTIC_NEGATION_COMPLEXITY"), r);
}

console.log("\n=== 5) Çok workspace'li karmaşık mesaj (V1.4 gerçek fixture) -> SEMANTIC_AI_REQUIRED, birden fazla reason ===");
{
  const text = "Çağlayan projesinde cuma konseri var, çekim ekibini planla, içerik planını hazırla, backstage, hazırlık, sahne öncesi, sahne performansı, seyirci reaksiyonları, sahne sonrası, Serdar Ortaç anma gecesi arşiv materyalini topla ve düzenle. PR, basın ilişkileri, medya görünürlüğü ve PR koordinasyonu Ciooman'ın sorumluluğunda; digital brand, social media, content strategy ve digital growth Furkan/Fayro'nun sorumluluğunda. Müzik ve prodüksiyon tarafında Cem ile koordine olunacak. NOW Yaşam Sağlık tarafında mevcut reklamların performansını incele, hangi reklamların iyi veya kötü çalıştığını raporla, fakat benim onayım olmadan reklam bütçesini artırma, azaltma, kampanya kapatma veya yeni kampanya yayınlama. Furkan Personal Brand için bu hafta çekim günü planla, çekim konularını çıkar, gerekli hazırlıkları çıkar, ilk içerik fikirlerini çıkar.";
  const r = decide(text);
  check("decision=SEMANTIC_AI_REQUIRED", r.decision === "SEMANTIC_AI_REQUIRED", r);
  check("reason MULTI_INTENT var", r.reasonCodes.includes("MULTI_INTENT"), r);
  check("reason RESPONSIBILITY_COMPLEXITY var", r.reasonCodes.includes("RESPONSIBILITY_COMPLEXITY"), r);
  check("reason CROSS_WORKSPACE_RELATION var", r.reasonCodes.includes("CROSS_WORKSPACE_RELATION"), r);
  check("reason SEMANTIC_NEGATION_COMPLEXITY var", r.reasonCodes.includes("SEMANTIC_NEGATION_COMPLEXITY"), r);
  check("4+ workspace tespit edildi", r.signals.matchedWorkspaces.length >= 4, r.signals.matchedWorkspaces);
}

console.log("\n=== 6) AMBIGUOUS_ENTITY (\"now\" riskli tek eşleşme) -> SEMANTIC_AI_REQUIRED ===");
{
  const r = decide("Now toplantı saatini teyit edelim mi bilmiyorum.");
  check("decision=SEMANTIC_AI_REQUIRED", r.decision === "SEMANTIC_AI_REQUIRED", r);
  check("reason AMBIGUOUS_ENTITY var", r.reasonCodes.includes("AMBIGUOUS_ENTITY"), r);
}

console.log("\n=== 7) UNKNOWN_ENTITY (hiçbir workspace eşleşmesi yok) -> NEEDS_CLASSIFICATION ===");
{
  const r = decide("Yarın hava nasıl olacak acaba.");
  check("decision=NEEDS_CLASSIFICATION", r.decision === "NEEDS_CLASSIFICATION", r);
  check("reason UNKNOWN_ENTITY var", r.reasonCodes.includes("UNKNOWN_ENTITY"), r);
}

console.log("\n=== 8) EMPTY_INPUT -> NEEDS_CLASSIFICATION ===");
{
  const r = decide("   ");
  check("decision=NEEDS_CLASSIFICATION", r.decision === "NEEDS_CLASSIFICATION", r);
  check("reason EMPTY_INPUT var", r.reasonCodes.includes("EMPTY_INPUT"), r);
}

console.log("\n=== 9) Sadece responsibility dili (tek workspace + \"sorumluluğunda\") -> SEMANTIC_AI_REQUIRED ===");
{
  const r = decide("Çağlayan projesinde PR işleri kimin sorumluluğunda netleştirelim.");
  check("decision=SEMANTIC_AI_REQUIRED", r.decision === "SEMANTIC_AI_REQUIRED", r);
  check("reason RESPONSIBILITY_COMPLEXITY var", r.reasonCodes.includes("RESPONSIBILITY_COMPLEXITY"), r);
}

console.log("\n=== 10) Eski V1.4 4 tek-intent regresyonu (hepsi DETERMINISTIC_ONLY beklenir) ===");
{
  const tests = [
    "Çağlayan cuma konseri için çekim planı hazırlansın.",
    "Yeni yat müşterisi teklif bekliyor.",
    "Bu ay ödenecek borçları planla.",
  ];
  for (const t of tests) {
    const r = decide(t);
    check(`"${t}" -> DETERMINISTIC_ONLY`, r.decision === "DETERMINISTIC_ONLY", r);
  }
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
