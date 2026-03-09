import { PrismaClient } from '@prisma/client'

// PrismaClient'ı sadece gerçekten bir veritabanı işlemi yapıldığında oluşturmak için Proxy kullanıyoruz.
// Bu sayede Next.js build sırasında (statik analiz adımında) DATABASE_URL eksik olsa bile hata almayız.
let _prisma: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        // Sadece server-side çalışmasını garanti altına alalım
        if (typeof window !== 'undefined') return undefined;

        if (!_prisma) {
            // Sektör standartı: Singleton pattern
            if (process.env.NODE_ENV === 'production') {
                _prisma = new PrismaClient();
            } else {
                if (!(globalThis as any).prisma) {
                    (globalThis as any).prisma = new PrismaClient();
                }
                _prisma = (globalThis as any).prisma;
            }
        }

        const value = (_prisma as any)[prop];
        if (typeof value === 'function') {
            return value.bind(_prisma);
        }
        return value;
    }
});
