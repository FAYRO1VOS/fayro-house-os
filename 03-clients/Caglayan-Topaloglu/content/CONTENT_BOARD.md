# CONTENT_BOARD

Başlık: Müşteri İçerik Üretim Board'u
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne İşe Yarar

Bu müşterinin tüm içeriklerinin (fikir aşamasından yayına kadar) tek satırlık özet tablosu. `STANDARDS/CONTENT_SCHEMA.md`'nin tek Source of Truth'udur — burada icat edilen yeni alan adı yoktur.

- Content Strategy/Growth & Content Agent (veya bugün Furkan/Enes) yeni içerik fikrini buraya tek satır olarak ekler.
- `00-system/COMMAND_CENTER.md` → TODAY bloğu (bugünkü çekim/edit/onay/yayın) buradan okunur.
- `09-reporting/dashboards/marketing-dashboard/MARKETING_PANEL.md` buradan özetlenir.

## Kullanım Kuralları

- **CONTENT_ID formatı:** `CONTENT-NNNN` (bkz. `STANDARDS/ID_SYSTEM.md`).
- **STATUS:** yalnızca `STANDARDS/STATUS_STANDARD.md`'deki İçerik döngüsü kullanılır (IDEA→BRIEF→SCHEDULED→SHOOT→EDITING→CLIENT_REVIEW→REVISION→APPROVED→PUBLISHED→REPORTED) — ikinci bir status sistemi kurulmaz (bkz. `DECISION_LOG.md`).
- **STATUS: PUBLISHED sonrası:** PERFORMANCE verisi `CONTENT_SCHEMA.md`'nin PERFORMANCE Detayı alanlarıyla (İzlenme, Erişim, Kaydetme, Paylaşım, Yorum, Takipçi, Satış Etkisi) doldurulur, satır silinmez (REPORTED aşamasına geçer, board'da kalır — geçmiş performans referansı için).
- Senaryo (PURPOSE/HOOK_3SEC/MAIN_MESSAGE/CTA/SHOOT_PLAN/EDIT_NOTES) ve Revize Kaydı gibi çok satırlı alanlar bu board'a sığmaz — gerekirse ayrı bir detay notu olarak `assets/` klasöründe tutulur, board sadece özet kalır.

## Board

| CONTENT_ID | PLATFORM | FORMAT | OWNER | STATUS | SHOOT_DATE | PUBLISH_DATE | NEXT_ACTION |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Kaynak: STANDARDS/CONTENT_SCHEMA.md, STANDARDS/STATUS_STANDARD.md — bu dosyalardaki tanımlar burada tekrar icat edilmez, birebir uygulanır.
