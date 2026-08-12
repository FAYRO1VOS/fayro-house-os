/*
 * FAYRO INTAKE / COMMAND CONSOLE — V1.3
 *
 * Bağımlılıksız, tek-sayfa demo prototip. Gerçek Markdown Source of Truth
 * dosyalarına (PIPELINE_BOARD.md, CONTENT_BOARD.md, TASK dosyalari vb.)
 * YAZMAZ -- bu bilinçli bir V1 sınırı, bkz. DESIGN.md bölüm 5.
 *
 * Sınıflandırma kural-tabanlıdır (anahtar kelime + kalıp eşleştirme).
 * Hiçbir gerçek AI/LLM çağrısı yapılmaz, hiçbir API key/credential kullanılmaz.
 * NOT: Bu, kural-tabanlı yaklaşımın SON genişletme turu -- bundan sonraki
 * hassasiyet ihtiyacı semantic AI router'a bırakılacak (bkz. DESIGN.md).
 *
 * V1.3 AKIŞI (gerçek tarayıcı testinde bulunan 4 mantık hatası üzerine):
 * RAW INPUT -> GLOBAL/PROCESS CONSTRAINT EXTRACTION -> PROHIBITED ACTION
 * EXTRACTION (segment bazlı) -> ENTITY/PROJECT DETECTION -> RESPONSIBILITY
 * ASSIGNMENT EXTRACTION -> INTENT BOUNDARY DETECTION -> PRIMARY ACTION ->
 * SUB-ACTIONS (responsibility-domain fragment'ları filtrelenmiş) ->
 * RELATED PROJECT/PERSON -> CATEGORY -> RISK -> APPROVAL -> PREVIEW.
 */

const RAW_KEY = "fayro_console_v1_raw";
const INTENTS_KEY = "fayro_console_v1_intents";
const RELATED_WINDOW = 5;
const STRONG_RELATED_WINDOW = 3;
const MARKER_LOOKAHEAD = 24;

// ---- Workspace tanımı ----
const WORKSPACES = [
  { id: "furkan-brand", label: "Furkan Personal Brand", real: true,
    sourcePath: "04-marketing-ads/fayro-brand/FURKAN_PERSONAL_BRAND.md",
    keywords: ["furkan personal brand", "furkan profil", "furkan instagram", "furkan'ın kişisel", "kişisel marka", "furkan vitrin", "benim hesabım", "kendi hesabım", "kişisel hesabım", "benim profilim"] },
  { id: "caglayan", label: "Çağlayan Topaloğlu", real: true,
    sourcePath: "03-clients/Caglayan-Topaloglu/",
    keywords: ["çağlayan", "caglayan", "topaloğlu", "topaloglu"] },
  { id: "now-saglik", label: "NOW Yaşam Sağlık", real: true,
    sourcePath: "03-clients/Now-Yasam-Saglik/",
    keywords: ["now yaşam", "now yasam", "now sağlık", "now saglik", "now "] },
  { id: "ciooman", label: "Ciooman", real: false,
    sourcePath: "(henüz gerçek klasör yok — Backlog'da toplanıyor)",
    keywords: ["ciooman"] },
  { id: "fayro-sales", label: "Fayro Sales/Leads", real: true,
    sourcePath: "02-sales-crm/pipeline/PIPELINE_BOARD.md",
    keywords: ["lead", "müşteri adayı", "yeni müşteri", "potansiyel müşteri"] },
  { id: "yacht", label: "Yacht", real: false,
    sourcePath: "(henüz gerçek klasör yok — COMPANY_IDENTITY Uzun Vadeli Vizyon, Backlog'da toplanıyor)",
    keywords: ["yat ", "yat,", "yatı", "yacht"] },
  { id: "gallery-opportunity", label: "Gallery/Opportunity", real: false,
    sourcePath: "(henüz gerçek klasör yok — Backlog'da toplanıyor)",
    keywords: ["galeri", "gallery"] },
  { id: "personal-ops", label: "Personal Ops", real: false,
    sourcePath: "(dedike klasör yok — finans/idari notlar burada toplanıyor, bkz. DESIGN.md gap notu)",
    keywords: ["borç", "fatura", "vergi", "muhasebe", "ödenecek"] },
  { id: "backlog", label: "Backlog / Needs Classification", real: false,
    sourcePath: "(varsayılan toplama alanı — eşleşme bulunamayan/sınıflandırılamayan her şey)",
    keywords: [] },
];
const WS_VIEWS = ["Inbox", "Strategy", "Tasks", "Content", "Ads", "Sales", "Assets", "Decisions", "Reports"];

const RELATED_PEOPLE = [
  { id: "cem", label: "Cem", role: "Music & Production", re: /\bcem\b/i },
];

const BOUNDARY_MARKERS = ["tarafında", "için", " ile ", "ile ilgili", "projesinde", "adına", "konusunda"];

// ---- RESPONSIBILITY DOMAIN MAP ----
// Belirli sorumluluk alanları HER ZAMAN aynı workspace'e aittir, metindeki
// fiziksel konumdan bağımsız. Bu hem (a) Çağlayan segmentinin sub-actions
// listesine PR terimlerinin sızmasını engellemek, hem (b) Ciooman kartında
// "kim ne yapıyor" özetini (Responsibilities) üretmek için kullanılır.
const RESPONSIBILITY_DOMAIN_MAP = [
  { re: /\bpr\b/i, domain: "PR", owner: "ciooman" },
  { re: /bas[ıi]n\s*ili[şs]kileri/i, domain: "Basın ilişkileri", owner: "ciooman" },
  { re: /medya\s*g[öo]r[üu]n[üu]rl/i, domain: "Medya görünürlüğü", owner: "ciooman" },
  { re: /pr\s*koordinasyon/i, domain: "PR koordinasyonu", owner: "ciooman" },
  { re: /digital\s*brand|dijital\s*marka/i, domain: "Digital brand", owner: "furkan-brand" },
  { re: /social\s*media|sosyal\s*medya/i, domain: "Social media", owner: "furkan-brand" },
  { re: /content\s*strateg|i[çc]erik\s*strateji|content\s*system|i[çc]erik\s*sistemi/i, domain: "Content strategy/system", owner: "furkan-brand" },
  { re: /digital\s*growth|dijital\s*b[üu]y[üu]me/i, domain: "Digital growth", owner: "furkan-brand" },
];

// ---- Global / Process Constraints ----
// Mesajın tamamına uygulanan iş-kısıtları (business) VE bu console'un kendi
// işleyişine dair üst-talimatlar (process) -- ikisi de tek workspace'e ait
// değildir, hiçbir intent kartına yapıştırılmaz.
const GLOBAL_CONSTRAINT_PATTERNS = [
  { re: /otomatik\s*yay[ıi]nla\w*/i, label: "Otomatik yayınlama yapılmasın" },
  { re: /m[üu]şteriye\s*(otomatik\s*)?mesaj\s*g[öo]nder\w*/i, label: "Müşteriye otomatik mesaj gönderilmesin" },
  { re: /b[üu]t[çc]e\w*\s*de[ğg]i[şs]tir\w*/i, label: "Bütçe değiştirilmesin" },
  { re: /kampanya\w*\s*[üu]zerinde\s*otomatik\s*de[ğg]i[şs]iklik/i, label: "Kampanya üzerinde otomatik değişiklik yapılmasın" },
  // .{0,40} ile "bana" ile "göster/sun" arasındaki serbest metne ("preview/onay ekranında" gibi) tolerans tanınıyor.
  // "önce" ön eki ZORUNLU değil -- gerçek testte "önce" başka bir cümlede geçip bu clause'da hiç yer almadı.
  // Fiil olarak hem "göster" hem "sun" destekleniyor (ikisi de gerçek testte görüldü).
  { re: /(bana|furkan'?a).{0,40}(g[öo]ster|sun)\w*/i, label: "Önce Furkan'a gösterilsin (preview/onay)" },
  { re: /onay[ıi]m\s*olmadan\s*i[şs]lem\s*yapma/i, label: "Furkan onayı olmadan işlem yapılmasın" },
  { re: /[öo]nce\s*b[üu]t[üu]n\s*i[şs]leri\s*ayr[ıi]\s*ayr[ıi]\s*[çc][ıi]kar/i, label: "Önce bütün işleri ayrı ayrı çıkar (süreç talimatı)" },
  { re: /do[ğg]ru\s*workspace.{0,60}y[öo]nlendir\w*/i, label: "Doğru workspace/project/person/category'ye yönlendir (süreç talimatı)" },
  // Format/sunum talimatları -- bunlar da iş içeriği değil, console'a verilen üst-talimattır
  { re: /primary\s*action.{0,60}sub-?actions?/i, label: "Primary action + sub-actions formatında gösterilsin (süreç talimatı)" },
  { re: /sub-?actions?\s*[şs]eklinde\s*g[öo]ster\w*/i, label: "Sub-actions şeklinde gösterilsin (süreç talimatı)" },
  { re: /bunlar[ıi]n\s*hi[çc]birini\s*[şs]u\s*an/i, label: "Bunların hiçbirini şu an yapma (süreç talimatı)" },
];

// ---- Prohibited / Negated Actions ----
// Bu ifadeler METİNDE geçtiği için pozitif bir eylem/onay tetiklenmez --
// tam tersi: bunlar açıkça YASAKLANMIŞ eylemlerdir, sadece bilgi amaçlı
// segment kartında "Prohibited Actions" olarak listelenir.
const PROHIBITED_ACTION_PATTERNS = [
  { re: /bütçe[\wçğıöşü]*\s*art[ıi]rma\b/i, label: "bütçe artırma" },
  // "artırma, azaltma" gibi Türkçe listelerde özne (bütçe) tekrar edilmez --
  // bu yüzden bağımsız "azaltma" da yakalanır (bütçe bağlamı olmadan nadir kullanılan bir kelime).
  { re: /\bazaltma\b/i, label: "bütçe azaltma" },
  { re: /kampanya[\wçğıöşü]*\s*kapatma\b/i, label: "kampanya kapatma" },
  { re: /(yeni\s*)?kampanya[\wçğıöşü]*\s*yay[ıi]nlama\b/i, label: "yeni kampanya yayınlama" },
];

// ---- Onay kapıları ----
// KRİTİK DÜZELTME: her fiil kökünden hemen sonra Türkçe olumsuzluk eki
// (-ma/-me) geliyorsa EŞLEŞMEZ -- "artır" (yap!) ile "artırma" (yapma!)
// aynı alt-dize ("art") içerdiği için önceki sürüm bunu YANLIŞ pozitif
// olarak tetikliyordu. Negative lookahead (?!m[ae]\b) bunu ayırır.
// NOT: JS'in \w'si Türkçe harfleri (ı,ş,ğ,ü,ö,ç) kapsamaz -- "reklamı",
// "kampanyayı" gibi ek almış kelimelerde \w* sessizce erken durur ve eşleşme
// başarısız olurdu. Türkçe ek karakterlerini de içeren [\wçğıöşü]* kullanılıyor.
const TR = "[\\wçğıöşü]*";
const APPROVAL_PATTERNS = [
  { re: /bütçe(sini|yi)?\s*art[ıi]r(?!m[ae]\b)/i, gate: "reklam bütçesi artırma" },
  { re: new RegExp(`reklam${TR}\\s*yay[ıi]nla(?!m[ae]\\b)`, "i"), gate: "reklam yayınlama" },
  { re: new RegExp(`teklif${TR}\\s*g[öo]nder(?!m[ae]\\b)`, "i"), gate: "müşteriye nihai teklif gönderme" },
  { re: new RegExp(`s[öo]zle[şs]me${TR}\\s*(g[öo]nder(?!m[ae]\\b)|imzala(?!m[ae]\\b))`, "i"), gate: "sözleşme gönderme/imzalama" },
  { re: new RegExp(`[öo]deme${TR}\\s*yap(?!m[ae]\\b)`, "i"), gate: "para transferi / ödeme koşulu" },
  { re: new RegExp(`indirim${TR}\\s*(yap(?!m[ae]\\b)|ver(?!m[ae]\\b))`, "i"), gate: "indirim verme" },
  { re: /credential|şifre[\wçğıöşü]*\s*de[ğg]i[şs](?!tirme\b)|api\s*key/i, gate: "credential değiştirme" },
  { re: new RegExp(`kamu${TR}\\s*payla[şs](?!m[ae]\\b)`, "i"), gate: "kamuya açık paylaşım" },
];

const CATEGORY_KEYWORDS = {
  money: ["bütçe", "ödeme", "borç", "fatura", "tahsilat", "gelir", "gider"],
  content: ["çekim", "video", "içerik", "reels", "shoot", "kurgu", "arşiv"],
  production: ["prodüksiyon", "konser", "sahne", "backstage"],
  ads: ["reklam", "kampanya"],
  leads: ["lead", "müşteri adayı", "teklif bekliyor", "yeni müşteri", "potansiyel"],
  coordination: ["görev sınır", "netleştir", "koordin", "karar", "sorumluluk", "sorumlu"],
};
// "pr" kategorisi ayrı ele alınıyor: düz .includes("pr ") trailing-space varsayımı
// kırılgandı ("PR," gibi noktalamada kaçırıyordu). "basın"/"medya görünürlüğü" de
// aynı PR alanının parçası olduğu için tek "pr" etiketine toplanıyor (ayrı kategori değil).
const PR_CATEGORY_RE = /\bpr\b|bas[ıi]n\s*ili[şs]kileri|medya\s*g[öo]r[üu]n/i;

const PRIMARY_ACTION_PATTERNS = [
  { re: /netleştir|g[öo]rev\s*s[ıi]n[ıi]r|sorumlu(luk)?/i, action: "RESPONSIBILITY_ALIGNMENT" },
  { re: /konser|sahne|backstage|çekim\s*ekib/i, action: "CONCERT_CONTENT_SPRINT" },
  { re: /incele|kontrol\s*et|rapor/i, action: "REVIEW" },
  { re: /planla/i, action: "CONTENT_SHOOT_PLAN" },
  { re: /ar[şs]iv/i, action: "ARCHIVE" },
];

function normalize(t) { return t.trim().toLowerCase().replace(/\s+/g, " "); }
function wsById(id) { return WORKSPACES.find(w => w.id === id); }
function collapseWhitespace(t) { return t.replace(/\s+/g, " ").replace(/\s+([.,;])/g, "$1").trim(); }

function checkApproval(text) {
  for (const p of APPROVAL_PATTERNS) if (p.re.test(text)) return p.gate;
  return null;
}
function categorize(text) {
  const n = normalize(text);
  const cats = [];
  if (PR_CATEGORY_RE.test(n)) cats.push("pr");
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) if (kws.some(k => n.includes(k))) cats.push(cat);
  return cats;
}
function derivePrimaryAction(text) {
  for (const p of PRIMARY_ACTION_PATTERNS) if (p.re.test(text)) return p.action;
  return "TASK";
}
function detectRelatedPeople(text) {
  return RELATED_PEOPLE.filter(p => p.re.test(text)).map(p => ({ id: p.id, label: p.label, role: p.role }));
}
function detectResponsibilities(fullRawText) {
  const seen = new Set();
  const list = [];
  for (const r of RESPONSIBILITY_DOMAIN_MAP) {
    if (r.re.test(fullRawText) && !seen.has(r.domain)) { seen.add(r.domain); list.push({ domain: r.domain, ownerId: r.owner, ownerLabel: wsById(r.owner) ? wsById(r.owner).label : r.owner }); }
  }
  return list;
}

// Sub-actions: kaba bağlaç/virgül bölme + responsibility-domain fragment
// filtrelemesi (bu segmentin sahibi olmayan bir domain'e ait parça varsa
// listeye girmez -- HATA 1 düzeltmesi).
function deriveSubActions(text, ownWorkspaceId) {
  const parts = text.split(/,|;| ve /gi).map(p => p.trim()).filter(p => p.split(/\s+/).length >= 2);
  return parts.filter(p => {
    const foreign = RESPONSIBILITY_DOMAIN_MAP.find(r => r.owner !== ownWorkspaceId && r.re.test(p));
    return !foreign;
  });
}

// ---- GLOBAL/PROCESS CONSTRAINT EXTRACTION ----
function extractGlobalConstraints(text) {
  const found = [];
  const spans = [];
  for (const p of GLOBAL_CONSTRAINT_PATTERNS) {
    const m = p.re.exec(text);
    if (!m) continue;
    const pos = m.index;
    const windowBefore = text.slice(Math.max(0, pos - 60), pos).toLowerCase();
    const windowAfter = text.slice(pos + m[0].length, pos + m[0].length + 60).toLowerCase();
    const nearWs = WORKSPACES.some(ws => ws.id !== "backlog" && ws.keywords.some(kw => windowBefore.includes(kw) || windowAfter.includes(kw)));
    if (!nearWs) { found.push(p.label); spans.push([pos, pos + m[0].length]); }
  }
  let cleaned = text;
  spans.sort((a, b) => b[0] - a[0]).forEach(([s, e]) => { cleaned = cleaned.slice(0, s) + " " + cleaned.slice(e); });
  return { constraints: found, cleanedText: collapseWhitespace(cleaned) };
}

// ---- FOREIGN RESPONSIBILITY TEXT STRIP ----
// KURAL: Bir responsibility başka bir entity'ye atanmışsa, o entity'nin
// domain metni bu segmentin summary/category/sub-actions çıkarımına
// karışmaz. Örn. Çağlayan segmentinde "PR, basın ilişkileri..." geçse bile
// (owner=ciooman olduğu için) bu metin Çağlayan'ın kendi alanından SİLİNİR
// -- hem görüntülenen özetten hem sınıflandırmadan. Kendi domain'i asla silinmez.
function stripForeignResponsibilityText(segText, ownWorkspaceId) {
  let cleaned = segText;
  const spans = [];
  for (const r of RESPONSIBILITY_DOMAIN_MAP) {
    if (r.owner === ownWorkspaceId) continue;
    const m = r.re.exec(cleaned);
    if (m) spans.push([m.index, m.index + m[0].length]);
  }
  spans.sort((a, b) => b[0] - a[0]).forEach(([s, e]) => { cleaned = cleaned.slice(0, s) + " " + cleaned.slice(e); });
  return collapseWhitespace(cleaned);
}

// ---- PROHIBITED ACTION EXTRACTION (segment bazlı, lokal) ----
function extractProhibitedActions(segText) {
  const found = [];
  const spans = [];
  for (const p of PROHIBITED_ACTION_PATTERNS) {
    const m = p.re.exec(segText);
    if (!m) continue;
    found.push(p.label);
    spans.push([m.index, m.index + m[0].length]);
  }
  let cleaned = segText;
  spans.sort((a, b) => b[0] - a[0]).forEach(([s, e]) => { cleaned = cleaned.slice(0, s) + " " + cleaned.slice(e); });
  return { prohibited: found, cleanedText: collapseWhitespace(cleaned) };
}

// ---- INTENT BOUNDARY DETECTION ----
function splitIntents(rawText) {
  const lower = rawText.toLowerCase();
  const matches = [];
  for (const ws of WORKSPACES) {
    if (ws.id === "backlog") continue;
    for (const kw of ws.keywords) {
      let idx = 0;
      while (true) {
        const pos = lower.indexOf(kw, idx);
        if (pos === -1) break;
        const after = lower.slice(pos, pos + kw.length + MARKER_LOOKAHEAD);
        const strong = BOUNDARY_MARKERS.some(mk => after.includes(mk));
        matches.push({ pos, wsId: ws.id, strong });
        idx = pos + kw.length;
      }
    }
  }
  matches.sort((a, b) => a.pos - b.pos);

  if (matches.length === 0) {
    const t = rawText.trim();
    return t ? [{ text: t, workspaceId: null, relatedIds: [] }] : [];
  }

  function wordsBetween(a, b) { return rawText.slice(a, b).trim().split(/\s+/).filter(Boolean).length; }

  const segments = [];
  let segStart = 0;
  let currentWs = null;
  let currentRelated = [];

  for (const m of matches) {
    if (currentWs === null) { currentWs = m.wsId; continue; }
    if (m.wsId === currentWs) continue;
    if (currentRelated.includes(m.wsId)) continue;

    const wc = wordsBetween(segStart, m.pos);
    const threshold = m.strong ? STRONG_RELATED_WINDOW : RELATED_WINDOW;
    const shouldSplit = wc >= threshold;

    if (!shouldSplit) {
      currentRelated.push(m.wsId);
    } else {
      segments.push({ text: rawText.slice(segStart, m.pos).trim(), workspaceId: currentWs, relatedIds: currentRelated.slice() });
      segStart = m.pos;
      currentWs = m.wsId;
      currentRelated = [];
    }
  }
  segments.push({ text: rawText.slice(segStart).trim(), workspaceId: currentWs, relatedIds: currentRelated.slice() });
  return segments.filter(s => s.text.length > 0);
}

function classifySegments(rawText) {
  // 1) Global/process constraints -- tüm mesajdan çıkar
  const { constraints, cleanedText } = extractGlobalConstraints(rawText);

  // 2) Responsibilities -- ham metnin TAMAMINDAN taranır (fiziksel konumdan bağımsız)
  const responsibilities = detectResponsibilities(rawText);

  // 3) Sınır tespiti (constraint'ler çıkarılmış metin üzerinde)
  const rawSegments = splitIntents(cleanedText);

  const segments = [];
  for (let i = 0; i < rawSegments.length; i++) {
    const seg = rawSegments[i];
    const unknown = seg.workspaceId === null;

    // 4) Segment bazlı prohibited-action çıkarımı
    const { prohibited, cleanedText: afterProhibited } = unknown ? { prohibited: [], cleanedText: seg.text } : extractProhibitedActions(seg.text);
    // 5) Başka entity'ye ait responsibility metnini çıkar (summary + sınıflandırma için tek ortak temiz metin)
    const segFinal = unknown ? afterProhibited : stripForeignResponsibilityText(afterProhibited, seg.workspaceId);

    const gate = unknown ? null : checkApproval(segFinal);
    const primaryAction = unknown ? "UNKNOWN" : derivePrimaryAction(segFinal);
    const isResponsibilitySegment = !unknown && (seg.workspaceId === "ciooman" || primaryAction === "RESPONSIBILITY_ALIGNMENT");

    // Related Project varsayılanı: RESPONSIBILITY_ALIGNMENT segmentinin açık bir
    // related entity'si yoksa, hemen önceki GERÇEK client segmentine bağlanır
    // ("Ciooman ile ... görev sınırları" gibi cümlelerde konu zaten önceki
    // segmentte kurulmuş olur, tekrar isimle anılmayabilir).
    let relatedIds = seg.relatedIds || [];
    if (isResponsibilitySegment && relatedIds.length === 0) {
      const prevReal = segments.slice().reverse().find(s => wsById(s.workspaceId).real && s.workspaceId !== seg.workspaceId);
      if (prevReal) relatedIds = [prevReal.workspaceId];
    }

    const segResponsibilities = isResponsibilitySegment ? responsibilities : [];
    // KRİTİK NOT: boundary-tetikleyici kelime (örn. "Ciooman") çoğu zaman
    // sorumluluk cümlesinin SONUNDA geçer ("PR ... Ciooman'ın sorumluluğunda") --
    // bu durumda PR metni fiziksel olarak ÖNCEKİ segmentin diliminde kalır,
    // Ciooman'ın kendi metninde hiç görünmez. Bu yüzden RESPONSIBILITY_ALIGNMENT
    // segmentlerinde category, kırılgan metin-dilimi yerine zaten doğru
    // hesaplanmış Responsibilities listesinden (bu segmentin SAHİP OLDUĞU alanlardan) türetilir.
    let category = unknown ? ["Needs Classification"] : categorize(segFinal);
    if (isResponsibilitySegment) {
      const ownDomains = segResponsibilities.filter(r => r.ownerId === seg.workspaceId).map(r => r.domain).join(" ");
      category = ["coordination"];
      if (PR_CATEGORY_RE.test(ownDomains)) category.unshift("pr");
    }

    segments.push({
      text: unknown ? seg.text : segFinal,
      workspaceId: unknown ? "backlog" : seg.workspaceId,
      relatedIds,
      relatedPeople: unknown ? [] : detectRelatedPeople(seg.text),
      responsibilities: segResponsibilities,
      needsClassification: unknown,
      category,
      primaryAction,
      // Responsibilities alanı zaten yapılandırılmış "kim ne yapıyor" bilgisini
      // taşıyor -- aynı bilgiyi Sub-actions'a tekrar dökmüyoruz.
      subActions: (unknown || primaryAction === "RESPONSIBILITY_ALIGNMENT") ? [] : deriveSubActions(segFinal, seg.workspaceId),
      prohibitedActions: prohibited,
      approvalGate: gate,
      risk: unknown ? "UNKNOWN" : (gate ? "HIGH" : "LOW"),
    });
  }
  return { segments, globalConstraints: constraints };
}

// ---- Storage ----
function loadRaw() { try { return JSON.parse(localStorage.getItem(RAW_KEY)) || []; } catch (e) { return []; } }
function saveRaw(l) { localStorage.setItem(RAW_KEY, JSON.stringify(l)); }
function loadIntents() { try { return JSON.parse(localStorage.getItem(INTENTS_KEY)) || []; } catch (e) { return []; } }
function saveIntents(l) { localStorage.setItem(INTENTS_KEY, JSON.stringify(l)); }

function findDuplicateIntent(segText, allIntents) {
  const n = normalize(segText);
  return allIntents.find(i => normalize(i.text) === n) || null;
}

function seedDemoIfEmpty() {
  if (loadRaw().length > 0) return;
  const now = Date.now();
  const rawText = "DEMO: Örnek müşteri için haftalık içerik çekimi planlanıyor.";
  const raw = { id: "RAW-" + (now - 3600_000), text: rawText, createdAt: now - 3600_000, demo: true };
  saveRaw([raw]);
  const { segments } = classifySegments(rawText);
  const intents = segments.map((s, i) => ({
    id: "IN-" + (now - 3600_000) + "-" + i, rawId: raw.id, text: s.text, workspaceId: s.workspaceId,
    relatedIds: s.relatedIds, relatedPeople: s.relatedPeople, responsibilities: s.responsibilities,
    needsClassification: s.needsClassification, category: s.category, primaryAction: s.primaryAction,
    subActions: s.subActions, prohibitedActions: s.prohibitedActions, approvalGate: s.approvalGate, risk: s.risk,
    status: s.approvalGate ? "NEEDS_APPROVAL" : "LOGGED", createdAt: now - 3600_000, demo: true, duplicateOf: null,
  }));
  saveIntents(intents);
}

// ---- Rendering ----
function fmtTime(ts) { return new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
function isToday(ts) { const d = new Date(ts), t = new Date(); return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate(); }
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderAll() {
  const intents = loadIntents().sort((a, b) => b.createdAt - a.createdAt);
  const raws = loadRaw().sort((a, b) => b.createdAt - a.createdAt);
  renderDashCounts(intents);
  renderAudit(raws, intents);
  renderWorkspaceTabs(intents);
}
function renderDashCounts(intents) {
  document.getElementById("count-today").textContent = intents.filter(e => isToday(e.createdAt)).length;
  document.getElementById("count-approval").textContent = intents.filter(e => e.status === "NEEDS_APPROVAL").length;
  document.getElementById("count-blocked").textContent = intents.filter(e => e.needsClassification).length;
  document.getElementById("count-money").textContent = intents.filter(e => e.category.includes("money")).length;
  document.getElementById("count-content").textContent = intents.filter(e => e.category.includes("content")).length;
  document.getElementById("count-leads").textContent = intents.filter(e => e.category.includes("leads")).length;
}
function renderDashDetail(view) {
  const intents = loadIntents();
  const box = document.getElementById("dashDetail");
  const titles = { today: "Bugün", approval: "Onay Bekleyen", blocked: "Blocked / Needs Classification", money: "Money", content: "Content", leads: "Leads" };
  let filtered;
  switch (view) {
    case "today": filtered = intents.filter(e => isToday(e.createdAt)); break;
    case "approval": filtered = intents.filter(e => e.status === "NEEDS_APPROVAL"); break;
    case "blocked": filtered = intents.filter(e => e.needsClassification); break;
    case "money": filtered = intents.filter(e => e.category.includes("money")); break;
    case "content": filtered = intents.filter(e => e.category.includes("content")); break;
    case "leads": filtered = intents.filter(e => e.category.includes("leads")); break;
    default: filtered = [];
  }
  if (filtered.length === 0) { box.innerHTML = `<p class="empty-hint">${titles[view]}: kayıt yok.</p>`; return; }
  box.innerHTML = `<strong>${titles[view]} (${filtered.length})</strong>` + filtered.map(intentRowHtml).join("");
}
function intentRowHtml(e) {
  return `<div class="audit-item">${escapeHtml(e.text)}<div class="meta">
    <span class="tag">${wsById(e.workspaceId).label}</span>
    ${e.relatedIds && e.relatedIds.length ? `<span class="tag">İlişkili: ${e.relatedIds.map(id => wsById(id).label).join(", ")}</span>` : ""}
    ${e.relatedPeople && e.relatedPeople.length ? `<span class="tag">${e.relatedPeople.map(p => p.label + " (" + p.role + ")").join(", ")}</span>` : ""}
    ${e.primaryAction ? `<span class="tag">${e.primaryAction}</span>` : ""}
    ${e.prohibitedActions && e.prohibitedActions.length ? `<span class="tag warn">Yasaklı: ${e.prohibitedActions.join(", ")}</span>` : ""}
    ${e.approvalGate ? `<span class="tag approval">ONAY: ${escapeHtml(e.approvalGate)}</span>` : ""}
    ${e.demo ? `<span class="tag demo">DEMO</span>` : ""}
    <span>${fmtTime(e.createdAt)}</span>
  </div></div>`;
}
function renderAudit(raws, intents) {
  const box = document.getElementById("auditList");
  if (raws.length === 0) { box.innerHTML = `<p class="empty-hint">Henüz kayıt yok.</p>`; return; }
  box.innerHTML = raws.map(r => {
    const children = intents.filter(i => i.rawId === r.id);
    return `<div class="audit-item raw-item">
      <div class="raw-label">HAM GİRDİ${r.demo ? ' <span class="tag demo">DEMO</span>' : ""}</div>
      ${escapeHtml(r.text)}
      <div class="meta"><span>${fmtTime(r.createdAt)}</span><span class="tag">${children.length} iş çıkarıldı</span></div>
      ${children.length ? `<div class="raw-children">${children.map(intentRowHtml).join("")}</div>` : ""}
    </div>`;
  }).join("");
}

let activeWs = WORKSPACES[0].id;
let activeSubView = "Inbox";
function renderWorkspaceTabs(intents) {
  const tabsBox = document.getElementById("wsTabs");
  tabsBox.innerHTML = WORKSPACES.map(w => `<button class="ws-tab ${w.id === activeWs ? "active" : ""}" data-ws="${w.id}">${w.label}</button>`).join("");
  tabsBox.querySelectorAll(".ws-tab").forEach(btn => btn.addEventListener("click", () => { activeWs = btn.dataset.ws; renderAll(); }));
  renderWorkspaceView(intents);
}
function renderWorkspaceView(intents) {
  const ws = wsById(activeWs);
  const box = document.getElementById("wsViews");
  const wsIntents = intents.filter(e => e.workspaceId === ws.id || (e.relatedIds || []).includes(ws.id));
  const subTabs = WS_VIEWS.map(v => `<span class="ws-sub-tab ${v === activeSubView ? "active" : ""}" data-sub="${v}">${v}</span>`).join("");
  let body;
  if (activeSubView === "Inbox") {
    body = wsIntents.length ? wsIntents.map(intentRowHtml).join("") : `<p class="empty-hint">Bu workspace'e (doğrudan veya ilişkili) henüz iş yok.</p>`;
  } else {
    body = `<p class="empty-hint">V1'de bu görünüm henüz gerçek SoT dosyasına bağlı değil — referans: <code>${ws.sourcePath}</code></p>`;
  }
  box.innerHTML = `<div class="ws-view">
    <div class="ws-source">Kaynak: <code>${ws.sourcePath}</code>${!ws.real ? " — gerçek klasör yok" : ""}</div>
    <div class="ws-sub-tabs">${subTabs}</div>
    ${body}
  </div>`;
  box.querySelectorAll(".ws-sub-tab").forEach(el => el.addEventListener("click", () => { activeSubView = el.dataset.sub; renderWorkspaceView(loadIntents()); }));
}

// ---- Intake flow ----
let pendingSegments = null;
let pendingGlobalConstraints = [];

function startIntake(text) {
  const result = classifySegments(text);
  pendingSegments = result.segments.map(seg => ({ ...seg, duplicate: findDuplicateIntent(seg.text, loadIntents()) }));
  pendingGlobalConstraints = result.globalConstraints;
  renderPreview();
}

function renderPreview() {
  const box = document.getElementById("suggestionBox");
  if ((!pendingSegments || pendingSegments.length === 0) && pendingGlobalConstraints.length === 0) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");

  const gcBox = pendingGlobalConstraints.length ? `<div class="global-constraints">
    <div class="gc-title">⚑ Global Constraints / Process Instructions (mesajın tamamına uygulanır, hiçbir işe yapıştırılmadı)</div>
    <ul>${pendingGlobalConstraints.map(c => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
  </div>` : "";

  if (!pendingSegments || pendingSegments.length === 0) {
    box.innerHTML = gcBox + `<p class="empty-hint">Sınıflandırılacak iş kalmadı.</p>`;
    return;
  }

  const header = `<div class="preview-header">Bu mesajdan <strong>${pendingSegments.length} iş</strong> çıkardım. Ham girdi aynen saklanacak.</div>`;

  const cards = pendingSegments.map((s, idx) => {
    const ws = wsById(s.workspaceId);
    const relatedWsLabel = s.relatedIds && s.relatedIds.length ? `<div class="card-row"><strong>Related Project:</strong> ${s.relatedIds.map(id => wsById(id).label).join(", ")}</div>` : "";
    const relatedPeopleLabel = s.relatedPeople && s.relatedPeople.length ? `<div class="card-row"><strong>Related Person:</strong> ${s.relatedPeople.map(p => `${p.label} — ${p.role}`).join(", ")}</div>` : "";
    const respLabel = s.responsibilities && s.responsibilities.length
      ? `<div class="card-row"><strong>Responsibilities:</strong><ul class="sub-actions">${s.responsibilities.map(r => `<li>${escapeHtml(r.domain)} = ${escapeHtml(r.ownerLabel)}</li>`).join("")}</ul></div>` : "";
    const catLabel = Array.isArray(s.category) ? s.category.join(" / ") : s.category;
    const subActionsHtml = s.subActions && s.subActions.length
      ? `<div class="card-row"><strong>Sub-actions:</strong><ul class="sub-actions">${s.subActions.map(sa => `<li>${escapeHtml(sa)}</li>`).join("")}</ul></div>` : "";
    const prohibitedHtml = s.prohibitedActions && s.prohibitedActions.length
      ? `<div class="card-row warn"><strong>Prohibited Actions:</strong><ul class="sub-actions">${s.prohibitedActions.map(p => `<li>${escapeHtml(p)}</li>`).join("")}</ul></div>` : "";
    const riskClass = s.risk === "HIGH" ? "approval" : (s.risk === "UNKNOWN" ? "warn" : "low");
    return `<div class="intent-card ${s.approvalGate ? "critical" : ""}" data-idx="${idx}">
      <div class="card-row"><strong>İş özeti:</strong> ${escapeHtml(s.text)}</div>
      <div class="card-row"><strong>Workspace:</strong> ${ws.label}${!ws.real ? " (gerçek klasör yok)" : ""}</div>
      ${relatedWsLabel}${relatedPeopleLabel}${respLabel}
      <div class="card-row"><strong>Kategori:</strong> ${escapeHtml(catLabel)}</div>
      <div class="card-row"><strong>Primary Action:</strong> ${s.primaryAction}</div>
      ${subActionsHtml}${prohibitedHtml}
      <div class="card-row ${riskClass}"><strong>Risk:</strong> ${s.risk}${s.approvalGate ? " — ONAY GEREKİYOR: " + escapeHtml(s.approvalGate) : ""}</div>
      ${s.duplicate ? `<div class="card-row warn">⚠ Benzer bir iş zaten var (${fmtTime(s.duplicate.createdAt)}) — DUPLICATE olabilir</div>` : ""}
      <div class="card-buttons">
        <button class="ghost-btn small" data-act="edit" data-idx="${idx}">Düzenle</button>
        <button class="primary-btn small" data-act="approve" data-idx="${idx}">Onayla</button>
        <button class="ghost-btn small" data-act="discard" data-idx="${idx}">Vazgeç</button>
      </div>
    </div>`;
  }).join("");

  const nonCritical = pendingSegments.filter(s => !s.approvalGate).length;
  const bulk = `<div class="bulk-row">
    <button id="approveAllBtn" class="primary-btn">Hepsini Onayla (${nonCritical} kritik olmayan iş)</button>
    <button id="cancelAllBtn" class="ghost-btn">Tümünü Vazgeç</button>
  </div>`;

  box.innerHTML = gcBox + header + `<div class="intent-cards">${cards}</div>` + bulk;

  box.querySelectorAll("[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const act = btn.dataset.act;
      if (act === "approve") approveSegment(idx);
      if (act === "discard") discardSegment(idx);
      if (act === "edit") editSegment(idx);
    });
  });
  document.getElementById("approveAllBtn").addEventListener("click", approveAllNonCritical);
  document.getElementById("cancelAllBtn").addEventListener("click", cancelAllIntake);
}

let rawSavedId = null;
let pendingRawTextValue = null;
function ensureRawSaved() {
  if (rawSavedId) return rawSavedId;
  const raws = loadRaw();
  const id = "RAW-" + Date.now();
  raws.push({ id, text: pendingRawTextValue, createdAt: Date.now(), demo: false });
  saveRaw(raws);
  rawSavedId = id;
  return id;
}

function approveSegment(idx) {
  const s = pendingSegments[idx];
  if (!s) return;
  const rawId = ensureRawSaved();
  const intents = loadIntents();
  const ts = Date.now();
  intents.push({
    id: "IN-" + ts + "-" + idx, rawId, text: s.text, workspaceId: s.workspaceId,
    relatedIds: s.relatedIds, relatedPeople: s.relatedPeople, responsibilities: s.responsibilities,
    needsClassification: s.needsClassification, category: s.category, primaryAction: s.primaryAction,
    subActions: s.subActions, prohibitedActions: s.prohibitedActions, approvalGate: s.approvalGate, risk: s.risk,
    status: s.approvalGate ? "NEEDS_APPROVAL" : "LOGGED",
    createdAt: ts, demo: false, duplicateOf: s.duplicate ? s.duplicate.id : null,
  });
  saveIntents(intents);
  pendingSegments.splice(idx, 1);
  finishIfDone();
}
function discardSegment(idx) { pendingSegments.splice(idx, 1); finishIfDone(); }
function editSegment(idx) {
  const s = pendingSegments[idx];
  const newText = prompt("İş metnini düzenle:", s.text);
  if (newText === null) return;
  const reclassified = classifySegments(newText).segments[0] || s;
  pendingSegments[idx] = { ...reclassified, duplicate: findDuplicateIntent(reclassified.text, loadIntents()) };
  renderPreview();
}
function approveAllNonCritical() {
  for (let i = pendingSegments.length - 1; i >= 0; i--) if (!pendingSegments[i].approvalGate) approveSegment(i);
  renderPreview();
}
function cancelAllIntake() { pendingSegments = []; finishIfDone(); }
function finishIfDone() {
  if (pendingSegments.length === 0) {
    document.getElementById("rawInput").value = "";
    pendingRawTextValue = null;
    rawSavedId = null;
    pendingGlobalConstraints = [];
  }
  renderPreview();
  renderAll();
}

// ---- Voice input ----
function setupVoice() {
  const micBtn = document.getElementById("micBtn");
  const status = document.getElementById("voiceStatus");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { micBtn.addEventListener("click", () => { status.textContent = "Bu tarayıcıda ses girişi desteklenmiyor. Lütfen yazarak devam edin."; }); return; }
  const rec = new SR();
  rec.lang = "tr-TR";
  rec.interimResults = false;
  let listening = false;
  micBtn.addEventListener("click", () => {
    if (listening) { rec.stop(); return; }
    rec.start(); listening = true; micBtn.classList.add("listening"); status.textContent = "Dinleniyor...";
  });
  rec.onresult = (ev) => { document.getElementById("rawInput").value = ev.results[0][0].transcript; status.textContent = "Ses metne çevrildi."; };
  rec.onerror = (ev) => { status.textContent = "Ses girişi hatası: " + ev.error; };
  rec.onend = () => { listening = false; micBtn.classList.remove("listening"); };
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  seedDemoIfEmpty();
  setupVoice();

  document.getElementById("submitBtn").addEventListener("click", () => {
    const text = document.getElementById("rawInput").value.trim();
    if (!text) return;
    pendingRawTextValue = text;
    rawSavedId = null;
    startIntake(text);
  });

  document.getElementById("dashGrid").addEventListener("click", (ev) => {
    const card = ev.target.closest(".dash-card");
    if (!card) return;
    renderDashDetail(card.dataset.view);
  });

  renderAll();
});
