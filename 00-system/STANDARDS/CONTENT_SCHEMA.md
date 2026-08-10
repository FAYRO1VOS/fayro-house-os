# Content Schema

Her içerik kaydı için desteklenmesi gereken alanlar (henüz veritabanı değil, sadece alan tanımı):

CONTENT_ID, CLIENT, PLATFORM, FORMAT, OWNER, STATUS, SHOOT_DATE, PUBLISH_DATE, APPROVAL, ASSET_LOCATION, PERFORMANCE

STATUS: bkz. STATUS_STANDARD.md (içerik döngüsü — REVISION durumu revize aşamasını zaten karşılar, ayrı bir görev durumu icat edilmez)

## Revize Kaydı (STATUS: REVISION olduğunda, her revize için ayrı giriş)
REQUESTED_BY, WHAT_CHANGED, WHEN, REVISION_NUMBER

## Senaryo (BRIEF aşamasında hazırlanır)
PURPOSE, HOOK_3SEC, MAIN_MESSAGE, CTA, SHOOT_PLAN, EDIT_NOTES

## ASSET_LOCATION Organizasyonu
Üretim dosyaları `clients/<isim>/assets` altında şu sırayla organize edilir: Ham Görüntüler → Seçilenler → Kurgu → Final → Thumbnail → Kapak → Altyazı → Teslim. Bu bir dosya organizasyon kuralıdır, content STATUS döngüsünün yerine geçmez.

## Paylaşım Kontrol Listesi (PUBLISHED öncesi)
☐ Başlık ☐ Açıklama ☐ Hashtag ☐ Etiket ☐ Konum ☐ Kapak ☐ Saat

## PERFORMANCE Detayı (REPORTED aşamasında ölçülür)
İzlenme, Erişim, Kaydetme, Paylaşım, Yorum, Takipçi, Satış Etkisi.

## Teknik Kalite
Hiçbir video 1080p altında teslim edilmez. Mümkün olan her projede 4K arşiv oluşturulur (bkz. quality-control/DELIVERY_CHECKLIST.md).

Kaynak: Legacy FAYRO OS Specification v1.0, madde 5.12, 6.7, 6.13, 6.15, 6.16 (Controlled Knowledge Import, Part 05 + Part 06)
STATUS: ACTIVE NOW
