import { supabase } from './supabase';
import type { Scan } from './types';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? ANON;
  return { Authorization: `Bearer ${token}`, apikey: ANON };
}

async function call<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${FN_URL}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error ?? `Request failed (${res.status})`);
  return json as T;
}

export interface StartScanResult {
  scan: Scan;
  preview?: Array<Record<string, unknown>>;
}

/** Kick off an Apify pull. `limit` = max rows (also the credit ceiling). */
export function startScan(
  handle: string,
  scanType: 'followers' | 'videos' | 'both',
  limit: number,
  preview = false,
) {
  return call<StartScanResult>('start-scan', { handle, scanType, limit, preview });
}

/** Poll a running scan; ingests the dataset once the Apify run finishes. */
export function scanStatus(scanId: string) {
  return call<{ scan: Scan; ingested?: number }>('scan-status', { scanId });
}

/** Create a Stripe Checkout Session for a credit pack; returns the hosted URL. */
export function createCheckout(priceId: string) {
  return call<{ url: string }>('create-checkout-session', { priceId });
}
