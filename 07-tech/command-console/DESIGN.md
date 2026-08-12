# DESIGN — FAYRO INTAKE / COMMAND CONSOLE V1

Başlık: Command Console V1 Tasarım ve Analiz Belgesi
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: ACTIVE NOW (analiz + V1 prototip)
Onaylayan: Furkan

## 1. Mevcut Mimarinin Karşıladığı İhtiyaçlar

Bu proje sıfırdan bir kavram değil — mevcut mimaride zaten üç parçası var, Command Console bunları **birleştiriyor**, çoğaltmıyor:

- **RAW INPUT toplama:** `00-system/QUICK_CAPTURE/README.md` zaten "aklınıza gelen her şeyi düşünmeden buraya bırakın" ilkesiyle kuruluydu, ama tek satırlık manuel not olarak tanımlıydı ve `daily-close`'da elle ilgili bölüme taşınıyordu. Command Console bunu **otomatik sınıflandırma/yönlendirme önerisiyle** genişletiyor — QUICK_CAPTURE'ın yerini almıyor, onun eksik kalan "otomatik triaj" kısmını dolduruyor.
- **Ajan mimarisi:** `STANDARDS/INTELLIGENCE_MAP.md` zaten Intake/Router'a karşılık gelen ajanları (CRM Agent, Reporting Agent, vb.) ve her ajanın hangi Source of Truth'tan okuyacağını tanımlamış. Bu oturumda ayrıca H bölümünde (Agent Architecture) 12 ajanlık konsolide liste + NOW/NEXT/LATER sıralaması kuruldu. Command Console'un "Ajan Rolleri" listesi bunun **üzerine** oturur, yeni ajan icat etmez.
- **Onay kuralları:** `STANDARDS/APPROVAL_GATES.md`'nin 16 maddesi zaten "hangi işlem insan onayı olmadan yapılamaz" sorusunu cevaplıyor — Console'un risk/onay motoru bu listeyi **okur**, yeniden yazmaz.
- **STATUS/ID:** `STATUS_STANDARD.md` (4 döngü) ve `ID_SYSTEM.md` (PREFIX-NNNN) zaten otoriter — Console yeni durum/ID formatı icat etmez.
- **Workspace'ler zaten var:** Furkan Personal Brand (`04-marketing-ads/fayro-brand/`), Çağlayan Topaloğlu ve NOW Yaşam Sağlık (`03-clients/`), Fayro Sales/Leads (`02-sales-crm/pipeline/`) — hepsi bu oturumda kuruldu. Ciooman/Yacht/Gallery-Opportunity/Personal Ops/Backlog için henüz klasör yok (bkz. Eksikler).

## 2. Eksikler

1. **Tek giriş ekranı yok.** Şu an yeni bilgi ya doğrudan ilgili board'a (PIPELINE_BOARD, CONTENT_BOARD) ya da hiçbir yere (kafada/WhatsApp'ta — `COMPANY_IDENTITY.md`'nin "Bilgi Kaybı Yasağı" ihlali riski) yazılıyor.
2. **Otomatik sınıflandırma/yönlendirme yok.** Hangi workspace'e ait olduğuna Furkan/Enes elle karar veriyor.
3. **Duplicate/conflict kontrolü yok.** Aynı bilginin iki board'a girmesini önleyecek bir mekanizma yok (Data Architecture Phase raporunda Risk olarak zaten işaretlenmişti).
4. **Audit trail arayüzü yok.** Git commit geçmişi teknik olarak audit trail sağlıyor ama Furkan'ın okuyabileceği bir görünüm değil.
5. **Ciooman, Yacht, Gallery/Opportunity, Personal Ops, Backlog workspace'leri hiç yok.** Ciooman bir kişi/PR ortağı (03-clients yapısına uymuyor, ayrı ele alınmalı); Yacht ve Gallery/Opportunity `COMPANY_IDENTITY.md`'nin "Uzun Vadeli Vizyon" (Yat Hizmetleri) kapsamında, bugün aktif bir iş değil — bunlar için gerçek klasör AÇILMAYACAK (bkz. Karar, madde 4).

## 3. Duplicate/Çelişki Riskleri ve Önlemler

| Risk | Önlem |
|---|---|
| Console kendi "ikinci SoT"unu oluşturur | Console **hiçbir zaman** kendi başına PIPELINE_BOARD/CONTENT_BOARD/TASK dosyası yazmaz — V1'de "oluşturulacak kayıt" sadece **önerilir**, gerçek dosya yazımı insan onayından sonra ayrı bir adapter adımıdır (bu V1'de bağlı değil, bkz. rapor madde 6) |
| Yeni status/ID formatı icat edilir | Yok — Console mevcut `STATUS_STANDARD.md`/`ID_SYSTEM.md` değerlerini gösterir, yenisini üretmez |
| Yeni workspace = yeni klasör mimarisi | Workspace'ler sadece **görünüm/filtre** katmanıdır — her workspace altta mevcut gerçek klasöre (`03-clients/...`, `02-sales-crm/...`) işaret eder, kendi veri deposu açmaz. Ciooman/Yacht/Gallery gibi henüz gerçek iş klasörü olmayanlar için Console sadece "Backlog" workspace'inde toplar, sahte klasör açmaz |
| Sesli/yazılı girdi kaybolur | Ham girdi (transcript/metin) her zaman ayrı ve değişmez şekilde saklanır (audit trail'in ilk satırı) — sınıflandırma/öneri bunun üzerine yazılmaz, yanına eklenir |

## 4. V1 Dosya Planı (en küçük çalışan prototip)

```
07-tech/command-console/
├── DESIGN.md          (bu dosya)
├── index.html          (tek sayfa: giriş ekranı + dashboard)
├── style.css            (responsive, sade/premium)
├── app.js               (classifier, risk/onay motoru, duplicate check, audit trail, localStorage adapter)
└── README.md            (Furkan'ın nasıl açacağı)
```

**Bağımlılık: sıfır.** npm/build adımı yok — tarayıcıda doğrudan açılabilen veya basit bir statik sunucuyla (`node`'un yerleşik `http-server` gerektirmeyen tek satırlık alternatifi) servis edilebilen düz HTML/CSS/JS. Bu, "yeni framework eklemeden önce gerçekten gerekli mi" testini geçemedi — framework gerekmiyor.

## 5. Teknik Kararlar

- **Persistence (V1):** `localStorage` — tarayıcıda kalıcı ama repo'nun gerçek Markdown SoT'una **yazmaz**. Bu bilinçli bir V1 sınırı: dosya sistemine gerçek yazma (yeni TASK-NNNN.md, PIPELINE_BOARD.md satırı vb.) bir backend/dosya-yazma adaptörü gerektirir, bu V1'de **stub** (arayüz tanımlı, bağlı değil) olarak bırakılıyor — Supabase'i erken zorunlu kılmamak ilkesiyle aynı mantık, dosya-yazma adaptörüne de uygulanıyor.
- **Sınıflandırma (V1):** Kural-tabanlı anahtar kelime eşleştirme (workspace isimleri, "reklam bütçe" gibi risk kelimeleri). **Gerçek bir AI/LLM çağrısı yapılmıyor** — API key/provider uydurulmadı. `PROVIDER_INTERFACE.md`'nin capability-abstraction mantığıyla tutarlı: ileride gerçek bir LLM sağlayıcısı bağlanacaksa aynı arayüzün arkasına takılır, sınıflandırma mantığı burada izole tutuldu (`app.js` içinde `classify()` fonksiyonu — ileride değiştirilebilir).
- **Ses girişi:** Web Speech API (`webkitSpeechRecognition`/`SpeechRecognition`), tarayıcı desteklemiyorsa açık "bu tarayıcıda ses girişi desteklenmiyor, yazı ile devam edin" mesajı — sahte transcript üretilmez.
- **Onay motoru:** `APPROVAL_GATES.md`'nin anahtar kelimelerine (bütçe artırma, teklif, sözleşme, ödeme, yayın, credential) karşı eşleştirme; eşleşme varsa `NEEDS APPROVAL`, yoksa düşük riskli sayılır (DECISION_LOG'un risk-bazlı AI çıktı kontrolü kararıyla tutarlı).

## 6. Test Planı

4 örnek girdi ile: (1) Çağlayan çekim planı → Çağlayan workspace, düşük risk; (2) NOW reklam bütçesi artırma → NOW workspace, **NEEDS APPROVAL** (bütçe artırma APPROVAL_GATES maddesi); (3) yat müşterisi teklifi → Backlog/Yacht (gerçek klasör yok, Backlog'a düşmeli) + teklif kelimesi nedeniyle onay bayrağı; (4) borç planlama → Personal Ops veya Finans-ilişkili, düşük risk (planlama, ödeme değil). Aynı girdi tekrar girilirse duplicate uyarısı beklenir.
