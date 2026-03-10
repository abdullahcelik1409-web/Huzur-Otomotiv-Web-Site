import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null;

export const supabase = (() => {
    if (typeof window === 'undefined') {
        // SSR Safe dummy client
        return {} as SupabaseClient;
    }

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
})();
