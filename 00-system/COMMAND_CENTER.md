# COMMAND CENTER

Phase 1'de bu dosya manuel doldurulur (daily-os/daily-start rutininde). İleride yazılıma dönüştüğünde otomatik dolar.
CEO yalnızca özet satırları okur. COO tüm bölümü detaylı takip eder.

Her blokta "Kaynak:" notu, o bölümün hangi Source of Truth dosyasından okunacağını gösterir — buraya elle ikinci bir kopya yazılmaz, ilgili dosyaya bakılıp özetlenir (çift veri girişini önlemek için).

## TODAY
- Yapılacak işler (bugün DUE_DATE): bkz. `01-operations/tasks/{ready,in-progress}/`
- Geciken işler (DUE_DATE geçmiş): bkz. `01-operations/tasks/`
- Takip edilecek lead'ler (FOLLOWUP_DATE bugün/geçmiş): bkz. `02-sales-crm/pipeline/PIPELINE_BOARD.md`
- Bekleyen teklifler: bkz. `02-sales-crm/pipeline/PIPELINE_BOARD.md` (STATUS: PROPOSAL)
- Bekleyen tahsilatlar (DUE_DATE bugün/yaklaşan): bkz. `05-finance/receivables/RECEIVABLES_BOARD.md`
- Bugünkü çekimler (SHOOT_DATE bugün): bkz. `03-clients/<isim>/content/CONTENT_BOARD.md`
- Bugünkü editler (STATUS: EDITING): bkz. `03-clients/<isim>/content/CONTENT_BOARD.md`
- Müşteri onayı bekleyenler (STATUS: CLIENT_REVIEW): bkz. `03-clients/<isim>/content/CONTENT_BOARD.md`
- Bugün yayınlanacak içerikler (PUBLISH_DATE bugün): bkz. `03-clients/<isim>/content/CONTENT_BOARD.md`
- Aktif reklamlar: bkz. `04-marketing-ads/advertising` (CAMPAIGN_SCHEMA tanımlı; ayrı kampanya board'u ilk gerçek kampanyada açılacak, henüz yok)
- Kritik uyarılar (P0, 24 saat otomatik eskalasyon): bkz. `STANDARDS/PRIORITY_STANDARD.md`
- Bugünkü toplantılar:
- Bugünkü teslimler:

## WAITING FOR ME
- Onay bekleyen kararlar (bkz. DECISION_LOG.md, STATUS: PENDING):

## SALES
Kaynak: `02-sales-crm/pipeline/PIPELINE_BOARD.md`
- Yeni lead:
- Bekleyen takip:
- Bekleyen teklifler:
- Kazanılan müşteriler:

## CLIENTS
Kaynak: `03-clients/<isim>/` STATUS alanları (bkz. `STANDARDS/STATUS_STANDARD.md` Müşteri döngüsü)
- Aktif müşteriler:
- Riskli müşteriler:
- Revize bekleyenler:
- Teslim bekleyenler:

## MONEY
Kaynak: `05-finance/receivables/RECEIVABLES_BOARD.md` (tahsilat), `05-finance/payables/` (ödeme, henüz board yok)
- Bekleyen tahsilatlar:
- Yaklaşan ödemeler:
- Güncel nakit görünümü:

## OPERATIONS
Kaynak: `01-operations/tasks/{ready,in-progress,blocked,review}/` (klasör konumu = STATUS)
- Geciken görevler:
- Kritik görevler:
- Ekip yükü:

## ŞİRKET SAĞLIĞI (FUTURE)
- Genel durum göstergesi (GREEN/YELLOW/RED) — gerçek hesaplama Phase 3'te (bkz. STANDARDS/INTELLIGENCE_MAP.md)

## AI (Phase 2/3)
- Bekleyen AI önerileri:
- Otomasyon hataları:
- Günlük intelligence raporu:
