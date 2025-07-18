// Service Worker Optimizado v2.0
const CACHE_NAME = 'portfolio-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const IMAGE_CACHE = 'images-v2.0';

// Recursos críticos (cache primero)
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/critical.css',
  '/js/optimizer.js',
  '/favicon.svg'
];

// Recursos dinámicos (network primero)
const DYNAMIC_RESOURCES = [
  '/portfolio-gallery.html',
  '/css/modal.css',
  '/css/preloader.css',
  '/js/portfolio-gallery.js'
];

// Instalar el service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache crítico
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Cacheando recursos críticos');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Pre-cache de recursos dinámicos
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('📦 Pre-cacheando recursos dinámicos');
        return cache.addAll(DYNAMIC_RESOURCES);
      })
    ]).then(() => {
      console.log('✅ Service Worker instalado');
      self.skipWaiting(); // Activar inmediatamente
    })
  );
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activado');
      return self.clients.claim(); // Tomar control inmediatamente
    })
  );
});

// Estrategias de cache inteligentes
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo cachear GET requests
  if (request.method !== 'GET') return;

  // Estrategia para imágenes (Cache first con timeout)
  if (request.destination === 'image' || url.href.includes('images.unsplash.com')) {
    event.respondWith(cacheFirstWithTimeout(request, IMAGE_CACHE, 5000));
    return;
  }

  // Estrategia para recursos críticos (Cache first)
  if (CRITICAL_RESOURCES.some(resource => url.pathname === resource)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Estrategia para CSS/JS (Stale while revalidate)
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Estrategia para HTML (Network first)
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Para fuentes (Cache first)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Default: Network first para todo lo demás
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ===== ESTRATEGIAS DE CACHE =====

// Cache first - Bueno para recursos estáticos
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('❌ Error de red:', error);
    throw error;
  }
}

// Network first - Bueno para contenido dinámico
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('📡 Fallback a cache para:', request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale while revalidate - Bueno para recursos que cambian ocasionalmente
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Actualizar en background
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Retornar cache si existe, sino esperar la red
  return cached || fetchPromise;
}

// Cache first con timeout - Bueno para imágenes
async function cacheFirstWithTimeout(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(request, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('⏱️ Timeout o error para imagen:', request.url);
    // Retornar imagen placeholder si hay error
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#667eea"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial">Imagen no disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}
