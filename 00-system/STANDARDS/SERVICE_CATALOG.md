# SERVICE_CATALOG

Başlık: Hizmet ve Fiyat Kataloğu
Versiyon: 1.1
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12 (v1.1: Hizmet Aileleri bölümü eklendi)
Durum: ACTIVE NOW (yapı) / fiyat-maliyet-marj alanları NOT_STARTED (gerçek iş verisi bekliyor)
Onaylayan: Furkan

## Ne İşe Yarar

Teklif üretiminin tek Source of Truth'u. `LEADERSHIP/COMPANY_IDENTITY.md` → Hizmet Kataloğu'ndaki 9 CORE_SERVICE isminin üzerine kurulur, isimleri tekrar icat etmez. Sales/CRM Agent teklif taslağı hazırlarken buradan okur.

## Kullanım Kuralları

- **SERVICE_ID formatı:** `SERVICE-NNNN` (bkz. `STANDARDS/ID_SYSTEM.md` PREFIX-NNNN kuralı).
- **Sales/CRM Agent bu dosyayı sadece okur.** STANDARD_PRICE, COST, MARGIN, DURATION, REQUIRED_TEAM, OPTIONAL_ADDONS alanlarını **asla değiştiremez** — katalog dışı özel fiyat veya indirim daima `STANDARDS/APPROVAL_GATES.md` kapsamındadır (Furkan/Enes onayı).
- **Fiyat/maliyet/marj alanları şu an boş.** Bu gerçek iş verisi — sistemde uydurulmaz (bkz. `ROADMAP.md` Hafta 2 notu), yalnızca Furkan/Enes doldurur.
- DESCRIPTION/SCOPE/DELIVERABLES alanları da boş bırakıldı — repo'da bu hizmetlerin kapsamını tanımlayan mevcut bir kaynak yok (sadece isim listesi vardı), bu yüzden uydurulmadı.

## Hizmetler

### SERVICE-0001 — Marka Stratejisi
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0002 — İçerik Üretimi
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0003 — Sosyal Medya Yönetimi
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0004 — Reklam Yönetimi
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0005 — Video Prodüksiyon
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0006 — Fotoğraf
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0007 — Drone
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0008 — Kurgu
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

### SERVICE-0009 — Danışmanlık
DESCRIPTION:
SCOPE:
DELIVERABLES:
STANDARD_PRICE:
COST:
MARGIN:
DURATION:
REQUIRED_TEAM:
OPTIONAL_ADDONS:
CLIENT_FACING_DESCRIPTION:

## Hizmet Aileleri (Müşteriye Sunum Görünümü)

Yukarıdaki 9 hizmet, müşteriye "ne yapıyoruz?" sorusuna hızlı cevap verecek şekilde ailelere gruplanmıştır. **Hiçbir yeni SERVICE-ID veya yeni hizmet icat edilmedi** — sadece mevcut 9 kayıt + `COMPANY_IDENTITY.md`'nin FUTURE_SERVICE/SUPPORT_SERVICE listesi yeniden gruplanmıştır. FUTURE/SUPPORT işaretli maddeler **bugün satılabilir değildir**, bu ayrım korunmuştur (COMPANY_IDENTITY'nin STATUS ayrımına sadık kalındı).

| Aile | İçerdiği Hizmetler |
|---|---|
| **BRAND** | SERVICE-0001 Marka Stratejisi (konumlandırma + dijital kimlik dahil) [AKTİF]; Kişisel Marka [FUTURE_SERVICE — bugün aktif değil] |
| **CONTENT** | SERVICE-0002 İçerik Üretimi [AKTİF], SERVICE-0008 Kurgu [AKTİF]; AI Kreatif [FUTURE_SERVICE — Yapay Zekâ Sistemleri kapsamında, bugün aktif değil] |
| **SOCIAL** | SERVICE-0003 Sosyal Medya Yönetimi [AKTİF] |
| **PERFORMANCE** | SERVICE-0004 Reklam Yönetimi [AKTİF] |
| **GROWTH** | **Bugün ayrı bir satılabilir hizmet olarak katalogda yok.** Creator/UGC, dağıtım, collab, organik büyüme metodolojisi bugün İçerik Üretimi/Sosyal Medya Yönetimi kapsamında uygulanıyor (bkz. `04-marketing-ads/research/GROWTH_METHOD.md`), ayrı fiyatlanmıyor. PR entegrasyonu SUPPORT_SERVICE (muhtemelen partner-delivered, in-house değil). |
| **SALES SYSTEM** | CRM Kurulumu / teklif-follow-up sistemi kurulumu [FUTURE_SERVICE — bugün aktif değil; Fayro'nun kendi CRM'i (bu repo) satılan bir hizmet değil, iç kullanım aracıdır] |
| **PRODUCTION** | SERVICE-0005 Video Prodüksiyon [AKTİF], SERVICE-0006 Fotoğraf [AKTİF], SERVICE-0007 Drone [AKTİF] |
| **AI & AUTOMATION** | SERVICE-0009 Danışmanlık [AKTİF, kapsamı genel — AI/otomasyon danışmanlığını içerebilir ama özel bir AI hizmeti değil]; Yapay Zekâ Sistemleri, Operasyon Danışmanlığı [FUTURE_SERVICE — bugün aktif değil] |

**Not:** GROWTH ve SALES SYSTEM ailelerinin bugün karşılığı zayıf/yok. Bunları gerçek satılabilir hizmet haline getirmek (fiyat/kapsam/deliverable tanımlamak) Furkan/Enes kararı gerektirir — burada icat edilmedi.

Kaynak: LEADERSHIP/COMPANY_IDENTITY.md (Hizmet Kataloğu, hizmet isimleri), STANDARDS/ID_SYSTEM.md (ID formatı), STANDARDS/APPROVAL_GATES.md (yazma sınırı) — bu dosyalardaki tanımlar burada tekrar icat edilmez, birebir uygulanır.
