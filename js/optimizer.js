// ===== OPTIMIZADOR DE IMÁGENES Y LAZY LOADING AVANZADO =====
class ImageOptimizer {
  constructor() {
    this.lazyImages = [];
    this.imageObserver = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.optimizeImages();
    this.preloadCriticalImages();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observar todas las imágenes lazy
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Crear nueva imagen para precargar
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Aplicar efecto de fade-in
      img.style.opacity = '0';
      img.src = src;
      img.style.transition = 'opacity 0.3s ease';
      
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
      
      // Remover data-src para evitar recargas
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    };

    imageLoader.onerror = () => {
      // Imagen de fallback
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23667eea"/><text x="50%" y="50%" text-anchor="middle" fill="white">Imagen no disponible</text></svg>';
    };

    imageLoader.src = src;
  }

  preloadCriticalImages() {
    // Precargar imágenes críticas (above the fold)
    const criticalImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center&q=80&fm=webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeImages() {
    // Optimizar calidad según conexión
    if ('connection' in navigator) {
      const connection = navigator.connection;
      let quality = 80;

      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        quality = 60;
      } else if (connection.effectiveType === '3g') {
        quality = 70;
      }

      // Actualizar URLs de imágenes con nueva calidad
      document.querySelectorAll('img[src*="unsplash"]').forEach(img => {
        if (img.src.includes('&q=')) {
          img.src = img.src.replace(/&q=\d+/, `&q=${quality}`);
        }
      });
    }
  }
}

// ===== OPTIMIZADOR DE RECURSOS =====
class ResourceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeCSS();
    this.optimizeJavaScript();
    this.setupResourceHints();
  }

  optimizeCSS() {
    // Cargar CSS no crítico de forma asíncrona
    const nonCriticalCSS = [
      'css/modal.css',
      'css/preloader.css'
    ];

    nonCriticalCSS.forEach(href => {
      this.loadCSSAsync(href);
    });
  }

  loadCSSAsync(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
    document.head.appendChild(link);
  }

  optimizeJavaScript() {
    // Diferir scripts no críticos
    const scripts = document.querySelectorAll('script:not([async]):not([defer])');
    scripts.forEach(script => {
      if (!script.src.includes('preloader') && !script.innerHTML.includes('PreloaderManager')) {
        script.defer = true;
      }
    });
  }

  setupResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }
}

// ===== OPTIMIZADOR DE ANIMACIONES =====
class AnimationOptimizer {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isLowPowerMode = this.detectLowPowerMode();
    this.init();
  }

  init() {
    if (this.reducedMotion || this.isLowPowerMode) {
      this.optimizeForPerformance();
    }
    this.optimizeParticles();
    this.setupRAFThrottling();
  }

  detectLowPowerMode() {
    // Detectar dispositivos de baja potencia
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    
    return hardwareConcurrency <= 2 || memory <= 2;
  }

  optimizeForPerformance() {
    // Reducir partículas
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      if (index > 8) { // Mantener solo 8 partículas
        particle.remove();
      }
    });

    // Deshabilitar animaciones complejas
    document.documentElement.classList.add('performance-mode');
  }

  optimizeParticles() {
    const particleContainer = document.querySelector('.particles-background');
    if (!particleContainer) return;

    // Pausar animaciones cuando no son visibles
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const particles = entry.target.querySelectorAll('.particle');
        particles.forEach(particle => {
          particle.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      });
    });

    observer.observe(particleContainer);
  }

  setupRAFThrottling() {
    // Throttle requestAnimationFrame para mejor rendimiento
    let rafId;
    let lastTime = 0;
    const throttleDelay = this.isLowPowerMode ? 32 : 16; // 30fps o 60fps

    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      return originalRAF(function(time) {
        if (time - lastTime >= throttleDelay) {
          callback(time);
          lastTime = time;
        } else {
          window.requestAnimationFrame(callback);
        }
      });
    };
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar optimizadores
  new ImageOptimizer();
  new ResourceOptimizer();
  new AnimationOptimizer();
  
  console.log('🚀 Optimizaciones avanzadas activadas');
});

// ===== MÉTRICAS DE RENDIMIENTO =====
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      this.observeWebVitals();
    }
    this.measureLoadTime();
  }

  observeWebVitals() {
    // Observar Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`📊 ${entry.name}: ${entry.value}ms`);
        this.metrics[entry.name] = entry.value;
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }

  measureLoadTime() {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`⚡ Tiempo total de carga: ${loadTime}ms`);
      
      // Reportar si es necesario optimizar más
      if (loadTime > 3000) {
        console.warn('⚠️ Tiempo de carga alto. Considera más optimizaciones.');
      }
    });
  }
}

new PerformanceMonitor();
