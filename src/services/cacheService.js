const CACHE_PREFIX = 'malazi_cache_'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

export const cacheService = {
  set(key, data, ttl = DEFAULT_TTL) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
  },

  get(key) {
    const item = localStorage.getItem(CACHE_PREFIX + key)
    if (!item) return null

    const { data, timestamp, ttl } = JSON.parse(item)
    if (Date.now() - timestamp > ttl) {
      this.remove(key)
      return null
    }

    return data
  },

  remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key)
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key))
  }
} 