export const NETWORKS: Record<string, any> = {
  test: {
    secret: process.env.TEST_SECRET ?? 'secret123',
    hashAlgo: 'sha256',
    buildHashString: (p: any) => `${p.user_id}${p.tx_id}${p.amount}${process.env.TEST_SECRET ?? 'secret123'}`,
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
}