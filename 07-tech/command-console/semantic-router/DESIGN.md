# DESIGN — Semantic AI Router

Başlık: Semantic AI Router Mimarisi ve Guardrail'ler
Versiyon: 1.1
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12 (v1.1: P2 Foundation eklendi — provider interface, secret loader, strict validator, redaction, trace/cache contract; hâlâ gerçek LLM çağrısı yok)
Durum: P0 + P1 + P2 Foundation tamamlandı. Gerçek LLM entegrasyonu (P2.5+) henüz yok.
Onaylayan: Furkan

## Kapsam ve Sınır

Bu klasör **V1.4 deterministic Command Console'dan (`../app.js`) tamamen izole**. Hiçbir dosyası V1.4'ü import etmez, değiştirmez veya davranışını etkilemez. Bu fazda (P0+P1): **hiçbir LLM çağrısı, API key, network isteği yok.**

## Mimari (özet — önceki oturumda onaylandı)

```
RAW INPUT → [P1: Deterministik Pre-Filter] → DETERMINISTIC_ONLY | SEMANTIC_AI_REQUIRED | NEEDS_CLASSIFICATION
                                                        │ (P2, henüz yok)
                                                        ▼
                                          SEMANTIC AI ROUTER (LLM çağrısı)
                                                        │
                                                        ▼
                                          STRICT SCHEMA VALIDATOR (P2)
                                                        │
                                                        ▼
                                          V1.4 DETERMINISTIC SAFETY LAYER (bağımsız yeniden doğrulama)
                                                        │
                                                        ▼
                                          RISK/APPROVAL GATES (OR mantığı) → PREVIEW → Furkan onayı
```

## Mimari Kural (değişmez)

Semantic AI = **ANLAR + ÖNERİR**. Strict Schema Validator = **ÇIKTI FORMATINI DOĞRULAR**. V1.4 Deterministic Safety Layer = **SINIRLAR + CONFLICT KONTROLÜ YAPAR**. Approval Gates = **KRİTİK EYLEMLERİ DURDURUR**. Furkan = **SON KRİTİK KARARI VERİR**. Persistence/Automation = **ŞİMDİLİK YOK**.

**AI hiçbir durumda deterministic safety flag'i temizleyemez.** AI `approval=true` VEYA deterministic `approval=true` ise → **FINAL APPROVAL REQUIRED** (OR kuralı, korunuyor).

## Guardrail 1 — Confidence Mimarisi

`SEMANTIC_CONFIDENCE_THRESHOLD` hard-code değil, `prefilter/config.js`'te tanımlı (bugün P1'de kullanılmıyor — P1'de hiç AI confidence yok — ama P2'nin doğrudan okuyacağı yer burası, config sözleşmesi şimdiden sabitleniyor).

Final confidence değerlendirmesi (P2'de) **sadece AI'ın kendi sayısına güvenmeyecek** — deterministik sinyallerle birleştirilecek: schema valid mi, workspace mevcut mu, related project/person mevcut mu, category enum'da mı, primary_action tanımlı mı, responsibility conflict var mı, prohibited action conflict var mı. Düşük confidence VEYA validation conflict → `NEEDS_CLASSIFICATION`/`INPUT_REQUIRED`.

## Guardrail 2 — Versioning + Traceability

P2'de her Semantic Router çıktısı şu metadata'yı taşıyacak: `schema_version`, `prompt_version`, `provider`, `model`, `trace_id`, `created_at`. Bu, P0 contract'ında (`contracts/intent-extraction-contract.md`) zaten zorunlu alan olarak tanımlandı.

## Guardrail 3 — Privacy / Secret Safety

LLM çağrısından ÖNCE bir **INPUT SAFETY / REDACTION** katmanı gerekecek (P2'de implement edilecek, contract'ta arayüzü tanımlı): API key, password, token, secret, credential, authorization header, private key benzeri örüntüler modele gönderilmeden temizlenir/reddedilir. Semantic Router **hiçbir credential saklamaz** — bu ilke `GOVERNANCE/security/credentials-policy/CREDENTIALS_POLICY.md` ile birebir tutarlı, tekrar icat edilmedi.

## Guardrail 4 — Strict Output Validation (P2 kapsamı, sözleşmesi burada)

LLM'in JSON döndürmesi kabul için yeterli değil. Tanımsız `workspace`/`category`/`primary_action`/`status`/`risk`/`approval` değeri **sessizce kabul edilmez** — fail-closed: `UNKNOWN`/`NEEDS_CLASSIFICATION`/`INPUT_REQUIRED`. AI yeni bir workspace uydurursa gerçek sistem entity'si oluşturulmaz. (Validator modülü bu fazda yazılmadı — P1'de LLM çıktısı yok, doğrulanacak bir şey yok. Sözleşmesi `contracts/intent-extraction-contract.md`'de hazır.)

## Guardrail 5 — Cache Versioning

Cache key tek başına `normalized_input` olmayacak: `normalized_input + schema_version + prompt_version + provider/model` birlikte anahtar oluşturacak (P2 kapsamı, sözleşmesi contract'ta).

## Guardrail 6 — Future Context Pack Interface

V1 Semantic Router **stateless** kalır. `context_pack = null` bugün. Gelecekte (client profile, project context, responsibility map, recent decisions, service catalog, workspace metadata) taşıyabilecek bir `CONTEXT_PACK` arayüzü **kapalı ama sözleşmesi tanımlı** şekilde `contracts/intent-extraction-contract.md`'de duruyor — ana contract'ı bozmadan aktifleştirilebilir.

## Bu Fazda Ne Var, Ne Yok

| Var (P0 + P1 + P2 Foundation) | Yok (P2.5+) |
|---|---|
| `contracts/intent-extraction-contract.md` — I/O sözleşmesi | Gerçek LLM çağrısı (`ProviderAdapter.extractIntent()` her zaman stub hata fırlatır) |
| `prefilter/` — DETERMINISTIC_ONLY / SEMANTIC_AI_REQUIRED / NEEDS_CLASSIFICATION kararı | Gerçek API key / sağlayıcı bağlantısı |
| `provider/` — provider-agnostic arayüz + config (stub, network yok) | Gerçek secret değeri (sadece okuma arayüzü var) |
| `secrets/` — server-side secret-loading arayüzü (gerçek secret yok) | Cache deposu (sadece key üretim sözleşmesi var) |
| `validator/` — strict schema validation, fail-closed | Context pack'in aktif kullanımı (hep `null`) |
| `redaction/` — credential pattern tarama + bloklama | Paylaşımlı registry dosyası (SoT drift kararı — planlandı, uygulanmadı) |
| `metadata/` — trace envelope + cache key contract | |
| `tests/` — 63 test (25 P1 + 38 P2 Foundation), hepsi PASS | |

## Source of Truth Drift — Karar (P2 Foundation)

P1 raporunda tespit edilen risk incelendi: `prefilter/config.js` (ve şimdi `validator/schema-validator.js`) V1.4'ün `../../app.js` içindeki `WORKSPACES`/`BOUNDARY_MARKERS`/kategori listelerinin **bağımsız kopyalarını** tutuyor.

**İnceleme sonucu:** Güvenli, V1.4'ü değiştirmeyen bir read-only adapter **bu fazda mümkün değil** — sebep teknik: `app.js` bir tarayıcı script'i (üst-seviye `const`, `document`/`window` referansları, `module.exports` yok), `semantic-router/` modülleri ise CommonJS/Node. İkisi farklı çalışma zamanlarında yaşıyor; `app.js`'i Node'dan `require()` edilebilir hale getirmek (en ufak haliyle bile, örn. dosya sonuna `module.exports` eklemek) **`app.js`'e dokunmak** anlamına gelir — bu fazda açıkça yasak.

**Karar: Kodlanmadı, P3 migration planına bırakıldı.** Öneri: `WORKSPACES`/`BOUNDARY_MARKERS`/kategori sözlüğü, hem tarayıcının hem Node'un okuyabileceği **paylaşımlı, saf veri dosyasına** (örn. `07-tech/command-console/shared/registry.json`) çıkarılır; `app.js` bunu `<script>` ile, `semantic-router/*` modülleri `require()`/`fs.readFileSync` ile okur. Bu, V1.4'ün davranışını bozmadan yapılabilecek en küçük birleştirme adımıdır — ama gerçek bir dosya taşıma/refactor işlemi olduğu için **bu fazda uygulanmadı**, sadece planlandı. Yeni bir ikinci/üçüncü Source of Truth (örn. ayrı bir veritabanı) **kurulmadı**.

## Bilinen Riskler / Kasıtlı Kararlar

1. **`prefilter/config.js`, V1.4'ün `app.js` içindeki `WORKSPACES`/`BOUNDARY_MARKERS` listelerinin BAĞIMSIZ bir kopyasını tutuyor** — izolasyon kararı gereği (V1.4'e dokunulmadı). Bu, iki listenin zamanla birbirinden sapması (drift) riski yaratır. P3'te (entegrasyon fazı) tek kaynağa birleştirilmesi gerekecek.
2. Negation/complexity sinyalleri (`NEGATED_ACTION_VERBS`) V1.4'ün `PROHIBITED_ACTION_PATTERNS`/`APPROVAL_PATTERNS`'ından esinlenerek ayrı tanımlandı, aynı sebeple.
3. Pre-filter'ın kendi eşikleri (MULTI_INTENT_MIN_MATCHES vb.) bugün deneyimsel/tahmini — gerçek kullanım verisiyle kalibre edilmedi.

Kaynak: FAYRO OS Semantic AI Router mimari onayı (2026-08-12), `07-tech/command-console/DESIGN.md` (V1.4), `07-tech/integrations/AI-providers/PROVIDER_INTERFACE.md`, `GOVERNANCE/security/credentials-policy/CREDENTIALS_POLICY.md`.
