# DESIGN — Fayro Model Eval Lab (P2.5)

Başlık: Model Eval Lab Mimarisi
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-13
Durum: Mimari + mock-doğrulanmış — gerçek API çağrısı yok
Onaylayan: Furkan

## Amaç

P3'ten önce "hangi LLM primary olsun" kararını vendor pazarlamasına veya varsayıma değil, Fayro'nun kendi workload'u üzerinde ölçülen sonuçlara dayandırmak. Bu faz **hiçbir gerçek model çalıştırmaz** — sadece ölçüm altyapısını kurar ve mock provider'larla doğrular.

## Akış

```
gold-dataset/fixtures.js (22 fixture, DRAFT_PENDING_HUMAN_REVIEW)
        │
        ▼
runner/eval-runner.js  ──uses──▶  provider/provider-adapter.js (../../provider/, aynı arayüz)
        │                              │
        │                    runner/mock-providers.js (bugün tek somut implementasyon)
        ▼
scoring/metrics.js + scoring/safety-rules.js + scoring/model-score.js
        │
        ▼
selection/role-selector.js  ──▶  PRIMARY / JUDGE / FAILOVER / BULK_ECONOMY
        │
        ▼
shadow/shadow-runner.js (ileride: yeni model çıktığında actionable=false ile karşılaştırma)
```

## Gold Dataset Dürüstlük Notu

`gold-dataset/fixtures.js`'deki 22 fixture **Claude Code tarafından yazılan ilk taslaktır**. Her biri `status: "DRAFT_PENDING_HUMAN_REVIEW"` taşır. Furkan/Enes onaylamadan bunlar otoriter "doğru cevap" sayılmaz — `gold-dataset.test.js` bunu bir test olarak da doğruluyor (hiçbir fixture yanlışlıkla `HUMAN_APPROVED` değil).

## Neden Mock Provider

`runner/mock-providers.js`'teki `MockGoodProvider`/`MockBadProvider`, `../provider/provider-adapter.js`'teki **aynı** `ProviderAdapter` sınıfını extend eder — bu, runner'ın gerçekten provider-agnostic olduğunun kanıtı: gerçek bir `AnthropicAdapter` eklendiğinde runner'da hiçbir satır değişmeyecek, sadece hangi adapter'ın enjekte edildiği değişecek.

`MockGoodProvider` fixture'ın kendi `expected_*` alanlarına bakarak "doğru" cevap üretir — bu gerçek bir model değerlendirmesi değildir, sadece scoring/safety-rules mekaniğinin çalıştığını kanıtlar. `MockBadProvider` kasıtlı olarak yasak eylemleri kaçırır — CRITICAL SAFETY FAIL tespitinin gerçekten çalıştığını göstermek için.

## Gerçek Model Yarışına Geçmeden Önce

Bu dosya/mimari **hiçbir gerçek kazananı belirlemez**. `selection/role-selector.js` gerçek `modelScores` girdisi bekler — bugün böyle bir veri seti yok (7 aday model `model-registry.js`'de hepsi `enabled:false, status:EVAL_PENDING`). Gerçek yarış, gerçek API key'ler sağlandığında ve gerçek adapter'lar (`AnthropicAdapter` vb.) yazıldığında başlar.

Kaynak: `../DESIGN.md` (Semantic Router genel mimarisi), `../contracts/intent-extraction-contract.md`, `../validator/schema-validator.js`.
