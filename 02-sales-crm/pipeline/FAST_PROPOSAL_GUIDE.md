# FAST_PROPOSAL_GUIDE

Başlık: Hızlı Teklif Üretim Rehberi
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne İşe Yarar

Furkan yeni bir müşteri adayı geldiğinde sadece minimum bilgiyi verir; bu bilgiden teklif taslağı üretilir. **Bu yeni bir sistem/agent değil** — `_LEAD_TEMPLATE.md` + `STANDARDS/SERVICE_CATALOG.md` + `STANDARDS/SERVICE_PACKAGES.md`'nin birlikte nasıl kullanılacağının süreç tanımıdır.

## Girdi (Furkan'ın vereceği minimum)

1. Kim (müşteri/marka adı)
2. Ne iş yapıyor
3. Ne istiyor
4. Problemi
5. Hedefi
6. Bütçe aralığı (biliniyorsa)
7. Sosyal hesapları
8. Mevcut içerik durumu

Bu 8 alan `STANDARDS/DEAL_SCHEMA.md`'nin temel + iletişim alanlarına doğrudan yazılır (`_LEAD_TEMPLATE.md`), yeni alan icat edilmez.

## Çıktı (bu bilgiden üretilir)

1. Hızlı analiz
2. Marka problemi
3. Fırsat
4. İçerik yaklaşımı
5. Büyüme yaklaşımı
6. Önerilen hizmet (SERVICE_CATALOG'dan SERVICE-ID referansı)
7. Önerilen paket (SERVICE_PACKAGES'tan)
8. Deliverables (paketin DELIVERABLES alanından)
9. Süre (paketin DURATION alanından)
10. Teklif taslağı (`_LEAD_TEMPLATE.md` → Teklif Takibi bölümüne yazılır)
11. İlk 30 günlük yol haritası (kabaca — CLIENT_ONBOARDING.md'nin Büyüme Analizi ile örtüşür, tekrar icat edilmez)

## Kritik Sınır

**İnsan onayı olmadan müşteriye fiyat/teklif gönderilmez** (`STANDARDS/APPROVAL_GATES.md` — "müşteriye nihai teklif gönderme"). Bu rehber sadece taslağı hızlandırır, gönderim kararını değiştirmez.

Fiyat, `SERVICE_PACKAGES.md`'de FURKAN/ENES INPUT REQUIRED işaretliyse, teklif taslağı fiyat alanını boş/"görüşülecek" bırakır — uydurulmaz.

Kaynak: 02-sales-crm/pipeline/_LEAD_TEMPLATE.md, STANDARDS/SERVICE_CATALOG.md, STANDARDS/SERVICE_PACKAGES.md, STANDARDS/APPROVAL_GATES.md, sop-playbooks/CLIENT_ONBOARDING.md — tanımlar tekrar icat edilmez.
