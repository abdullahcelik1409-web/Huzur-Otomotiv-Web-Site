import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient; pool?: Pool }

/**
 * Prisma 7 için Lazy-Loading Proxy.
 * Client sadece bir metod (findMany vb.) gerçekten çağrıldığında oluşturulur.
 * Bu sayede build sırasında (static analysis) veritabanı bağlantısı aranmaz.
 */
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        // Sadece sunucu tarafında çalışmalı
        if (typeof window !== 'undefined') return undefined;

        return new Proxy({} as any, {
            get: (targetModel, method) => {
                return async (...args: any[]) => {
                    if (!globalForPrisma.prisma) {
                        // Build sırasında DATABASE_URL yoksa patlamaması için kontrol
                        if (!process.env.DATABASE_URL) {
                            if (process.env.NODE_ENV === 'production') {
                                throw new Error('DATABASE_URL environment variable is not set');
                            }
                            return [];
                        }

                        // Adapter ile PrismaClient oluştur
                        if (!globalForPrisma.pool) {
                            globalForPrisma.pool = new Pool({
                                connectionString: process.env.DATABASE_URL,
                            });
                        }

                        const adapter = new PrismaPg(globalForPrisma.pool);

                        globalForPrisma.prisma = new PrismaClient({
                            adapter,
                            log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
                        });
                    }

                    const model = (globalForPrisma.prisma as any)[prop];
                    if (!model) return undefined;

                    const fn = model[method];
                    if (typeof fn !== 'function') return undefined;

                    return fn.apply(model, args);
                };
            }
        });
    }
});
