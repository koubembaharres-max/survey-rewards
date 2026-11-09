import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin as db } from '@/lib/supabase-admin'
import { NETWORKS } from '@/lib/networks'

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
}

async function handle(req: NextRequest, network: string) {
  const cfg = NETWORKS[network]
  if (!cfg) {
    return NextResponse.json({ error: 'unknown_network' }, { status: 404 })
  }

  const params: Record<string, string> = {}
  req.nextUrl.searchParams.forEach((v, k) => (params[k] = v))
  if (req.method === 'POST') {
    const ct = req.headers.get('content-type') ?? ''
    if (ct.includes('application/json')) {
      Object.assign(params, await req.json())
    } else {
      const text = await req.text()
      new URLSearchParams(text).forEach((v, k) => (params[k] = v))
    }
  }

  const receivedHash = params.hash ?? params.signature ?? ''
  const expectedHash = crypto
    .createHash(cfg.hashAlgo)
    .update(cfg.buildHashString(params))
    .digest('hex')

  if (!receivedHash || !safeEqual(receivedHash.toLowerCase(), expectedHash.toLowerCase())) {
    console.warn('[postback] bad hash', { network, params })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  const m = cfg.mapParams(params)
  const grossCents = Math.round(m.amountUsd * 100)
  const userCents = Math.round(grossCents * cfg.userShare)

  const { data: profile } = await db
    .from('profiles')
    .select('id, status')
    .eq('id', m.externalUserId)
    .maybeSingle()

  if (!profile) return NextResponse.json({ error: 'unknown_user' }, { status: 200 })
  if (profile.status !== 'active') return NextResponse.json({ ok: true, ignored: 'user_flagged' })

  const oneHourAgo = new Date(Date.now() - 3600_000).toISOString()
  const { count } = await db
    .from('conversions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .gte('created_at', oneHourAgo)

  if ((count ?? 0) > 40) {
    await db.from('profiles').update({ status: 'flagged' }).eq('id', profile.id)
    return NextResponse.json({ ok: true, ignored: 'rate_limited' })
  }

  if (m.status === 'reversed') {
    const { data: conv } = await db
      .from('conversions')
      .select('id')
      .eq('network', network)
      .eq('external_tx_id', m.externalTxId)
      .maybeSingle()
    if (conv) await db.rpc('reverse_conversion', { p_conversion_id: conv.id })
    return NextResponse.json({ ok: true, reversed: true })
  }

  const { data, error } = await db.rpc('apply_postback', {
    p_network: network,
    p_external_tx_id: m.externalTxId,
    p_user_id: profile.id,
    p_offer_id: m.offerId,
    p_gross_cents: grossCents,
    p_user_cents: userCents,
    p_hold_days: cfg.holdDays,
    p_raw: params,
  })

  if (error) {
    console.error('[postback] rpc error', error)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ...data })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ network: string }> }) {
  const { network } = await ctx.params
  return handle(req, network)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ network: string }> }) {
  const { network } = await ctx.params
  return handle(req, network)
}