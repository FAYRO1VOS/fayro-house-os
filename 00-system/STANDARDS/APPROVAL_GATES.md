# Approval Gates (APPROVAL_REQUIRED)

Aşağıdaki işlemler, otomasyon büyüse bile insan onayı olmadan yapılamaz:
Para transferi, reklam bütçesi artırma, reklam yayınlama, müşteriye nihai teklif gönderme,
sözleşme gönderme/imzalama, müşteri adına taahhüt verme, kritik dosya silme,
kullanıcı yetkisi artırma, credential değiştirme, kamuya açık paylaşım,
hukuki açıklama, büyük fiyat değişikliği, geri döndürülemez işlemler, stratejik ortaklık kararları,
indirim verme, ödeme koşulu istisnası, garanti/sonuç iddiası, hassas müşteri verisinin dış sisteme aktarılması.

AI Çıktı Kontrolü (risk bazlı): AI ajanları/otomasyon devreye girdiğinde çıktılar risk seviyesine göre değerlendirilir.
Yukarıdaki listedeki yüksek riskli işlemler için AI çıktısı insan onayı olmadan asla uygulanamaz.
Analiz, taslak, raporlama ve öneri gibi düşük riskli AI çıktıları insan onayı olmadan üretilebilir/paylaşılabilir.

Phase 1'de zaten otomasyon olmadığı için bu liste doğal olarak korunur.
Phase 2/3'te otomasyon katmanına teknik kontrol olarak eklenecektir.
