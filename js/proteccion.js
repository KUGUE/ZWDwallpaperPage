// Protección anti-inspección y anti-copia
// Este archivo contiene múltiples capas de protección para el código fuente

(function() {
    'use strict';
    
    // Deshabilitar menú contextual (click derecho)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar teclas de desarrollador
    document.addEventListener('keydown', function(e) {
        // F12 (DevTools)
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Selector de elementos)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Consola)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (Ver código fuente)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Guardar página)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+A (Seleccionar todo)
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P (Imprimir)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }
        // Ctrl+C (Copiar)
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+V (Pegar)
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
            return false;
        }
        // Ctrl+X (Cortar)
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            return false;
        }
    });

    // Detectar DevTools abierto
    let devtools = {
        open: false,
        orientation: null
    };

    function detectDevTools() {
        if (window.outerHeight - window.innerHeight > 100 || 
            window.outerWidth - window.innerWidth > 100) {
            if (!devtools.open) {
                devtools.open = true;
                showDevToolsWarning();
            }
        } else {
            devtools.open = false;
        }
    }

    function showDevToolsWarning() {
        alert('⚠️ Por razones de seguridad, las herramientas de desarrollador están deshabilitadas en este sitio.');
        // Redirigir o cerrar la ventana
        try {
            window.close();
        } catch(e) {
            window.location.href = 'about:blank';
        }
    }

    // Verificar DevTools cada 500ms
    setInterval(detectDevTools, 500);

    // Detectar debugger
    function detectDebugger() {
        try {
            setInterval(function() {
                debugger;
            }, 100);
        } catch(e) {}
    }

    // Limpiar consola y añadir warnings
    function clearConsole() {
        if (typeof console.clear === 'function') {
            console.clear();
        }
        
        const style = 'color: red; font-size: 20px; font-weight: bold;';
        console.log('%c🛑 ACCESO DENEGADO', style);
        console.log('%cEste sitio web está protegido contra inspección de código.', 'color: orange; font-size: 14px;');
        console.log('%cTodo intento de acceso no autorizado será registrado.', 'color: orange; font-size: 14px;');
        
        // Ofuscar la consola
        ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 
         'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'].forEach(function(method) {
            if (typeof console[method] === 'function') {
                console[method] = function() {
                    return '🚫 Función deshabilitada por seguridad';
                };
            }
        });
    }

    // Deshabilitar selección de texto (excepto en inputs)
    function disableTextSelection() {
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });

        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    }

    // Deshabilitar arrastrar imágenes
    function disableImageDrag() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        });
    }

    // Detectar herramientas de screenshot
    function detectScreenshotTools() {
        // Detectar extensiones comunes de screenshot
        if (typeof window.html2canvas !== 'undefined' || 
            typeof window.domtoimage !== 'undefined') {
            console.warn('⚠️ Herramienta de captura detectada');
        }
    }

    // Ofuscar URLs y recursos
    function obfuscateResources() {
        // Añadir parámetros aleatorios a los recursos para dificultar el cacheo
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');
        
        links.forEach(function(link) {
            if (link.href && !link.href.includes('?v=')) {
                link.href += '?v=' + Math.random().toString(36).substring(7);
            }
        });
        
        scripts.forEach(function(script) {
            if (script.src && !script.src.includes('?v=')) {
                script.src += '?v=' + Math.random().toString(36).substring(7);
            }
        });
    }

    // Prevenir print screen (limitado)
    function preventPrintScreen() {
        document.addEventListener('keyup', function(e) {
            if (e.keyCode === 44) { // Print Screen
                console.warn('⚠️ Captura de pantalla detectada');
            }
        });
    }

    // Detectar cambios en la URL
    function detectURLChanges() {
        let currentURL = window.location.href;
        setInterval(function() {
            if (window.location.href !== currentURL) {
                currentURL = window.location.href;
                // Re-aplicar protecciones si es necesario
                initProtections();
            }
        }, 1000);
    }

    // Función principal de inicialización
    function initProtections() {
        clearConsole();
        disableTextSelection();
        disableImageDrag();
        detectScreenshotTools();
        preventPrintScreen();
        detectDebugger();
        
        // Retraso para la ofuscación de recursos
        setTimeout(obfuscateResources, 1000);
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtections);
    } else {
        initProtections();
    }

    // Re-ejecutar periódicamente
    setInterval(function() {
        clearConsole();
        disableImageDrag();
    }, 5000);

    // Detectar cambios en la URL
    detectURLChanges();

    // Mensaje final en consola
    setTimeout(function() {
        console.clear();
        console.log('%c🔒 SISTEMA DE PROTECCIÓN ACTIVO', 'color: red; font-size: 18px; font-weight: bold; background: yellow; padding: 10px;');
    }, 2000);

})();
