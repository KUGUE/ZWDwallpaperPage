// ===== CONFIGURACIÓN Y VARIABLES GLOBALES =====
const CONFIG = {
  preloaderDuration: 3000,
  animationDelay: 100,
  loadMoreItemsCount: 6,
  filterDelay: 300
};

let allProjects = [];
let visibleProjects = [];
let currentFilter = 'all';
let isLoading = false;

// ===== DATOS DE PROYECTOS ADICIONALES =====
const additionalProjects = [
  {
    category: 'landing',
    title: 'Startup Landing',
    description: 'Landing page para startup',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Startup', 'Conversion'],
    demoLink: '#',
    codeLink: '#'
  },
  {
    category: 'landing',
    title: 'Product Landing',
    description: 'Promoción de producto',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Product', 'Marketing'],
    demoLink: '#',
    codeLink: '#'
  },
  {
    category: 'portfolio',
    title: 'Photographer Portfolio',
    description: 'Portafolio para fotógrafo',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e4d8eed4?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Photography', 'Portfolio'],
    demoLink: '#',
    codeLink: '#'
  },
  {
    category: 'portfolio',
    title: 'Architect Portfolio',
    description: 'Portafolio para arquitecto',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Architecture', 'Design'],
    demoLink: '#',
    codeLink: '#'
  },
  {
    category: 'restaurant',
    title: 'Café Moderno',
    description: 'Cafetería con estilo',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Café', 'Moderno'],
    demoLink: '#',
    codeLink: '#'
  },
  {
    category: 'restaurant',
    title: 'Bistro Francés',
    description: 'Restaurante estilo francés',
    image: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop&crop=center&q=80&fm=webp',
    tags: ['Bistro', 'Francés'],
    demoLink: '#',
    codeLink: '#'
  }
];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Inicializar preloader
  initializePreloader();
  
  // Inicializar proyectos
  initializeProjects();
  
  // Inicializar filtros
  initializeFilters();
  
  // Inicializar botón "Cargar más"
  initializeLoadMore();
  
  // Inicializar animaciones
  initializeAnimations();
  
  // Inicializar navegación suave
  initializeSmoothScroll();
  
  console.log('🎨 Portfolio Gallery inicializado correctamente');
}

// ===== PRELOADER =====
function initializePreloader() {
  const preloader = document.getElementById('preloader');
  const body = document.body;
  
  // Asegurar que el preloader se muestre durante exactamente 3 segundos
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add('fade-out');
      body.classList.remove('loading');
      
      // Remover el preloader del DOM después de la transición
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
  }, CONFIG.preloaderDuration);
}

// ===== GESTIÓN DE PROYECTOS =====
function initializeProjects() {
  // Obtener proyectos existentes del DOM
  const existingCards = document.querySelectorAll('.project-card');
  allProjects = Array.from(existingCards);
  
  // Inicializar proyectos visibles
  visibleProjects = [...allProjects];
  
  // Añadir animaciones de entrada
  animateProjectsIn(allProjects);
}

function animateProjectsIn(projects) {
  projects.forEach((project, index) => {
    project.style.opacity = '0';
    project.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      project.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      project.style.opacity = '1';
      project.style.transform = 'translateY(0)';
    }, index * CONFIG.animationDelay);
  });
}

// ===== SISTEMA DE FILTROS =====
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleFilterClick(button);
    });
  });
}

function handleFilterClick(clickedButton) {
  const filter = clickedButton.dataset.filter;
  
  if (filter === currentFilter || isLoading) return;
  
  // Actualizar estado visual de botones
  updateFilterButtons(clickedButton);
  
  // Aplicar filtro
  applyFilter(filter);
  
  currentFilter = filter;
}

function updateFilterButtons(activeButton) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => btn.classList.remove('active'));
  activeButton.classList.add('active');
}

function applyFilter(filter) {
  isLoading = true;
  const portfolioGrid = document.getElementById('portfolioGrid');
  const allCards = Array.from(portfolioGrid.querySelectorAll('.project-card'));
  
  // Animar salida de todas las tarjetas
  allCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
    }, index * 25);
  });
  
  // Después de la animación de salida, reorganizar la grilla
  setTimeout(() => {
    // Filtrar las tarjetas que deben mostrarse
    const visibleCards = allCards.filter(card => {
      return filter === 'all' || card.dataset.category === filter;
    });
    
    const hiddenCards = allCards.filter(card => {
      return filter !== 'all' && card.dataset.category !== filter;
    });
    
    // Ocultar completamente las tarjetas que no coinciden
    hiddenCards.forEach(card => {
      card.style.display = 'none';
      card.style.opacity = '0';
    });
    
    // Mostrar las tarjetas visibles
    visibleCards.forEach(card => {
      card.style.display = 'block';
    });
    
    // Si se muestra "all", resetear todos los estilos inline
    if (filter === 'all') {
      allCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
      });
    }
    
    // Animar entrada de las tarjetas visibles
    setTimeout(() => {
      const cardsToAnimate = filter === 'all' ? allCards : visibleCards;
      
      cardsToAnimate.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, index * 60);
      });
      
      // Limpiar estilos inline después de las animaciones para mejor rendimiento
      setTimeout(() => {
        if (filter === 'all') {
          allCards.forEach(card => {
            card.style.display = '';
            card.style.opacity = '';
            card.style.transform = '';
          });
        }
        isLoading = false;
      }, cardsToAnimate.length * 60 + 300);
      
    }, 150);
    
  }, allCards.length * 25 + 200);
}

// ===== CARGAR MÁS PROYECTOS =====
function initializeLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', handleLoadMore);
  }
}

function handleLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  if (isLoading || additionalProjects.length === 0) return;
  
  isLoading = true;
  loadMoreBtn.classList.add('loading');
  
  // Simular carga
  setTimeout(() => {
    addMoreProjects();
    loadMoreBtn.classList.remove('loading');
    isLoading = false;
    
    // Ocultar botón si no hay más proyectos
    if (additionalProjects.length === 0) {
      loadMoreBtn.style.display = 'none';
    }
  }, 1500);
}

function addMoreProjects() {
  const portfolioGrid = document.getElementById('portfolioGrid');
  const projectsToAdd = additionalProjects.splice(0, CONFIG.loadMoreItemsCount);
  
  projectsToAdd.forEach((project, index) => {
    const projectCard = createProjectCard(project);
    portfolioGrid.appendChild(projectCard);
    
    // Animar entrada
    setTimeout(() => {
      projectCard.style.opacity = '1';
      projectCard.style.transform = 'translateY(0)';
    }, index * CONFIG.animationDelay);
  });
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.category = project.category;
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  
  card.innerHTML = `
    <div class="card-image">
      <img src="${project.image}" alt="${project.title}" loading="lazy">
      <div class="card-overlay">
        <div class="overlay-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="card-buttons">
            <a href="${project.demoLink}" class="btn-demo">Ver Demo</a>
          </div>
        </div>
      </div>
    </div>
    <div class="card-info">
      <span class="card-category">${getCategoryDisplayName(project.category)}</span>
      <h4 class="card-title">${project.title}</h4>
      <div class="card-tags">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  
  return card;
}

function getCategoryDisplayName(category) {
  const categoryNames = {
    'landing': 'Landing Page',
    'portfolio': 'Portafolio',
    'ecommerce': 'E-commerce',
    'restaurant': 'Restaurante',
    'corporate': 'Corporativo',
    'creative': 'Creativo',
    'blog': 'Blog'
  };
  
  return categoryNames[category] || category;
}

// ===== ANIMACIONES Y EFECTOS =====
function initializeAnimations() {
  // Intersection Observer para animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observar elementos que necesitan animación
  const elementsToObserve = document.querySelectorAll('.project-card, .filter-btn, .hero-stats');
  elementsToObserve.forEach(el => observer.observe(el));
}

// ===== NAVEGACIÓN SUAVE =====
function initializeSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100; // Compensar header fijo
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== UTILIDADES Y HELPERS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===== MANEJO DE ERRORES Y FALLBACKS =====
window.addEventListener('error', (e) => {
  console.error('Error en Portfolio Gallery:', e.error);
  
  // Fallback: asegurar que el contenido sea visible
  document.body.classList.remove('loading');
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
});

// ===== EVENTS LISTENERS ADICIONALES =====
// Manejar cambios de tamaño de ventana
window.addEventListener('resize', debounce(() => {
  // Reajustar layout si es necesario
  console.log('Ventana redimensionada');
}, 250));

// Manejar visibilidad de la página
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pausar animaciones pesadas si la página no es visible
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});

// ===== FUNCIONES DE DEMOSTRACIÓN =====
// Estas funciones simulan la carga de contenido real
function simulateLoading() {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * 1000 + 500);
  });
}

function getRandomProjects(count = 6) {
  const shuffled = [...additionalProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ===== EXPORTAR PARA DEBUGGING =====
window.PortfolioGallery = {
  config: CONFIG,
  allProjects,
  visibleProjects,
  currentFilter,
  applyFilter,
  addMoreProjects,
  simulateLoading
};

console.log('📁 Portfolio Gallery JS cargado correctamente');
