/*
 * Semantic Router — Deterministic Pre-Filter (P1)
 *
 * TEK GÖREVİ: raw_input'a bakıp üç karardan birini vermek --
 *   DETERMINISTIC_ONLY   -> V1.4 tek başına yeter, AI çağrılmaz
 *   SEMANTIC_AI_REQUIRED -> karmaşıklık sinyali var, AI'a gönderilmeli (P2'de)
 *   NEEDS_CLASSIFICATION -> hiçbir tanınan işaret yok, AI'a göndermek de anlamsız
 *
 * Bu modül HİÇBİR LLM ÇAĞRISI, NETWORK İSTEĞİ veya API KEY İÇERMEZ.
 * V1.4'ün ../../app.js dosyasına dokunmaz, onu import etmez (izolasyon).
 */

const config = require("./config");

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function countWorkspaceMatches(text) {
  const lower = text.toLowerCase();
  const matched = [];
  for (const [wsId, keywords] of Object.entries(config.WORKSPACE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) matched.push(wsId);
  }
  return matched;
}

function countBoundaryMarkers(text) {
  const lower = text.toLowerCase();
  let count = 0;
  for (const marker of config.BOUNDARY_MARKERS) {
    let idx = 0;
    while (true) {
      const pos = lower.indexOf(marker, idx);
      if (pos === -1) break;
      count++;
      idx = pos + marker.length;
    }
  }
  return count;
}

function hasResponsibilityLanguage(text) {
  return config.RESPONSIBILITY_LANGUAGE_PATTERNS.some(p => p.test(text));
}

function countNegatedActionVerbs(text) {
  let count = 0;
  for (const pattern of config.NEGATED_ACTION_VERBS) {
    const matches = text.match(pattern);
    if (matches) count += 1; // her fiil türü bir sinyal (aynı fiilin tekrarı ek karmaşıklık saymaz)
  }
  return count;
}

// Tek eşleşen workspace, sadece "riskli" (çakışmaya açık) bir anahtar
// kelimeden geliyorsa AMBIGUOUS_ENTITY sayılır.
function isAmbiguousSingleMatch(text, matchedWorkspaces) {
  if (matchedWorkspaces.length !== 1) return false;
  const wsId = matchedWorkspaces[0];
  const riskyKeywords = config.LOW_CONFIDENCE_KEYWORDS[wsId];
  if (!riskyKeywords) return false;
  const lower = text.toLowerCase();
  const strongKeywords = config.WORKSPACE_KEYWORDS[wsId].filter(kw => !riskyKeywords.includes(kw));
  const matchedOnlyRisky = riskyKeywords.some(kw => lower.includes(kw)) && !strongKeywords.some(kw => lower.includes(kw));
  return matchedOnlyRisky;
}

/**
 * @param {string} rawInput
 * @returns {{decision: string, reasonCodes: string[], signals: object}}
 */
function decide(rawInput) {
  const text = (rawInput || "").trim();

  if (!text) {
    return { decision: "NEEDS_CLASSIFICATION", reasonCodes: ["EMPTY_INPUT"], signals: {} };
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const matchedWorkspaces = countWorkspaceMatches(text);
  const boundaryMarkerCount = countBoundaryMarkers(text);
  const responsibilityLanguage = hasResponsibilityLanguage(text);
  const negationSignalCount = countNegatedActionVerbs(text);
  const ambiguous = isAmbiguousSingleMatch(text, matchedWorkspaces);

  const signals = {
    wordCount,
    matchedWorkspaces,
    boundaryMarkerCount,
    responsibilityLanguage,
    negationSignalCount,
    ambiguous,
  };

  if (matchedWorkspaces.length === 0) {
    return { decision: "NEEDS_CLASSIFICATION", reasonCodes: ["UNKNOWN_ENTITY"], signals };
  }

  const reasonCodes = [];
  if (matchedWorkspaces.length >= config.MULTI_INTENT_MIN_MATCHES) reasonCodes.push("MULTI_INTENT");
  if (boundaryMarkerCount >= config.CROSS_WORKSPACE_MARKER_MIN_COUNT) reasonCodes.push("CROSS_WORKSPACE_RELATION");
  if (responsibilityLanguage) reasonCodes.push("RESPONSIBILITY_COMPLEXITY");
  if (negationSignalCount >= config.NEGATION_COMPLEXITY_MIN_COUNT) reasonCodes.push("SEMANTIC_NEGATION_COMPLEXITY");
  if (ambiguous) reasonCodes.push("AMBIGUOUS_ENTITY");

  if (reasonCodes.length > 0) {
    return { decision: "SEMANTIC_AI_REQUIRED", reasonCodes, signals };
  }

  return { decision: "DETERMINISTIC_ONLY", reasonCodes: ["CLEAR_SINGLE_INTENT"], signals };
}

module.exports = {
  decide,
  countWorkspaceMatches,
  countBoundaryMarkers,
  hasResponsibilityLanguage,
  countNegatedActionVerbs,
  isAmbiguousSingleMatch,
};
