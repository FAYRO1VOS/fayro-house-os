# _LEAD_TEMPLATE

Başlık: Lead Detay Dosyası Şablonu
Versiyon: 1.1
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne Zaman Kullanılır

Bir lead `STATUS: MEETING`'e geçtiğinde bu dosya kopyalanır ve `<LEAD_ID>-<CLIENT>.md` adıyla `pipeline/` altına kaydedilir (örn. `004-AcmeCorp.md`). NEW/CONTACTED/QUALIFIED aşamasındaki lead'ler için bu dosya açılmaz — `PIPELINE_BOARD.md` satırı yeterlidir.

Bu dosya `PIPELINE_BOARD.md`'nin yerine geçmez; board'daki satır silinmez, `DETAIL_FILE` kolonuna bu dosyanın adı yazılır.

---

# LEAD: [CLIENT ADI]

## Temel Alanlar
LEAD_ID:
SOURCE:
TEMPERATURE:
CLIENT:
VALUE:
STATUS:
CLOSE_PROBABILITY:
OWNER:
INTERESTED_SERVICE:
REJECTION_REASON: (yalnızca STATUS: LOST olduğunda zorunlu)

## İletişim Bilgileri
NAME:
COMPANY:
PHONE:
EMAIL:
INSTAGRAM:
ADDRESS:
CITY:
SECTOR:
FIRST_CONTACT_DATE:
LAST_MEETING_DATE:
CONTACT_PERSON:

## Teklif Takibi (STATUS: PROPOSAL olduğunda doldurulur)
PROPOSAL_DATE:
LAST_FOLLOWUP_DATE:
EXPECTED_RESPONSE_DATE:
SERVICE(S): (bkz. STANDARDS/SERVICE_CATALOG.md — teklif taslağı buradaki SERVICE_ID/SCOPE/DELIVERABLES/STANDARD_PRICE alanlarından üretilir; Sales/CRM Agent katalogdaki fiyatı/maliyeti/marjı değiştiremez, katalog dışı özel fiyat/indirim STANDARDS/APPROVAL_GATES.md onayı gerektirir)

## Görüşme Kaydı (her görüşme için yeni bir alt başlık eklenir)

### Görüşme 1
DATE:
PARTICIPANT:
SUMMARY:
CLIENT_REQUEST:
NEXT_STEP:
FOLLOWUP_DATE:

## NOTES
Notlar kişisel yorum içermez, sadece ölçülebilir bilgi içerir (bkz. DEAL_SCHEMA NOTES Kuralı).

Kaynak: STANDARDS/DEAL_SCHEMA.md — alan tanımları buradan tekrar icat edilmeden birebir kopyalanmıştır.
