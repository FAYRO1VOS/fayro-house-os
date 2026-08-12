/*
 * Semantic Router — Pre-Filter Config (P1)
 *
 * Tüm eşikler burada, kod içinde hard-code değil. P2'de gerçek AI confidence
 * değerlendirmesi de bu dosyayı okuyacak (SEMANTIC_CONFIDENCE_THRESHOLD) --
 * P1'de LLM çağrısı olmadığı için bu değer P1'de KULLANILMIYOR, sadece
 * sözleşme/config-hazır olarak duruyor (bkz. DESIGN.md Guardrail 1).
 *
 * BİLİNEN İZOLASYON KARARI: WORKSPACE_KEYWORDS ve BOUNDARY_MARKERS,
 * V1.4'ün ../../app.js dosyasındaki listelerin BAĞIMSIZ bir kopyasıdır --
 * V1.4'e dokunmamak için kasıtlı olarak ayrı tutuldu. Drift riski
 * DESIGN.md'de "Bilinen Riskler" altında not edildi, P3'te birleştirilecek.
 */

module.exports = {
  // ---- P2 için hazır, P1'de kullanılmıyor ----
  SEMANTIC_CONFIDENCE_THRESHOLD: 0.60,

  // ---- P1 pre-filter eşikleri ----
  MULTI_INTENT_MIN_MATCHES: 2,
  CROSS_WORKSPACE_MARKER_MIN_COUNT: 2,
  NEGATION_COMPLEXITY_MIN_COUNT: 2,
  LONG_TEXT_WORD_COUNT: 30,

  // ---- Workspace anahtar kelimeleri (V1.4 app.js'ten izole kopya) ----
  WORKSPACE_KEYWORDS: {
    "furkan-brand": ["furkan personal brand", "furkan profil", "furkan instagram", "furkan'ın kişisel", "kişisel marka", "furkan vitrin", "benim hesabım", "kendi hesabım", "kişisel hesabım", "benim profilim"],
    "caglayan": ["çağlayan", "caglayan", "topaloğlu", "topaloglu"],
    "now-saglik": ["now yaşam", "now yasam", "now sağlık", "now saglik", "now "],
    "ciooman": ["ciooman"],
    "fayro-sales": ["lead", "müşteri adayı", "yeni müşteri", "potansiyel müşteri"],
    "yacht": ["yat ", "yat,", "yatı", "yacht"],
    "gallery-opportunity": ["galeri", "gallery"],
    "personal-ops": ["borç", "fatura", "vergi", "muhasebe", "ödenecek"],
  },

  // Tek başına eşleştiğinde AMBIGUOUS_ENTITY sayılan riskli anahtar kelimeler
  // (örn. "now " İngilizce günlük kullanımda da geçebilen bir kelime).
  LOW_CONFIDENCE_KEYWORDS: {
    "now-saglik": ["now "],
  },

  BOUNDARY_MARKERS: ["tarafında", "için", " ile ", "ile ilgili", "projesinde", "adına", "konusunda"],

  RESPONSIBILITY_LANGUAGE_PATTERNS: [
    /sorumlu(luk)?/i,
    /netleştir/i,
    /g[öo]rev\s*s[ıi]n[ıi]r/i,
    /kim\s*ne\s*yap/i,
  ],

  // Genel bir "-ma/-me" son eki taraması KASITLI OLARAK kullanılmıyor --
  // "sinema", "reklama" (yönelme hali) gibi kelimelerde yanlış pozitif
  // üretirdi. Bunun yerine V1.4'ün kendi APPROVAL_PATTERNS/PROHIBITED_ACTION_
  // PATTERNS'ından türetilen, doğrulanmış somut fiil listesi kullanılıyor.
  NEGATED_ACTION_VERBS: [
    /art[ıi]rma\b/i,
    /azaltma\b/i,
    /kapatma\b/i,
    /yay[ıi]nlama\b/i,
    /g[öo]nderme\b/i,
    /de[ğg]i[şs]tirme\b/i,
    /yapma\b/i,
    /verme\b/i,
    /imzalama\b/i,
    /silme\b/i,
    /dokunma\b/i,
  ],
};
