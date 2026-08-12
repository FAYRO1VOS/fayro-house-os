# CAMPAIGN_BOARD

Başlık: Reklam Kampanyaları Master Board
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne İşe Yarar

Tüm müşterilerin aktif/planlanan reklam kampanyalarının tek satırlık özet tablosu. `STANDARDS/CAMPAIGN_SCHEMA.md`'nin tek Source of Truth'udur.

## ÖNEMLİ — Açık Bir Boşluk

`STANDARDS/STATUS_STANDARD.md`, Görev/Satış/Müşteri/İçerik için 4 döngü tanımlıyor ama **Kampanya için resmi bir STATUS döngüsü tanımlamıyor**. Aşağıdaki STATUS değerleri (PLANNING → ACTIVE → PAUSED → COMPLETED) **geçicidir**, `STATUS_STANDARD.md`'ye resmi olarak eklenmedi — bu, DECISION_LOG onayı gerektiren ayrı bir karardır (bkz. "ikinci status sistemi kurulmaz" ilkesi). Şimdilik bu 4 değer kullanılıyor, iş durdurulmadı; resmileştirme Furkan/Enes kararına bırakıldı.

## Kullanım Kuralları

- **CAMPAIGN_ID formatı:** `CAMPAIGN-NNNN` (bkz. `STANDARDS/ID_SYSTEM.md`).
- **BUDGET değişikliği:** `STANDARDS/APPROVAL_GATES.md` ("reklam bütçesi artırma") onay gerektirir.
- **Kampanya yayınlama/başlatma:** `APPROVAL_GATES.md` ("reklam yayınlama") onay gerektirir — bu board'a satır eklemek yayın değildir, sadece planlamadır.
- **GOAL:** bkz. `06-knowledge/sop-playbooks/ADVERTISING.md` Reklam Amaçları.

## Board

| CAMPAIGN_ID | CLIENT | PLATFORM | GOAL | START_DATE | END_DATE | BUDGET | STATUS (geçici) | NEXT_ACTION |
|---|---|---|---|---|---|---|---|---|
| CAMPAIGN-0001 | NOW Yaşam Sağlık | Meta | (FURKAN/ENES INPUT REQUIRED) | | | FURKAN/ENES INPUT REQUIRED | PLANNING | bkz. Now-Yasam-Saglik/strategy/AD_SPRINT_PLAN.md |

Kaynak: STANDARDS/CAMPAIGN_SCHEMA.md, STANDARDS/APPROVAL_GATES.md, 06-knowledge/sop-playbooks/ADVERTISING.md — tanımlar tekrar icat edilmez.
