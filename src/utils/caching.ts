// authCache.ts - Fichier séparé pour gérer le cache
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class AuthCache {
    private cache: CacheEntry<any> | null = null;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    get<T>(): T | null {
        if (!this.cache) return null;

        const now = Date.now();
        const isExpired = (now - this.cache.timestamp) > this.CACHE_DURATION;

        if (isExpired) {
            this.clear();
            return null;
        }

        return this.cache.data as T;
    }

    set<T>(data: T): void {
        this.cache = {
            data,
            timestamp: Date.now(),
        };
    }

    clear(): void {
        this.cache = null;
    }
}

export const authCache = new AuthCache();