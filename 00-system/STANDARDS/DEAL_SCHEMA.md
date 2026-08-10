# Deal Schema

Her pipeline kaydı (lead/fırsat) için desteklenmesi gereken alanlar (henüz veritabanı değil, sadece alan tanımı):

## Temel Alanlar
LEAD_ID, SOURCE, TEMPERATURE, CLIENT, VALUE, STATUS, CLOSE_PROBABILITY, OWNER, INTERESTED_SERVICE, REJECTION_REASON

STATUS: bkz. STATUS_STANDARD.md (satış döngüsü: NEW -> CONTACTED -> QUALIFIED -> MEETING -> PROPOSAL -> NEGOTIATION -> WON -> LOST)
TEMPERATURE: HOT / WARM / COLD
SOURCE (enum): Instagram, TikTok, Google, Referans, LinkedIn, Etkinlik, Organizasyon, WhatsApp, Web Sitesi, Soğuk Satış, İş Ortakları
INTERESTED_SERVICE: bkz. LEADERSHIP/COMPANY_IDENTITY.md Hizmet Kataloğu (CORE_SERVICE listesinden)
REJECTION_REASON: STATUS: LOST olduğunda zorunlu — reddedilen teklif başarısızlık sayılmaz, sebep analiz edilir.

## İletişim Bilgileri
NAME, COMPANY, PHONE, EMAIL, INSTAGRAM, ADDRESS, CITY, SECTOR, FIRST_CONTACT_DATE, LAST_MEETING_DATE, CONTACT_PERSON

## Teklif Takibi (STATUS: PROPOSAL olduğunda)
PROPOSAL_DATE, LAST_FOLLOWUP_DATE, EXPECTED_RESPONSE_DATE

## Görüşme Kaydı (her görüşme için ayrı giriş)
DATE, PARTICIPANT, SUMMARY, CLIENT_REQUEST, NEXT_STEP, FOLLOWUP_DATE

## NOTES Kuralı
Notlar kişisel yorum içermez, sadece ölçülebilir bilgi içerir.
Yanlış: "Müşteri garipti." Doğru: "Müşteri haftada 3 içerik istedi."

Kaynak: Legacy FAYRO OS Specification v1.0, madde 4.4, 4.6, 4.9, 4.16 (Controlled Knowledge Import, Part 04)
STATUS: ACTIVE NOW
