# Controlled Knowledge Import — İşlem Talimatı

Eski ChatGPT promptları/dokümanları FAYRO OS'a parça parça, güvenli şekilde aktarılırken izlenecek adımlar.

Her parça geldiğinde sırasıyla:
1. İçeriği analiz et.
2. FINAL V1 + Phase 2 mimarisinde hangi bölüme ait olduğunu belirle.
3. Tekrar eden bilgiyi yeniden oluşturma (önce mevcut dosyayı kontrol et).
4. Çelişki varsa otomatik karar verme — CONFLICT kaydı aç, kullanıcıya bildir.
5. Güncel bilgi ile eski bilgi çelişiyorsa işaretle.
6. Gereksiz sohbet/prompt kalıntısını sisteme alma.
7. Sadece kalıcı ve operasyonel değeri olan bilgiyi çıkar.
8. Uygun Source of Truth alanına yerleştir (kopyalama, referans ver).
9. Aynı bilgiyi birden fazla yere kopyalama.
10. Ne eklendiğini/değiştirildiğini raporla.

Klasör akışı:
00_INBOX -> 01_PARSE -> 02_CLASSIFY -> 03_DUPLICATE_CHECK -> 04_CONFLICT_CHECK -> 05_HUMAN_REVIEW -> 06_APPROVED -> 07_CANONICAL_KNOWLEDGE -> 08_ARCHIVE_SOURCE

Durum: Sistem hazır, henüz hiçbir içerik aktarılmadı.
