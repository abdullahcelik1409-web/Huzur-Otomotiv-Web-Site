import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.warn('Supabase env variables missing');
            return {} as SupabaseClient;
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

// Backward-compatible default export
export const supabase = typeof window !== 'undefined'
    ? getSupabase()
    : (new Proxy({} as SupabaseClient, {
        get: (_target, prop) => {
            const client = getSupabase();
            return (client as any)[prop];
        }
    }));
