# DECISION LOG

Format:
Karar / Tarih / Kararı Veren / Neden / Alternatifler / Risk / Beklenen Sonuç / Gözden Geçirme Tarihi / STATUS

STATUS: PENDING / APPROVED / REJECTED (bkz. COMMAND_CENTER.md → WAITING FOR ME)

---

Karar: FAYRO OS FINAL V1 bilgi mimarisi onaylandı (12 ana klasör, Phase 1-3 yol haritası).
Tarih: 2026-08-10
Kararı Veren: Furkan
Neden: Satış, operasyon, müşteri, içerik, reklam, finans ve AI ajanlarını tek merkezden yönetecek ölçeklenebilir sistem ihtiyacı.
Alternatifler: 24 üst klasörlü daha detaylı yapı değerlendirildi; kullanılabilirlik için 12 klasöre sadeleştirildi.
Risk: Erken aşamada gereksiz karmaşıklık; Phase kapılarıyla kontrol altına alındı.
Beklenen Sonuç: Furkan ve Enes'in teknik bilgi gerektirmeden günlük işi 10 saniyede görebilmesi.
Gözden Geçirme Tarihi: İlk 5 müşteri tamamlandığında (Phase 2 geçişi).
STATUS: APPROVED

---

Karar: Phase 2 Blueprint onaylandı (DEAL_SCHEMA, INTELLIGENCE_MAP, COMMAND_CENTER/DECISION_LOG küçük eklemeleri, 04-marketing-ads tam aktivasyonu).
Tarih: 2026-08-10
Kararı Veren: Furkan
Neden: Furkan ve Enes'in günlük kullanım sorularına V1 yapısını bozmadan cevap verebilecek minimal genişleme.
Alternatifler: Otomasyon/AI agent/entegrasyon şimdiden kurulması değerlendirildi, reddedildi — mimari hazır bırakıldı, aktivasyon ertelendi.
Risk: Yok — yalnızca 2 yeni dosya ve 2 mevcut dosyaya küçük ekleme, yeni klasör yok.
Beklenen Sonuç: Daily Usability 9/10 → 10/10, AI Readiness 8/10, Complexity 2/10 korunuyor.
Gözden Geçirme Tarihi: Phase 2 kapsamında ilk gerçek müşteri verisiyle test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 1.17'deki "30 günde çalışan AI sistemi" hedefi silinmedi; Next Phase hedefi olarak CURRENT_STATE.md'de STATUS: NOT_STARTED ile korundu.
Tarih: 2026-08-10
Kararı Veren: Furkan
Neden: Bilgi kaybı istenmiyor; AI/otomasyon mimari olarak hazır ama aktivasyonu Phase ilerlemesine bağlı.
Alternatifler: Hedefi tamamen geçersiz sayıp silmek değerlendirildi, reddedildi.
Risk: Yok — sadece dokümantasyon, aktivasyon yapılmadı.
Beklenen Sonuç: İlerleme olduğunda STATUS ve tarih güncellenecek, bilgi kaybolmayacak.
Gözden Geçirme Tarihi: AI/otomasyon aktivasyonu gündeme geldiğinde.
STATUS: APPROVED

---

Karar: AI çıktı kontrolü ilkesi risk bazlı olarak APPROVAL_GATES.md'ye eklendi; eski "hiçbir AI çıktısı insan kontrolü olmadan kullanılmaz" kuralı mutlak değil, risk seviyesine göre yorumlandı.
Tarih: 2026-08-10
Kararı Veren: Furkan
Neden: Mutlak kural gereksiz darboğaz yaratır; risk bazlı yaklaşım hem güvenliği hem günlük kullanılabilirliği korur.
Alternatifler: Eski mutlak kuralın aynen benimsenmesi değerlendirildi, reddedildi.
Risk: Düşük riskli işlemlerin yanlış sınıflandırılması — APPROVAL_GATES listesi net tutularak azaltıldı.
Beklenen Sonuç: Yüksek riskli işlemler (ödeme, sözleşme, hukuki karar, yayın, reklam bütçesi, veri silme, yetki değişikliği, geri döndürülemez işlemler) her zaman insan onayı gerektirir; düşük riskli analiz/taslak/rapor/öneri otomatik ilerleyebilir.
Gözden Geçirme Tarihi: İlk AI agent aktivasyonunda.
STATUS: APPROVED

---

Karar: PRIORITY_STANDARD 5 seviyeden (P0-P4) Legacy Spec madde 2.12'deki 4 seviyeye (P0=CRITICAL, P1=HIGH, P2=NORMAL, P3=LOW) düşürüldü; deadline/revenue impact/client impact/dependency/created date tie-breaker sıralaması eklendi.
Tarih: 2026-08-10
Kararı Veren: Furkan
Neden: Legacy tanımlar daha kesin kriterlere sahip (P0 = şirket/müşteri/gelir/teslim/güvenlik/hukuki risk); P4 (fikir/gelecek) ayrı bir öncelik seviyesi olarak gerekli görülmedi.
Alternatifler: 5 seviyeyi koruyup P0-P3 tanımlarını zenginleştirmek önerildi, reddedildi.
Risk: P4 kaldırıldığı için "fikir/gelecek" içerikli görevler artık P3 altında sınıflandırılacak — knowledge/opportunities akışı buna bağımlı değil, risk yok.
Beklenen Sonuç: Tüm görev önceliklendirmesi netleşir, eşit öncelikli görevler arasında sıralama belirsizliği kalmaz.
Gözden Geçirme Tarihi: İlk gerçek görev verisiyle test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 3.9'daki müşteri başına 12 numaralı fiziksel klasör önerisi (01 Müşteri Bilgileri ... 12 Arşiv) uygulanmadı; mevcut `clients/_TEMPLATE` (profile/contract/strategy/content/ads/tasks/reports/assets/finance/communication/archive) + içerik STATUS alanı tasarımı korundu.
Tarih: 2026-08-10
Kararı Veren: Furkan (Part 03 analiz raporundaki öneri "UYGULA" ile onaylandı)
Neden: Üretim aşamalarını (çekim/kurgu/teslim) ayrı fiziksel klasör yapmak, dosyaların klasörler arası taşınması sırasında duplikasyon/kayıp riski yaratır — bu risk "SON MİMARİ KONTROLÜ" aşamasında zaten tespit edilip STATUS-bazlı tek klasör tasarımıyla çözülmüştü.
Alternatifler: Legacy'nin 12 klasörlü yapısı birebir uygulanması değerlendirildi, reddedildi.
Risk: Yok — hiçbir bilgi kaybolmadı, sadece "fiziksel klasör" yerine "durum alanı" kullanılıyor (eşleştirme tablosu Part 03 analiz raporunda).
Beklenen Sonuç: Müşteri klasör yapısı sade kalır, üretim aşaması geçişlerinde dosya kaybı riski oluşmaz.
Gözden Geçirme Tarihi: İlk gerçek müşteri onboarding'inde test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 4.5'teki düz 10 durumlu "Müşteri Durumları" listesi (Yeni→...→Pasif) ikinci/üçüncü bir status sistemi olarak kurulmadı; mevcut satış döngüsü (NEW→...→WON/LOST) ve müşteri döngüsü (ONBOARDING→...→ARCHIVED) korundu.
Tarih: 2026-08-10
Kararı Veren: Furkan (Part 04 analiz raporundaki öneri "UYGULA" ile onaylandı)
Neden: Legacy'nin listesi mevcut iki döngünün birleştirilmiş/daha az granüler bir versiyonu — LOST, AT_RISK, ARCHIVED gibi ayrımları kaybediyor. Madde 2.12 kararında zaten benimsenen "ikinci status sistemi kurulmaz" ilkesiyle tutarlı.
Alternatifler: Legacy'nin düz listesinin STATUS_STANDARD.md'ye üçüncü döngü olarak eklenmesi değerlendirildi, reddedildi.
Risk: Yok — tam eşleştirme tablosu Part 04 analiz raporunda mevcut, hiçbir aşama kaybolmadı.
Beklenen Sonuç: Tek satış + tek müşteri döngüsü korunur, görev/deal/içerik durumları arasında karışıklık oluşmaz.
Gözden Geçirme Tarihi: İlk gerçek satış verisiyle test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 5.4'ün "Revize" görev durumu ayrı bir task-status olarak eklenmedi; mevcut görev döngüsü (BACKLOG→READY→IN_PROGRESS→REVIEW→BLOCKED→DONE→ARCHIVED) ve içerik döngüsünün REVISION durumu korundu.
Tarih: 2026-08-10
Kararı Veren: Furkan (Part 05 analiz raporundaki öneri "UYGULA" ile onaylandı)
Neden: "Revize" ihtiyacı zaten REVIEW→IN_PROGRESS döngüsü (genel görev) ve CONTENT_SCHEMA'nın REVISION durumu (içerik) ile karşılanıyor; üçüncü bir görev-durumu sistemi kurmak madde 2.12 ve 4.5 kararlarındaki ilkeyle çelişirdi.
Alternatifler: "REVIZE" adında yeni bir task STATUS değeri eklenmesi değerlendirildi, reddedildi.
Risk: Yok — revize bilgisi artık CONTENT_SCHEMA'nın revize kaydı alt şemasında (REQUESTED_BY/WHAT_CHANGED/WHEN/REVISION_NUMBER) tutuluyor.
Beklenen Sonuç: Tek görev döngüsü ve tek içerik döngüsü korunur, durum sistemleri arasında karışıklık oluşmaz.
Gözden Geçirme Tarihi: İlk gerçek revize verisiyle test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 7.5'teki "Kapora → Sözleşme" sırası düzeltildi; standart sıra Teklif → Teklif Onayı → Sözleşme → Ön Ödeme/Kapora → Aktif Müşteri olarak sabitlendi.
Tarih: 2026-08-10
Kararı Veren: Furkan (açıkça yazılı karar + Part 07 analiz raporundaki öneri "UYGULA" ile onaylandı)
Neden: İmzasız kapora almak hukuki risk taşır; mevcut `CLIENT_ONBOARDING.md` checklist'i ve `APPROVAL_GATES.md`'nin "sözleşme gönderme/imzalama" onay maddesi zaten Sözleşme'yi ödemeden önce sıralıyordu.
Alternatifler: 7.5'in orijinal sırası (Kapora önce) değerlendirildi, reddedildi.
Risk: Yok — düzeltilmiş sıra `SALES_PLAYBOOK.md`'ye referans olarak eklendi, mevcut CLIENT_ONBOARDING ve APPROVAL_GATES ile birebir uyumlu.
Beklenen Sonuç: Satış-onboarding geçişinde tek, tutarlı ve hukuken güvenli sıra kullanılır.
Gözden Geçirme Tarihi: İlk gerçek sözleşme/ödeme akışında test edildiğinde.
STATUS: APPROVED

---

Karar: Legacy Spec madde 11.4'teki tamamen farklı 11 klasörlü üst mimari önerisi (00_ADMIN→...→10_ARCHIVE) REDDEDİLDİ; mevcut FINAL V1 12 ana klasör yapısı (00-system→11-archive) korundu. Madde 11.5'in müşteri klasörü önerisi de (Part 03/madde 3.9 ile aynı gerekçeyle) REDDEDİLDİ.
Tarih: 2026-08-10
Kararı Veren: Furkan (Part 11 analiz raporundaki öneri, "11.4 ve 11.5 reddedilmiş olarak kalsın" ile açıkça onaylandı)
Neden: Legacy'nin 11 klasörlü şeması mevcut mimarinin bazı zonlarına (02-sales-crm, 06-knowledge, 08-files, 10-document-import) karşılık vermiyor — eksik/uyumsuz bir alternatif. 11.5 zaten Part 03'te aynı gerekçeyle reddedilmişti, bu sadece aynı önerinin tekrarıydı.
Alternatifler: Legacy'nin 11 klasörlü yapısına geçiş değerlendirildi, kesin olarak reddedildi.
Risk: Yok — mevcut 12 klasör tüm Controlled Knowledge Import boyunca (Part 01-10) sabit kaldı, bu kararla da bozulmadı.
Beklenen Sonuç: FINAL V1 mimarisi gelecekteki bölümlerde de değişmeden kalır.
Gözden Geçirme Tarihi: Gerekmiyor — bu karar kalıcıdır.
STATUS: APPROVED
