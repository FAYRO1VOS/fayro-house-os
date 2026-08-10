# CREDENTIALS_POLICY

Amaç: API anahtarları, şifreler, müşteri bilgileri ve kişisel verilerin korunması.

## Kural
AI, şirket sırlarını izinsiz paylaşmaz. API anahtarları, şifreler, müşteri bilgileri ve kişisel veriler korunmalıdır.

Bu kural mevcut ilkelerle birlikte çalışır: hiçbir credential Markdown dosyalarında tutulmaz, API key kod içine yazılmaz, hassas müşteri verisinin dış sisteme aktarılması insan onayı gerektirir (bkz. STANDARDS/APPROVAL_GATES.md).

## Yasak Kanallar
Hiçbir şifre WhatsApp'tan gönderilmez, Not Defteri'nde tutulmaz, ortak klasörlere yazılmaz. API Key, Token, Şifre, Lisans ve sistem anahtarları kod içerisine düz metin olarak yazılmaz. Şifreler yalnızca güvenli yöntemlerle (sistem dışı Secret Management aracı) saklanır.

Kaynak: Legacy FAYRO OS Specification v1.0, madde 10.16, 12.9, 12.10 (Controlled Knowledge Import, Part 10 + Part 12)
STATUS: ACTIVE NOW (ilke bugünden geçerli, AI sistemleri henüz aktif değil)
