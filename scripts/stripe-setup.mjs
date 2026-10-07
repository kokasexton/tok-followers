#!/usr/bin/env node
// Create the Stripe products + prices for the Scoutline credit packs. Idempotent.
//
//   STRIPE_SECRET_KEY=sk_live_… node scripts/stripe-setup.mjs
//
// Prints the four price IDs and writes them to .stripe-ids.json (git-ignored).
// Put them in the front-end env as VITE_STRIPE_PRICE_2500 / _10000 / _50000 / _250000.
//
// No dependencies — talks to the Stripe REST API with fetch.

import { writeFileSync } from 'node:fs';

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY) {
  console.error('STRIPE_SECRET_KEY is required (sk_live_… or sk_test_…).');
  process.exit(1);
}

const PACKS = [
  { credits: 2500, amount: 2500_00, key: 'scoutline_credits_2500' },
  { credits: 10000, amount: 10000_00, key: 'scoutline_credits_10000' },
  { credits: 50000, amount: 50000_00, key: 'scoutline_credits_50000' },
  { credits: 250000, amount: 250000_00, key: 'scoutline_credits_250000' },
];

const API = 'https://api.stripe.com/v1';

async function stripe(path, params, method = 'POST') {
  const body = method === 'GET' ? undefined : new URLSearchParams(params).toString();
  const url = method === 'GET' ? `${API}/${path}?${new URLSearchParams(params)}` : `${API}/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-06-20',
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${json?.error?.message ?? JSON.stringify(json)}`);
  return json;
}

async function findPriceByLookupKey(lookupKey) {
  const r = await stripe('prices/search', { query: `lookup_key:'${lookupKey}'`, limit: 1 }, 'GET');
  return r.data?.[0] ?? null;
}

const out = {};
for (const p of PACKS) {
  const label = p.credits.toLocaleString('en-US');
  let price = await findPriceByLookupKey(p.key);

  if (price) {
    console.log(`↺ ${label} credits — existing price ${price.id}`);
  } else {
    const product = await stripe('products', {
      name: `Scoutline — ${label} credits`,
      description: `${label} pull credits. 1 credit = 1 follower or video row delivered.`,
      'metadata[credits]': String(p.credits),
    });
    price = await stripe('prices', {
      currency: 'usd',
      unit_amount: String(p.amount),
      product: product.id,
      lookup_key: p.key,
      'metadata[credits]': String(p.credits),
    });
    console.log(`✓ ${label} credits — created ${price.id} (product ${product.id})`);
  }
  out[`VITE_STRIPE_PRICE_${p.credits}`] = price.id;
}

writeFileSync('.stripe-ids.json', JSON.stringify(out, null, 2) + '\n');
console.log('\nWrote .stripe-ids.json:\n' + JSON.stringify(out, null, 2));
