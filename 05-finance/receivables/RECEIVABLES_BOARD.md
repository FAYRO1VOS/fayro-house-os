# RECEIVABLES_BOARD

Başlık: Bekleyen Tahsilatlar Master Board
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-11
Durum: ACTIVE NOW
Onaylayan: Furkan

## Ne İşe Yarar

Bekleyen tahsilatların tek satırlık özet tablosu. `05-finance/README.md`'nin belirttiği tek günlük kullanım noktasıdır: *"receivables/ ve Command Center MONEY bloğu her gün kontrol edilir."*

- Tahsilat bekleyen her kayıt (fatura/ödeme) için tek satır eklenir.
- `budgets/FINANCIAL_POLICY.md`'deki haftalık cash-flow hesaplaması ("Bekleyen Tahsilatlar") buradan beslenir.
- `00-system/COMMAND_CENTER.md` → MONEY bloğu buradan özetlenir.

## Kullanım Kuralları

- **STATUS: BEKLIYOR** olan kayıtlar aktif satır olarak tabloda kalır.
- **STATUS: TAHSIL EDILDI** olduğunda kayıt bu tablodan silinir (tahsilat artık bekleyen değil, gerçekleşmiş gelirdir — `income/` kategorisine işlenir, burada tekrar tutulmaz).
- Burada `STANDARDS/` altında ayrı bir şema tanımı yoktur; alanlar `FINANCIAL_POLICY.md`'nin cash-flow tanımından minimal şekilde türetilmiştir, yeni bir şema icat edilmemiştir.

## Board

| CLIENT/PROJECT | AMOUNT | DUE_DATE | STATUS | NOTES |
|---|---|---|---|---|
| | | | | |

Kaynak: 05-finance/README.md, budgets/FINANCIAL_POLICY.md — bu dosyalardaki tanımlar burada tekrar icat edilmez, birebir uygulanır.
