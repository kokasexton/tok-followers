import Stripe from 'npm:stripe@17';

let cached: Stripe | null = null;

export function stripe(): Stripe {
  if (cached) return cached;
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  cached = new Stripe(key, { apiVersion: '2024-06-20' });
  return cached;
}
