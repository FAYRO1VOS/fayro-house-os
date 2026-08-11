# PIPELINE_BOARD

Başlık: Satış Pipeline Master Board
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-11
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne İşe Yarar

Tüm aktif lead'lerin (NEW → NEGOTIATION arası) tek satırlık özetini tutan master tablo. `STANDARDS/DEAL_SCHEMA.md`'nin tek Source of Truth'udur — burada icat edilen yeni alan adı yoktur.

- Furkan yeni lead geldiğinde buraya tek satır ekler (1 dakikadan kısa sürer).
- Enes `NEXT_ACTION` / `FOLLOWUP_DATE` kolonlarını tarayarak günlük takip kontrolü yapar.
- `sales-kpi/WEEKLY_SALES_REPORT.md` bu tablo + `won/` + `lost/` kayıtlarından beslenir.

## Kullanım Kuralları

- **Zorunlu minimum alanlar (yeni lead eklerken):** LEAD_ID, CLIENT, SOURCE, STATUS, OWNER. Diğer alanlar boş bırakılıp sonradan doldurulabilir.
- **LEAD_ID:** sıralı numara (001, 002, 003, ...), tekrar kullanılmaz.
- **STATUS:** yalnızca `STANDARDS/STATUS_STANDARD.md`'deki satış döngüsü değerleri kullanılır (NEW, CONTACTED, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST).
- **STATUS: MEETING'e geçtiğinde:** `_LEAD_TEMPLATE.md` kopyalanarak `<LEAD_ID>-<CLIENT>.md` adıyla detay dosyası açılır, `DETAIL_FILE` kolonuna dosya adı yazılır. Board satırı silinmez — detay dosyası board'un yerine geçmez, onu genişletir.
- **STATUS: WON veya LOST olduğunda:** Kayıt (ve varsa detay dosyası) ilgili klasöre (`../won/` veya `../lost/`) taşınır, bu tablodan satır silinir. LOST için `REJECTION_REASON` doldurulmadan taşınmaz (DEAL_SCHEMA zorunluluğu).
- **REJECTION_REASON:** kişisel yorum değil, ölçülebilir sebep içerir (bkz. DEAL_SCHEMA NOTES Kuralı).

## Board

| LEAD_ID | CLIENT | SOURCE | TEMPERATURE | STATUS | VALUE | CLOSE_PROBABILITY | OWNER | INTERESTED_SERVICE | NEXT_ACTION | FOLLOWUP_DATE | REJECTION_REASON | DETAIL_FILE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | |

Kaynak: STANDARDS/DEAL_SCHEMA.md, STANDARDS/STATUS_STANDARD.md, sop-playbooks/SALES_PLAYBOOK.md — bu üç dosyadaki tanımlar burada tekrar icat edilmez, birebir uygulanır.
