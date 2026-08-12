# INTENT_EXTRACTION Capability Contract (P0)

Başlık: Semantic AI Router — INTENT_EXTRACTION Capability Sözleşmesi
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: SÖZLEŞME TANIMLI (implementasyon P2'de)
Onaylayan: Furkan

## Ne İşe Yarar

`07-tech/integrations/AI-providers/PROVIDER_INTERFACE.md`'nin capability-abstraction desenini genişletir — yeni bir capability: **INTENT_EXTRACTION**. Bu dosya, `PROVIDER_INTERFACE.md`'nin kendisini DEĞİŞTİRMEZ (izolasyon kararı) — capability'nin tam sözleşmesi burada yaşar, entegrasyon fazında (P3) ana dosyaya referans olarak eklenebilir.

**Bugün hiçbir sağlayıcıya bağlı değil, hiçbir credential/API key içermiyor.**

## Capability Tanımı

| Alan | Değer |
|---|---|
| CAPABILITY | `INTENT_EXTRACTION` |
| Girdi | Serbest metin (Türkçe doğal dil, `raw_input`) |
| Çıktı | Yapılandırılmış JSON (aşağıdaki şema) |
| Yan etki | **Yok** — hiçbir dosya yazmaz, hiçbir mesaj göndermez |
| Otorite | **Yok** — çıktı bir ÖNERİ'dir, V1.4 Safety Layer + Furkan onayı olmadan hiçbir eylem gerçekleşmez |

## Input Contract

```json
{
  "raw_input": "string, aynen, değiştirilmeden",
  "context_pack": null
}
```

`context_pack`: **Guardrail 6.** Bugün her zaman `null`. Gelecekte `{client_profile, project_context, responsibility_map, recent_decisions, service_catalog, workspace_metadata}` şeklini alabilir — ama bu alanın varlığı/yokluğu router'ın temel sözleşmesini bozmaz (opsiyonel, geriye dönük uyumlu).

## Output Contract

```json
{
  "schema_version": "1.0",
  "prompt_version": "string",
  "provider": "string",
  "model": "string",
  "trace_id": "string (uuid)",
  "created_at": "ISO datetime",
  "raw_input": "string, aynen geri yansıtılır",
  "global_constraints": ["string"],
  "intents": [
    {
      "intent_id": "INTENT-<trace_id>-<idx>",
      "title": "string",
      "summary": "string",
      "workspace": "ENUM — mevcut WORKSPACES registry'sinden, AI yeni değer icat edemez",
      "related_project": "workspace id | null",
      "related_people": [{ "id": "string", "role": "string" }],
      "category": "ENUM — mevcut kategori sözlüğünden (money|content|ads|leads|coordination|production|pr)",
      "primary_action": "string",
      "sub_actions": ["string"],
      "responsibilities": [{ "domain": "string", "owner": "string" }],
      "prohibited_actions": ["string"],
      "priority": "ENUM — STANDARDS/PRIORITY_STANDARD.md: P0|P1|P2|P3",
      "deadline": "ISO date | null — asla uydurulmaz",
      "responsible": "string | INPUT_REQUIRED",
      "risk_candidate": "LOW|HIGH|UNKNOWN — AI'ın ÖNERİSİ, otoriter değil",
      "approval_candidate": "string | null — AI'ın ÖNERİSİ, otoriter değil",
      "missing_information": ["string"],
      "confidence": 0.0,
      "semantic_notes": "string"
    }
  ]
}
```

## Enum Kaynakları (tekrar icat edilmedi, referans)

- `workspace`: V1.4 `app.js` → `WORKSPACES` (9 sabit değer)
- `priority`: `STANDARDS/PRIORITY_STANDARD.md` → P0-P3
- `category`: V1.4 `app.js` → `CATEGORY_KEYWORDS` anahtarları + `pr`

## Fail-Closed Kuralı

Bu alanlardan biri enum dışı bir değer taşırsa (Guardrail 4), **STRICT SCHEMA VALIDATOR** (P2) bunu sessizce kabul etmez → `workspace` geçersizse `NEEDS_CLASSIFICATION`, `priority`/`category` geçersizse `INPUT_REQUIRED` işaretiyle düşürülür. AI'ın hiçbir çıktısı, doğrulanmadan V1.4 Safety Layer'a geçmez.

## Cache Key Sözleşmesi (Guardrail 5)

```
cache_key = hash(normalized_input + schema_version + prompt_version + provider + model)
```

Router/prompt/model güncellendiğinde eski cache otomatik geçersiz olur (versiyon key'in parçası olduğu için).

## Redaction Sözleşmesi (Guardrail 3)

LLM çağrısından ÖNCE `raw_input` şu örüntülere karşı taranır: API key, password, token, secret, credential, authorization header, private key. Eşleşme varsa çağrı **yapılmaz**, `INPUT_REQUIRED`/güvenlik reddi döner. (Redaction'ın kod implementasyonu P2'de — bu sadece sözleşme.)

Kaynak: `PROVIDER_INTERFACE.md` (capability-abstraction deseni), `STANDARDS/ID_SYSTEM.md`, `STANDARDS/PRIORITY_STANDARD.md`, `GOVERNANCE/security/credentials-policy/CREDENTIALS_POLICY.md` — tanımlar tekrar icat edilmedi.
