# FAYRO Command Console — V1

Başlık: Command Console Kullanım Kılavuzu
Versiyon: 1.0
Oluşturan: Claude Code
Son Güncelleme: 2026-08-12
Durum: PROTOTİP (DEMO veri içerir)
Onaylayan: Furkan

## Nasıl Açılır

Bağımlılık yok, kurulum yok. İki yoldan biri:

**1) Doğrudan aç (en basit):**
`07-tech/command-console/index.html` dosyasına çift tıkla, tarayıcıda açılır.
(Not: bazı tarayıcılarda `file://` üzerinden Web Speech API kısıtlı çalışabilir — sesli giriş çalışmazsa Yol 2'yi kullan.)

**2) Basit yerel sunucu (sesli giriş için önerilir):**
```
cd 07-tech/command-console
node -e "require('http').createServer((req,res)=>{const fs=require('fs'),path=require('path');let f=req.url==='/'?'/index.html':req.url;let p=path.join(__dirname,f);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('not found');return;}const ext=path.extname(p);const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};res.writeHead(200,{'Content-Type':types[ext]||'text/plain'});res.end(d);});}).listen(5173,()=>console.log('http://localhost:5173'))"
```
Sonra tarayıcıda `http://localhost:5173` adresini aç.

## Önemli Sınır

Bu V1 bir **prototip**. Girdiğin bilgi tarayıcının `localStorage`'ında tutulur — repo'daki gerçek `PIPELINE_BOARD.md`/`CONTENT_BOARD.md`/task dosyalarına henüz yazmıyor (bkz. `DESIGN.md`). İlk açılışta 3 adet `DEMO` etiketli örnek kayıt görürsün — bunlar gerçek değil, arayüzü boş görmemen için.

Farklı bir tarayıcı/cihazda açarsan kayıtlar paylaşılmaz (her biri kendi localStorage'ını kullanır) — bu bilinçli bir V1 sınırı, çoklu-cihaz senkronu Supabase kararına bağlı (bkz. DESIGN.md).
