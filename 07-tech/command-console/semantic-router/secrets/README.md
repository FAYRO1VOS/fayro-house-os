# Secret Yönetimi — Semantic Router

Başlık: Gerekli Environment Variable'lar (Dokümantasyon — Placeholder Dosya Değil)
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: P2 Foundation — gerçek secret henüz yok
Onaylayan: Furkan

## Neden `.env.example` Yok

Repo'nun mevcut `.gitignore`'u `.env.*` kalıbını içeriyor — bu, `.env.example` dosyasını da (gerçek secret içermese bile) sessizce git'ten gizlerdi. `.gitignore` bu fazda **değiştirilmedi** (talimatınız gereği kontrol edilmeden değiştirilmez), bu yüzden gerekli değişkenler burada **sadece dokümantasyon olarak** listeleniyor.

## Gerekli Environment Variable'lar (P2.5+'ta, gerçek entegrasyon kurulduğunda)

| Değişken | Amaç | Bugünkü Durum |
|---|---|---|
| `SEMANTIC_API_KEY` | LLM sağlayıcısının API anahtarı | **Yok, istenmedi, oluşturulmadı** |
| `SEMANTIC_PROVIDER` | `provider/config.js`'in okuduğu sağlayıcı adı | Yok, `"unconfigured"` varsayılan |
| `SEMANTIC_MODEL` | `provider/config.js`'in okuduğu model adı | Yok, `"unconfigured"` varsayılan |

## Kural

`secret-loader.js` bu değişkenleri **sadece server-side Node ortamında** `process.env`'den okur. Hiçbir değer bu repoda, kodda, testte veya dokümantasyonda gerçek olarak yazılı değildir. Command Console'un tarayıcı tarafı (`../../app.js`) bu dosyayı hiç import etmez.
