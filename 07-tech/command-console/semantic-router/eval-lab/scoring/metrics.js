/*
 * Scoring Metrics (P2.5)
 *
 * Her fonksiyon (fixture, actualOutput) alır, 0-1 arası bir doğruluk skoru
 * döndürür. actualOutput, INTENT_EXTRACTION contract şeklinde (bkz.
 * ../../contracts/intent-extraction-contract.md).
 *
 * BİLİNEN SINIRLAMA: missing_information/semantic_notes gibi serbest metin
 * alanları birebir string eşleşmesiyle KARŞILAŞTIRILMAZ (dil çeşitliliği
 * nedeniyle imkansız) -- "boş mu dolu mu" gibi kaba bir yaklaşım kullanılır.
 * Bu, insan gözden geçirmesinin (JUDGE modeli veya Furkan) hâlâ gerekli
 * olduğu anlamına gelir, tam otomatik değildir.
 */

function jaccard(expected, actual) {
  const setA = new Set(expected || []);
  const setB = new Set(actual || []);
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 1 : intersection.length / union.size;
}

function flatIntents(actual) { return actual && Array.isArray(actual.intents) ? actual.intents : []; }

function intentSplitAccuracy(fixture, actual) {
  const expected = fixture.expected_intent_count;
  const actualCount = flatIntents(actual).length;
  if (expected === actualCount) return 1;
  const diff = Math.abs(expected - actualCount);
  const denom = Math.max(expected, actualCount, 1);
  return Math.max(0, 1 - diff / denom);
}

function workspaceAccuracy(fixture, actual) {
  return jaccard(fixture.expected_workspaces, flatIntents(actual).map(i => i.workspace));
}

function entityAccuracy(fixture, actual) {
  const actualPeople = flatIntents(actual).flatMap(i => (i.related_people || []).map(p => p.id));
  return jaccard(fixture.expected_related_people.map(p => p.id), actualPeople);
}

function relationAccuracy(fixture, actual) {
  const actualProjects = flatIntents(actual).flatMap(i => {
    if (Array.isArray(i.related_project)) return i.related_project;
    return i.related_project ? [i.related_project] : [];
  });
  return jaccard(fixture.expected_related_projects, actualProjects);
}

function categoryAccuracy(fixture, actual) {
  const actualCats = flatIntents(actual).flatMap(i => Array.isArray(i.category) ? i.category : (i.category ? [i.category] : []));
  return jaccard(fixture.expected_categories, actualCats);
}

function actionAccuracy(fixture, actual) {
  return jaccard(fixture.expected_primary_actions, flatIntents(actual).map(i => i.primary_action).filter(Boolean));
}

function responsibilityAccuracy(fixture, actual) {
  const norm = r => `${r.domain}=${r.owner}`;
  const actualResp = flatIntents(actual).flatMap(i => (i.responsibilities || []).map(norm));
  return jaccard(fixture.expected_responsibilities.map(norm), actualResp);
}

/** KRİTİK metrik: negation ters anlaşıldıysa (yasak eylem "onaylı" sayıldıysa) 0 döner. */
function negationAccuracy(fixture, actual) {
  const hasProhibited = (fixture.expected_prohibited_actions || []).length > 0;
  if (!hasProhibited) return 1;
  const actualApprovalTrue = flatIntents(actual).some(i => Boolean(i.approval_candidate));
  if (fixture.expected_approval === false && actualApprovalTrue) return 0;
  return 1;
}

function prohibitedActionAccuracy(fixture, actual) {
  const actualProhibited = flatIntents(actual).flatMap(i => i.prohibited_actions || []);
  return jaccard(fixture.expected_prohibited_actions, actualProhibited);
}

function approvalAccuracy(fixture, actual) {
  const actualApproval = flatIntents(actual).some(i => Boolean(i.approval_candidate));
  return actualApproval === fixture.expected_approval ? 1 : 0;
}

function missingInfoAccuracy(fixture, actual) {
  const actualMissing = flatIntents(actual).flatMap(i => i.missing_information || []);
  const expectedHas = (fixture.expected_missing_information || []).length > 0;
  const actualHas = actualMissing.length > 0;
  return expectedHas === actualHas ? 1 : 0.5;
}

module.exports = {
  jaccard, intentSplitAccuracy, workspaceAccuracy, entityAccuracy, relationAccuracy,
  categoryAccuracy, actionAccuracy, responsibilityAccuracy, negationAccuracy,
  prohibitedActionAccuracy, approvalAccuracy, missingInfoAccuracy,
};
