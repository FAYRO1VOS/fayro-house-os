# CLIENT_SUCCESS

Amaç: Aktif müşteri ilişkisini sağlıklı yürütme standardı.

## Geri Bildirim Döngüsü
Teslim sonrası müşteriden geri bildirim alınır. Olumsuz geri bildirim savunulmaz — analiz edilir, çözülür, ilgili SOP güncellenir.

## Referans Sistemi
Memnun kalan her müşteriden, açık izin alınarak referans, yorum, video veya başarı hikayesi toplanır. İzinsiz hiçbir müşteri içeriği referans/case study olarak kullanılmaz. Toplanan referans `02-sales-crm/referrals`'a eklenir. Hedef: her tamamlanan iş en az bir yeni fırsat oluşturmalıdır.

## Pasif Müşteri
İş biten müşteri unutulmaz. Belirli aralıklarla tekrar iletişim kurulur (bkz. sales-crm/pipeline üzerinden yeniden açılabilir fırsat).

## Müşteri Kaybı Analizi (churn — kaybedilen aktif müşteri, kaybedilen teklif/deal ile karıştırılmaz)
Aktif bir müşteri ilişkisi sona erdiğinde (client STATUS: COMPLETED/ARCHIVED, memnuniyetsizlik nedeniyle): Sebep, Çözüm, tekrar yaşanmaması için alınacak önlem raporlanır. Bu, `DEAL_SCHEMA.md`'nin REJECTION_REASON alanından farklıdır — REJECTION_REASON hiç müşteri olmamış bir teklifin reddi içindir, buradaki ise zaten aktif olan bir müşterinin kaybıdır.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 3.18, 3.19, 4.18, 7.13, 7.17 (Controlled Knowledge Import, Part 03 + Part 04 + Part 07)
STATUS: ACTIVE NOW
