/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PRICE_2500?: string;
  readonly VITE_STRIPE_PRICE_10000?: string;
  readonly VITE_STRIPE_PRICE_50000?: string;
  readonly VITE_STRIPE_PRICE_250000?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
