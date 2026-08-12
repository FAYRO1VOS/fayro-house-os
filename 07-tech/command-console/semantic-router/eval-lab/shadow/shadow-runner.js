/*
 * Shadow Mode (P2.5)
 *
 * Aynı input hem PRIMARY hem SHADOW modele gönderilebilir (ileride). SHADOW
 * çıktısı KURAL GEREĞİ hiçbir zaman task/action/persistence tetikleyemez --
 * sadece eval/karşılaştırma amaçlıdır. `actionable` alanı HER ZAMAN false'tur
 * ve bu dosyada hiçbir kod yolu bunu true yapamaz.
 *
 * Bugün gerçek network çağrısı yok -- bu sadece mekanizmanın sözleşmesidir,
 * mock adapter'larla test edilir.
 */

async function runShadow(primaryAdapter, shadowAdapter, rawInput, contextPack, fixtureForMock) {
  const primaryOutput = await primaryAdapter.extractIntent(rawInput, contextPack, fixtureForMock);

  let shadowOutput = null;
  let shadowError = null;
  try {
    shadowOutput = await shadowAdapter.extractIntent(rawInput, contextPack, fixtureForMock);
  } catch (e) {
    shadowError = e.message;
  }

  return {
    primaryOutput, // Gerçek akışa devam eden TEK çıktı
    shadowResult: {
      output: shadowOutput,
      error: shadowError,
      actionable: false, // KURAL: değiştirilemez, her zaman false
    },
  };
}

/** Güvenlik testleri için: bir shadowResult objesinin kurala uyup uymadığını doğrular. */
function isShadowResultSafe(shadowResult) {
  return shadowResult && shadowResult.actionable === false;
}

module.exports = { runShadow, isShadowResultSafe };
