  timewall: {
    secret: process.env.TIMEWALL_SECRET!,
    hashAlgo: 'md5', // Vérifie dans leur doc si c'est md5 ou sha256
    // L'ordre exact que Timewall utilise : (souvent user_id + amount + tx_id + secret)
    buildHashString: (p) => `${p.user_id}${p.amount}${p.tx_id}${process.env.TIMEWALL_SECRET}`, 
    mapParams: (p) => ({
      externalUserId: p.user_id,
      externalTxId: p.tx_id,
      offerId: null,
      amountUsd: Number(p.amount),
      status: p.status === 'reversal' ? 'reversed' : 'credited',
    }),
    userShare: 0.60, // Tu reverses 60% à l'utilisateur
    holdDays: 0, // 0 jour pour que ce soit visible tout de suite (à changer plus tard)
  },