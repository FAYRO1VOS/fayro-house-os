# _TASK_TEMPLATE

Başlık: Görev Detay Dosyası Şablonu
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-11
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne Zaman ve Nasıl Kullanılır

Yeni bir görev oluşturulduğunda bu dosya kopyalanır ve `<TASK_ID>-<kısa-başlık>.md` adıyla görevin mevcut STATUS'una karşılık gelen klasöre kaydedilir (örn. `backlog/003-instagram-teklif-hazirlama.md`).

STATUS değiştiğinde dosya, `STANDARDS/STATUS_STANDARD.md`'deki görev döngüsüne göre ilgili klasöre **taşınır** (`git mv`) — dosya içeriğindeki `STATUS` alanı da aynı anda güncellenir. Board/tablo dosyası yoktur: klasör konumu görevin STATUS'unu temsil eder, tek Source of Truth budur.

Klasörler: `backlog/ → ready/ → in-progress/ → review/ → blocked/ → done/ → archived/`

---

# GÖREV: [BAŞLIK]

## Temel Alanlar
TASK_ID:
TITLE:
OWNER:
CLIENT/PROJECT:
CATEGORY:
PRIORITY: (bkz. STANDARDS/PRIORITY_STANDARD.md — P0/P1/P2/P3)
STATUS: (bkz. STANDARDS/STATUS_STANDARD.md)
CREATED_DATE:
DUE_DATE: (zorunlu)
DEPENDENCY:
APPROVAL_REQUIRED:
EXPECTED_OUTPUT:
FILE_LOCATION:
CHECKLIST_REF:

## RISKS

## NOTES
Notlar kişisel yorum içermez, sadece ölçülebilir bilgi içerir.

## Görev Devri (yalnızca OWNER değiştiğinde doldurulur)
REASON:
NEW_OWNER:
NEW_DUE_DATE:
LAST_STATUS:

## Gecikme Protokolü (yalnızca DUE_DATE geçtiğinde doldurulur)
REASON:
RESPONSIBLE:
SOLUTION:
NEW_PLAN:

Kaynak: STANDARDS/TASK_SCHEMA.md, STANDARDS/STATUS_STANDARD.md, STANDARDS/PRIORITY_STANDARD.md — alan tanımları buradan tekrar icat edilmeden birebir kopyalanmıştır.
