// ===== MODAL DE CONTACTO ELEGANTE =====

// Función para mostrar modal de contacto elegante
function showContactAlert() {
  console.log('showContactAlert llamada'); // Debug
  
  const modal = document.getElementById('contactModal');
  
  if (!modal) {
    console.error('Modal no encontrado');
    alert('⚠️ ¡Importante!\n\nDebes contactarte antes de pagar para quedar los términos de cómo se elaborará el sitio o servicio que necesitas.\n\n📧 Email: martin-kugue@hotmail.com\n📱 WhatsApp: +52 612 168 1994');
    return;
  }
  
  // Mostrar el modal
  modal.classList.add('show');
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
  
  // Añadir listener para ESC
  document.addEventListener('keydown', handleEscapeKey);
  
  console.log('Modal mostrado correctamente'); // Debug
}

// Función para cerrar modal
function closeContactModal() {
  console.log('closeContactModal llamada'); // Debug
  const modal = document.getElementById('contactModal');
  
  if (!modal) {
    console.error('Modal no encontrado para cerrar');
    return;
  }
  
  modal.classList.remove('show');
  
  // Restaurar scroll del body
  document.body.style.overflow = '';
  
  // Remover listener del ESC
  document.removeEventListener('keydown', handleEscapeKey);
}

// Función para manejar tecla ESC
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeContactModal();
  }
}

// Inicialización del modal
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, inicializando modal'); // Debug
  const modal = document.getElementById('contactModal');
  
  if (!modal) {
    console.error('Modal no encontrado en DOMContentLoaded');
    return;
  }
  
  const overlay = modal.querySelector('.modal-overlay');
  
  if (overlay) {
    overlay.addEventListener('click', closeContactModal);
    console.log('Event listener del overlay añadido'); // Debug
  } else {
    console.error('Overlay no encontrado');
  }
  
  console.log('Modal inicializado correctamente');
});

// Función de test global
window.testModal = function() {
  console.log('Test modal llamado');
  showContactAlert();
};
