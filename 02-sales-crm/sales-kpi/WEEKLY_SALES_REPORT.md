# WEEKLY_SALES_REPORT

Amaç: Her hafta satış performansını tek bir yerden ölçülebilir hale getirmek.

## Haftalık Metrikler
Toplam Lead, Toplam Görüşme, Toplam Toplantı, Toplam Teklif, Toplam Satış, Toplam Ciro, Dönüşüm Oranı — `sales-crm/pipeline`, `won`, `lost` kayıtlarından derlenir.

## Dönüşüm Oranı Tanımları (belirsizlik olmasın diye açık tutulur)
- Lead → Toplantı: STATUS MEETING'e geçen kayıt / toplam yeni Lead
- Toplantı → Teklif: STATUS PROPOSAL'a geçen kayıt / STATUS MEETING'e ulaşan kayıt
- Teklif → Satış (kapanış oranı): STATUS WON / STATUS PROPOSAL'a ulaşan kayıt
- Genel Dönüşüm: STATUS WON / toplam yeni Lead

## Toplam Ciro
STATUS: WON olan kayıtların DEAL_SCHEMA VALUE alanlarının toplamı.

## FUTURE CAPABILITY
Pipeline velocity, average deal value, win rate, sales cycle — mevcut DEAL_SCHEMA alanları (VALUE, STATUS, tarihler) bu hesaplamalar için yeterli ham veriyi taşıyor; gerçek hesaplama/otomasyon Phase 2/3'te kurulur, bugün manuel.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 7.14 (Controlled Knowledge Import, Part 07)
STATUS: ACTIVE NOW
