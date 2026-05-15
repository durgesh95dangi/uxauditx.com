// src/lib/supabase.ts
// Uses a Proxy to lazily initialize the client only when first used.
// This prevents build-time crashes when env vars aren't embedded yet.
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role bypasses RLS
    )
  }
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient()
    const value = (c as any)[prop]
    return typeof value === 'function' ? value.bind(c) : value
  },
})
