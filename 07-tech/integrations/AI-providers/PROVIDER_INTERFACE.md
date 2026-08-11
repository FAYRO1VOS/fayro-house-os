# PROVIDER_INTERFACE

Başlık: AI Medya Sağlayıcı Soyutlama Katmanı
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: FUTURE CAPABILITY (arayüz tanımı hazır, gerçek entegrasyon kurulmadı)
Onaylayan: Furkan

## Ne İşe Yarar

Growth & Content Agent (ileride) hiçbir zaman doğrudan tek bir sağlayıcıya (örn. Runway) bağımlı olmaz. Agent bir CAPABILITY ister, bu katman hangi sağlayıcının o isteği karşılayacağına karar verir. Sağlayıcı değiştiğinde (fiyat/kalite nedeniyle) sadece bu dosyadaki eşleştirme değişir — agent'ın prompt/karar mantığı değişmez.

Bu, `07-tech/ai-agents/AI_PRINCIPLES.md`'nin zaten var olan "Vendor Bağımsızlığı" ilkesinin (bugün ChatGPT/Claude Code için tanımlı) görsel/video üretim araçlarına genişletilmiş halidir — yeni bir ilke icat edilmemiştir.

**Bugün hiçbir gerçek API entegrasyonu, credential veya bağlantı kurulmamıştır.** Bu dosya yalnızca arayüz/sözleşme tanımıdır.

## Capability'ler

| CAPABILITY | Açıklama | Girdi | Çıktı |
|---|---|---|---|
| TEXT_TO_IMAGE | Metin promptundan görsel üretimi | prompt, aspect_ratio, stil notu | görsel dosyası |
| TEXT_TO_VIDEO | Metin promptundan video üretimi | prompt, süre, aspect_ratio | video dosyası |
| IMAGE_TO_VIDEO | Statik görseli hareketli hale getirme | kaynak görsel, hareket notu, süre | video dosyası |

## Sağlayıcı Eşleştirmesi (bugün boş — ileride doldurulacak)

| CAPABILITY | Birincil Sağlayıcı | Yedek Sağlayıcı |
|---|---|---|
| TEXT_TO_IMAGE | (belirlenmedi) | — |
| TEXT_TO_VIDEO | Runway (aday, henüz bağlı değil) | (belirlenmedi) |
| IMAGE_TO_VIDEO | (belirlenmedi) | — |

## Kural

- Agent hiçbir zaman sağlayıcıya özel bir API çağrısını doğrudan kodlamaz/ezberlemez — her zaman CAPABILITY adıyla ister, bu tablo yönlendirir.
- Credential/API key bu dosyada veya repo içinde **hiçbir zaman** tutulmaz (bkz. `GOVERNANCE/security/credentials-policy/CREDENTIALS_POLICY.md`) — gerçek entegrasyon kurulduğunda anahtarlar sistem dışı bir secret management aracında saklanır.
- Üretilen içerik `03-clients/<isim>/content/CONTENT_BOARD.md`'ye CONTENT_ID ile bağlanır, burada ayrıca tutulmaz (SoT ihlali olmaz).

Kaynak: 07-tech/ai-agents/AI_PRINCIPLES.md (Vendor Bağımsızlığı ilkesi) — burada tekrar icat edilmez, görsel/video üretimine uygulanmıştır.
