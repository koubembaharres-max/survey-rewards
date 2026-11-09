export const NETWORKS: Record<string, any> = {
  // Configuration pour tes tests locaux
  test: {
    secret: process.env.TEST_SECRET ?? 'secret123',
    hashAlgo: 'sha256',
    buildHashString: (p: any) =>
      `${p.user_id}${p.tx_id}${p.amount}${process.env.TEST_SECRET ?? 'secret123'}`,
    mapParams: (p: any) => ({
      externalUserId: p.user_id,
      externalTxId: p.tx_id,
      offerId: p.survey_id ?? null,
      amountUsd: Number(p.amount),
      status: p.status === 'reversal' ? 'reversed' : 'credited',
    }),
    userShare: 0.6,
    holdDays: 0, 
  },

  // Configuration pour le vrai réseau Timewall
  timewall: {
    secret: process.env.TIMEWALL_SECRET!,
    hashAlgo: 'md5', // Timewall utilise généralement MD5 (vérifie dans leur doc si c'est SHA256)
    // L'ordre exact utilisé par Timewall : user_id + amount + tx_id + secret
    buildHashString: (p: any) => 
      `${p.user_id}${p.amount}${p.tx_id}${process.env.TIMEWALL_SECRET}`,
    mapParams: (p: any) => ({
      externalUserId: p.user_id,
      externalTxId: p.tx_id,
      offerId: p.offer_id ?? null,
      amountUsd: Number(p.amount),
      status: p.status === 'reversal' ? 'reversed' : 'credited',
    }),
    userShare: 0.6, // Tu reverses 60% à l'utilisateur
    holdDays: 0,    // À mettre sur 30 plus tard pour la sécurité anti-fraude
  },
}