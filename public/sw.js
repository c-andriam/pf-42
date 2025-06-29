/**
 * Service Worker for Portfolio 42 - c-andriam
 * Provides offline functionality and caching
 * Version: 2.0.0
 */

'use strict';

// ===== CONFIGURATION =====
const CACHE_CONFIG = {
    NAME: 'portfolio-42-v2.0.0',
    VERSION: '2.0.0',
    OFFLINE_PAGE: '/offline.html'
};

const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Resources to cache immediately
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favicon.ico',
    '/assets/profile.jpg'
];

// External resources
const EXTERNAL_CACHE_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// All cache URLs
const CACHE_URLS = [...STATIC_CACHE_URLS, ...EXTERNAL_CACHE_URLS];

// Cache strategies for different resource types
const CACHE_STRATEGY_MAP = {
    // Static assets - cache first
    '\\.css$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.js$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.png$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.jpg$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.jpeg$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.svg$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.ico$': CACHE_STRATEGIES.CACHE_FIRST,
    '\\.woff2?$': CACHE_STRATEGIES.CACHE_FIRST,
    
    // HTML pages - network first
    '\\.html$': CACHE_STRATEGIES.NETWORK_FIRST,
    '^/$': CACHE_STRATEGIES.NETWORK_FIRST,
    
    // External APIs - stale while revalidate
    'readme-typing-svg': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    'cdnjs.cloudflare.com': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
};

// ===== UTILITY FUNCTIONS =====
const Logger = {
    log: (message, data = null) => {
        console.log(`[SW ${CACHE_CONFIG.VERSION}] ${message}`, data || '');
    },
    error: (message, error = null) => {
        console.error(`[SW ${CACHE_CONFIG.VERSION}] ${message}`, error || '');
    }
};

const CacheUtils = {
    /**
     * Open cache with error handling
     */
    async openCache(cacheName = CACHE_CONFIG.NAME) {
        try {
            return await caches.open(cacheName);
        } catch (error) {
            Logger.error('Failed to open cache:', error);
            throw error;
        }
    },

    /**
     * Add URLs to cache with error handling
     */
    async addToCache(cache, urls) {
        const results = await Promise.allSettled(
            urls.map(url => cache.add(url).catch(error => {
                Logger.error(`Failed to cache: ${url}`, error);
                return null;
            }))
        );
        
        const successful = results.filter(result => result.status === 'fulfilled').length;
        Logger.log(`Cached ${successful}/${urls.length} resources`);
        
        return results;
    },

    /**
     * Clean old caches
     */
    async cleanOldCaches() {
        try {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name => 
                name.startsWith('portfolio-42-') && name !== CACHE_CONFIG.NAME
            );
            
            if (oldCaches.length > 0) {
                await Promise.all(oldCaches.map(name => caches.delete(name)));
                Logger.log(`Cleaned ${oldCaches.length} old caches`);
            }
        } catch (error) {
            Logger.error('Failed to clean old caches:', error);
        }
    },

    /**
     * Get cache strategy for URL
     */
    getCacheStrategy(url) {
        for (const [pattern, strategy] of Object.entries(CACHE_STRATEGY_MAP)) {
            if (new RegExp(pattern).test(url)) {
                return strategy;
            }
        }
        return CACHE_STRATEGIES.NETWORK_FIRST; // Default strategy
    }
};

const NetworkUtils = {
    /**
     * Check if request should be cached
     */
    shouldCache(request) {
        const url = new URL(request.url);
        
        // Only cache GET requests
        if (request.method !== 'GET') return false;
        
        // Don't cache chrome-extension or other non-http requests
        if (!url.protocol.startsWith('http')) return false;
        
        // Don't cache requests with query parameters (except specific ones)
        if (url.search && !url.href.includes('readme-typing-svg')) return false;
        
        return true;
    },

    /**
     * Create a timeout promise
     */
    timeout(ms) {
        return new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), ms)
        );
    },

    /**
     * Fetch with timeout
     */
    async fetchWithTimeout(request, timeoutMs = 5000) {
        try {
            return await Promise.race([
                fetch(request),
                this.timeout(timeoutMs)
            ]);
        } catch (error) {
            Logger.error('Fetch failed:', error);
            throw error;
        }
    }
};

// ===== CACHE STRATEGIES =====
const CacheStrategies = {
    /**
     * Cache First Strategy
     * Try cache first, fallback to network
     */
    async cacheFirst(request) {
        try {
            const cache = await CacheUtils.openCache();
            const cachedResponse = await cache.match(request);
            
            if (cachedResponse) {
                Logger.log(`Cache hit: ${request.url}`);
                return cachedResponse;
            }
            
            Logger.log(`Cache miss: ${request.url}`);
            const networkResponse = await NetworkUtils.fetchWithTimeout(request);
            
            // Cache successful responses
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            Logger.error('Cache first strategy failed:', error);
            
            // Try to return cached version as last resort
            const cache = await CacheUtils.openCache();
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            
            throw error;
        }
    },

    /**
     * Network First Strategy
     * Try network first, fallback to cache
     */
    async networkFirst(request) {
        try {
            const networkResponse = await NetworkUtils.fetchWithTimeout(request, 3000);
            
            if (networkResponse.ok) {
                const cache = await CacheUtils.openCache();
                cache.put(request, networkResponse.clone());
                Logger.log(`Network success: ${request.url}`);
            }
            
            return networkResponse;
        } catch (error) {
            Logger.log(`Network failed: ${request.url}, trying cache`);
            
            const cache = await CacheUtils.openCache();
            const cachedResponse = await cache.match(request);
            
            if (cachedResponse) {
                Logger.log(`Cache fallback: ${request.url}`);
                return cachedResponse;
            }
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
                const offlineResponse = await cache.match(CACHE_CONFIG.OFFLINE_PAGE);
                if (offlineResponse) {
                    return offlineResponse;
                }
            }
            
            throw error;
        }
    },

    /**
     * Stale While Revalidate Strategy
     * Return cached version immediately, update cache in background
     */
    async staleWhileRevalidate(request) {
        const cache = await CacheUtils.openCache();
        const cachedResponse = await cache.match(request);
        
        // Start network request (don't await)
        const networkPromise = NetworkUtils.fetchWithTimeout(request)
            .then(response => {
                if (response.ok) {
                    cache.put(request, response.clone());
                    Logger.log(`Background update: ${request.url}`);
                }
                return response;
            })
            .catch(error => {
                Logger.error(`Background update failed: ${request.url}`, error);
            });
        
        // Return cached version immediately if available
        if (cachedResponse) {
            Logger.log(`Stale cache hit: ${request.url}`);
            return cachedResponse;
        }
        
        // If no cache, wait for network
        try {
            return await networkPromise;
        } catch (error) {
            Logger.error('Stale while revalidate failed:', error);
            throw error;
        }
    }
};

// ===== EVENT LISTENERS =====

/**
 * Install Event
 * Cache static resources
 */
self.addEventListener('install', (event) => {
    Logger.log('Installing service worker...');
    
    event.waitUntil(
        (async () => {
            try {
                const cache = await CacheUtils.openCache();
                await CacheUtils.addToCache(cache, CACHE_URLS);
                
                Logger.log('Service worker installed successfully');
                
                // Skip waiting to activate immediately
                return self.skipWaiting();
            } catch (error) {
                Logger.error('Service worker installation failed:', error);
                throw error;
            }
        })()
    );
});

/**
 * Activate Event
 * Clean up old caches and claim clients
 */
self.addEventListener('activate', (event) => {
    Logger.log('Activating service worker...');
    
    event.waitUntil(
        (async () => {
            try {
                await CacheUtils.cleanOldCaches();
                
                // Claim all clients immediately
                await self.clients.claim();
                
                Logger.log('Service worker activated successfully');
            } catch (error) {
                Logger.error('Service worker activation failed:', error);
                throw error;
            }
        })()
    );
});

/**
 * Fetch Event
 * Handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // Skip non-cacheable requests
    if (!NetworkUtils.shouldCache(request)) {
        return;
    }
    
    event.respondWith(
        (async () => {
            try {
                const strategy = CacheUtils.getCacheStrategy(request.url);
                
                switch (strategy) {
                    case CACHE_STRATEGIES.CACHE_FIRST:
                        return await CacheStrategies.cacheFirst(request);
                    
                    case CACHE_STRATEGIES.NETWORK_FIRST:
                        return await CacheStrategies.networkFirst(request);
                    
                    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
                        return await CacheStrategies.staleWhileRevalidate(request);
                    
                    default:
                        return await CacheStrategies.networkFirst(request);
                }
            } catch (error) {
                Logger.error(`Fetch handler failed for ${request.url}:`, error);
                
                // Return a basic error response
                return new Response('Service Unavailable', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            }
        })()
    );
});

/**
 * Message Event
 * Handle messages from main thread
 */
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_CONFIG.VERSION });
            break;
            
        case 'CLEAR_CACHE':
            caches.delete(CACHE_CONFIG.NAME).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            Logger.log('Unknown message type:', type);
    }
});

/**
 * Error Event
 * Global error handler
 */
self.addEventListener('error', (event) => {
    Logger.error('Service worker error:', event.error);
});

/**
 * Unhandled Rejection Event
 * Handle unhandled promise rejections
 */
self.addEventListener('unhandledrejection', (event) => {
    Logger.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Log successful service worker load
Logger.log(`Service worker loaded successfully (v${CACHE_CONFIG.VERSION})`);
