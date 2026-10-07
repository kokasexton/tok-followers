-- Force PostgREST to reload its schema cache after the billing/scan migration.
-- PostgREST runs LISTEN pgrst; this NOTIFY reaches it from our session.
NOTIFY pgrst, 'reload schema';
