/*
 * Input Redaction — Test Fixtures (P2 Foundation)
 * Çalıştırma: node redaction.test.js
 */

const { guard } = require("../redaction/input-redactor");

let pass = 0, fail = 0;
function check(label, cond, extra) {
  if (cond) { pass++; console.log(`PASS :: ${label}`); }
  else { fail++; console.log(`FAIL :: ${label}${extra ? " -> " + JSON.stringify(extra) : ""}`); }
}

console.log("=== 1) API key içeren input -> bloklanır ===");
{
  const r = guard("Şuna bak: api_key: sk-ant-api03-abcdefgh1234567890");
  check("blocked=true", r.blocked === true, r);
  check("safeText null (secret hiçbir yerde açık kalmıyor)", r.safeText === null, r);
}

console.log("\n=== 2) Bearer token içeren input -> bloklanır ===");
{
  const r = guard("Authorization: Bearer abcDEF123456789ghijkl");
  check("blocked=true", r.blocked === true, r);
  check("finding AUTHORIZATION_HEADER veya BEARER_TOKEN", r.findings.length > 0, r);
}

console.log("\n=== 3) Password içeren input -> bloklanır ===");
{
  const r = guard("giriş şifresi password: SuperSecret123!");
  check("blocked=true", r.blocked === true, r);
  check("finding PASSWORD_ASSIGNMENT", r.findings.includes("PASSWORD_ASSIGNMENT"), r);
}

console.log("\n=== 4) Private key bloğu -> bloklanır ===");
{
  const r = guard("-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJ...");
  check("blocked=true", r.blocked === true, r);
}

console.log("\n=== 5) Güvenli/normal iş mesajı -> bloklanmaz ===");
{
  const r = guard("Çağlayan cuma konseri için çekim planı hazırlansın.");
  check("blocked=false", r.blocked === false, r);
  check("safeText orijinal metin", r.safeText === "Çağlayan cuma konseri için çekim planı hazırlansın.", r);
  check("findings boş", r.findings.length === 0, r);
}

console.log("\n=== 6) Findings sadece PATTERN ADI taşıyor, gerçek secret değeri değil ===");
{
  const secretValue = "sk-ant-api03-COK-GIZLI-DEGER-123456";
  const r = guard(`api_key: ${secretValue}`);
  const findingsAsString = JSON.stringify(r.findings);
  check("findings içinde gerçek secret DEĞERİ yok", !findingsAsString.includes(secretValue), { findings: r.findings });
}

console.log(`\n=== ÖZET: ${pass} PASS / ${fail} FAIL ===`);
process.exitCode = fail > 0 ? 1 : 0;
