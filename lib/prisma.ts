import { PrismaClient } from '@prisma/client'

// Prisma 7 Singleton - Zero-Interaction Build Bypass
let _prisma: PrismaClient | undefined;

/**
 * Prisma Client'ı sadece gerçekten bir veritabanı METODU çağrıldığında
 * (findMany vb.) ve sadece çalışma zamanında (Runtime) oluşturur.
 */
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        if (typeof window !== 'undefined') return undefined;

        return new Proxy({} as any, {
            get: (targetModel, method) => {
                return async (...args: any[]) => {
                    if (!_prisma) {
                        const url = process.env.DATABASE_URL;

                        // BUILD TESPİTİ: 
                        const isBuild = !url ||
                            process.env.CI === 'true' ||
                            (process.env.NODE_ENV === 'production' && !process.env.VERCEL);

                        if (isBuild) {
                            return Promise.resolve([]);
                        }

                        try {
                            // Prisma 7'de DATABASE_URL çevresel değişken olarak tanımlıysa 
                            // boş constructor yeterli olmalı (şemada url olmasa bile).
                            const { PrismaClient: PC } = await import('@prisma/client');
                            _prisma = new PC();
                        } catch (e) {
                            return Promise.resolve([]);
                        }
                    }

                    if (!_prisma) return Promise.resolve([]);

                    const model = (_prisma as any)[prop];
                    if (!model) return Promise.resolve([]);

                    const fn = model[method];
                    if (typeof fn !== 'function') return Promise.resolve([]);

                    return fn.apply(model, args);
                };
            }
        });
    }
});
