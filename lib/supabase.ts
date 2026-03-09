import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null;

/**
 * Supabase Lazy-Loading Proxy.
 * Client sadece bir metod çağrıldığında oluşturulur.
 */
export const supabase = new Proxy({} as SupabaseClient, {
    get: (target, prop) => {
        return (...args: any[]) => {
            if (!_supabase) {
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                if (!url || !key) {
                    return Promise.resolve({ data: { session: null }, error: null });
                }
                _supabase = createClient(url, key);
            }

            const member = (_supabase as any)[prop];
            if (typeof member === 'function') {
                return member.apply(_supabase, args);
            }
            return member;
        };
    }
});
