/*
 * Primary / Judge / Failover / Bulk Role Selector (P2.5)
 *
 * KURAL: Gerçek eval verisi olmadan hiçbir kazanan UYDURULMAZ. Bu fonksiyon
 * sadece MEKANİZMAYI tanımlar -- girdi olarak modelScores (gerçek eval
 * sonucu) bekler, bugün hiçbir yerde gerçek/varsayılan bir skor listesi
 * TANIMLANMADI. Testlerde sadece sentetik/mock skorlarla mekanik doğrulanır.
 *
 * Kritik güvenlik hatası olan bir model PRIMARY veya JUDGE olamaz.
 */

/**
 * @param {Array<{modelId: string, productionFitScore: number, safetyScore: number, costScore: number|null, blockedByCriticalFail: boolean}>} modelScores
 */
function selectRoles(modelScores) {
  if (!Array.isArray(modelScores) || modelScores.length === 0) {
    return { primary: null, judge: null, failover: null, bulkEconomy: null, reason: "NO_MODEL_SCORES_PROVIDED" };
  }

  const eligible = modelScores.filter(m => !m.blockedByCriticalFail);
  if (eligible.length === 0) {
    return { primary: null, judge: null, failover: null, bulkEconomy: null, reason: "NO_ELIGIBLE_MODEL_ALL_CRITICAL_FAIL" };
  }

  const byProductionFit = [...eligible].sort((a, b) => b.productionFitScore - a.productionFitScore);
  const primary = byProductionFit[0];

  const judgeCandidates = eligible.filter(m => m.modelId !== primary.modelId).sort((a, b) => b.safetyScore - a.safetyScore);
  const judge = judgeCandidates[0] || null;

  const failover = byProductionFit.find(m => m.modelId !== primary.modelId) || null;

  const withCost = eligible.filter(m => typeof m.costScore === "number");
  const bulkEconomy = withCost.length ? [...withCost].sort((a, b) => b.costScore - a.costScore)[0] : null;

  return {
    primary: primary.modelId,
    judge: judge ? judge.modelId : null,
    failover: failover ? failover.modelId : null,
    bulkEconomy: bulkEconomy ? bulkEconomy.modelId : null,
    reason: null,
    excludedForCriticalFail: modelScores.filter(m => m.blockedByCriticalFail).map(m => m.modelId),
  };
}

module.exports = { selectRoles };
