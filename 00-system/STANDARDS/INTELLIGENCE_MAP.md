# Intelligence Map (Phase 2 — Mimari Hazırlık, Aktif Değil)

Bu dosya, ileride kurulacak akıllı katmanların ve AI ajanlarının hangi mevcut Source of Truth'tan besleneceğini tanımlar.
Hiçbiri şu an aktif değildir; bu sadece bir bağlantı haritasıdır. Hiçbir katman/ajan kendi veri deposunu oluşturmaz.

## Akıllı Katmanlar (Intelligence Layers)

| Katman | Beslendiği Kaynak |
|---|---|
| CEO Intelligence | 02-sales-crm, 05-finance, 03-clients, 09-reporting |
| COO Command Center | 01-operations/tasks, 03-clients, 01-operations/team |
| Sales Intelligence | 02-sales-crm/pipeline (DEAL_SCHEMA) |
| Client Health | 03-clients/<isim> (STATUS, communication, finance, reports) |
| Revenue Intelligence | 05-finance, 02-sales-crm/won, 03-clients/<isim>/finance |
| Content Intelligence | 03-clients/<isim>/content (CONTENT_SCHEMA) |
| Decision Memory | 00-system/DECISION_LOG.md |
| Knowledge Memory | 06-knowledge/knowledge-base, 06-knowledge/sop-playbooks |

## AI Ajanları (İleride, Şimdi Kurulmuyor)

| Ajan | Kaynak |
|---|---|
| CEO Agent | 02-sales-crm, 05-finance, 09-reporting, DECISION_LOG.md |
| COO Agent | 01-operations, 03-clients, 01-operations/team |
| Sales Agent | 02-sales-crm/pipeline |
| CRM Agent | 02-sales-crm/pipeline (DEAL_SCHEMA) — yeni müşteri geldiğinde CRM günceller, takip/hatırlatma oluşturur |
| Client Success Agent | 03-clients/<isim>/communication, /reports |
| Social Media Agent | 04-marketing-ads, 03-clients/<isim>/content |
| Content Planning Agent | 03-clients/<isim>/content, 04-marketing-ads/content/content-calendar |
| Trend Research Agent | 04-marketing-ads/research/GROWTH_METHOD.md (Instagram/TikTok/YouTube/Google/Rakipler/Global Trendler/Türkiye Gündemi + AI Dünyası) — günlük CEO'ya raporlanır |
| Advertising Agent | 03-clients/<isim>/ads, 04-marketing-ads/advertising |
| Finance Agent | 05-finance |
| Reporting Agent | 09-reporting |
| Quality Control Agent | 01-operations/quality-control/DELIVERY_CHECKLIST.md, 06-knowledge/sop-playbooks/EDITING.md — kontrol kriterleri buradan okunur, tekrar tanımlanmaz |
| WhatsApp Customer Agent | 03-clients/<isim>/communication (entegrasyon: 07-tech/integrations/whatsapp) |
| Calendar Agent | harici takvim (entegrasyon: 07-tech/integrations/calendar) |
| Proposal Agent | 02-sales-crm/pipeline (proposal aşaması) |

## AI Araç Rolleri (Tool Rolleri — insan LEADERSHIP rollerinden ayrıdır)

| Araç | Rol | Kapsam |
|---|---|---|
| ChatGPT | CEO Danışmanı | Strateji, araştırma, pazarlama, satış, içerik, karar analizi, risk analizi — Furkan'ın yerini almaz, ona danışmanlık sağlar |
| Claude Code | CTO | Kod, yazılım, sistem mimarisi, dokümantasyon, otomasyon, kod inceleme, teknik analiz |

Not: Bu roller araç kullanım kapsamıdır, `LEADERSHIP/ceo/ROLE.md` ve `coo/ROLE.md`'deki insan Furkan/Enes tanımlarının yerine geçmez veya onlarla karışmaz.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 10.3, 10.6, 10.7, 10.9, 10.11-10.15 (Controlled Knowledge Import, Part 10)
