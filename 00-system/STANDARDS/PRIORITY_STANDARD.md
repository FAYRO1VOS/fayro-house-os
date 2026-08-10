# Priority Standardı

P0 = CRITICAL — Şirketi, müşteriyi, geliri, teslimi, güvenliği veya hukuki durumu doğrudan riske atan ve bekleyemeyecek işler.
P1 = HIGH — Gelir, satış, aktif müşteri, müşteri memnuniyeti veya yakın teslim tarihini doğrudan etkileyen önemli işler.
P2 = NORMAL — Planlı operasyon, içerik üretimi, takip, raporlama ve günlük standart işler.
P3 = LOW — Acil olmayan geliştirme, araştırma, optimizasyon, fikir ve geleceğe yönelik işler.

Öncelik sırası: P0 > P1 > P2 > P3

Aynı öncelikte birden fazla görev varsa sıralama kriteri:
1. Deadline
2. Revenue impact
3. Client impact
4. Dependency/blocker
5. Created date

Kural: Her şey P0 olamaz.

Otomatik Eskalasyon: Teslim tarihine 24 saatten az kalan işler otomatik olarak P0'a yükselir.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 2.12, 5.18 (Controlled Knowledge Import, Part 02, Furkan onayıyla + Part 05) — önceki 5 seviyeli (P0-P4) versiyonun yerini aldı.
STATUS: ACTIVE NOW
