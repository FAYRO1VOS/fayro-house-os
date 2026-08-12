/*
 * Input Redaction / Secret Filter (P2 Foundation)
 *
 * LLM'e HİÇBİR ŞEY gitmeden önce çalışan bağımsız deterministic katman.
 * Kapsam BİLİNÇLİ OLARAK dar tutuldu: credential/security pattern'leri.
 * Müşteri PII redaction'ı bu fazın kapsamı DIŞINDA (talimat gereği).
 *
 * Eşleşme bulunursa istek BLOKLANIR (maskeleyip devam etmek değil, tamamen
 * durdurmak tercih edildi -- fail-closed: bir gerçek credential'ı yanlışlıkla
 * LLM'e sızdırmaktansa meşru bir isteği reddetmek daha güvenli).
 *
 * KURAL: findings listesi yalnızca PATTERN ADINI taşır, asla eşleşen gerçek
 * metni değil. Hiçbir log/audit çıktısı ham secret içermez.
 */

const CREDENTIAL_PATTERNS = [
  { name: "ANTHROPIC_API_KEY", re: /\bsk-ant-[a-zA-Z0-9_-]{10,}/ },
  { name: "OPENAI_API_KEY", re: /\bsk-[a-zA-Z0-9]{20,}/ },
  { name: "GENERIC_API_KEY_ASSIGNMENT", re: /\b(api[_-]?key)\s*[:=]\s*\S+/i },
  { name: "BEARER_TOKEN", re: /\bBearer\s+[a-zA-Z0-9._-]{10,}/i },
  { name: "AUTHORIZATION_HEADER", re: /\bAuthorization\s*:\s*\S+/i },
  { name: "PASSWORD_ASSIGNMENT", re: /\bpassword\s*[:=]\s*\S+/i },
  { name: "TOKEN_ASSIGNMENT", re: /\btoken\s*[:=]\s*\S+/i },
  { name: "SECRET_ASSIGNMENT", re: /\bsecret\s*[:=]\s*\S+/i },
  { name: "CREDENTIAL_ASSIGNMENT", re: /\bcredential\s*[:=]\s*\S+/i },
  { name: "PRIVATE_KEY_BLOCK", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

/**
 * @param {string} text
 * @returns {string[]} eşleşen pattern ADLARI (gerçek değer değil)
 */
function scan(text) {
  const t = String(text || "");
  const findings = [];
  for (const p of CREDENTIAL_PATTERNS) {
    if (p.re.test(t)) findings.push(p.name);
  }
  return findings;
}

/**
 * @param {string} text
 * @returns {{blocked: boolean, findings: string[], safeText: string|null}}
 *   safeText: bloklanmadıysa orijinal metin; bloklandıysa null (LLM'e hiç gönderilmeyecek).
 */
function guard(text) {
  const findings = scan(text);
  if (findings.length === 0) {
    return { blocked: false, findings: [], safeText: String(text || "") };
  }
  return { blocked: true, findings, safeText: null };
}

module.exports = { scan, guard, CREDENTIAL_PATTERNS };
