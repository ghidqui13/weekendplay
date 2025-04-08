import { agregarNoticias } from './noticias.js';

// Función para inicializar las noticias
async function inicializarNoticias() {
    try {
        await agregarNoticias();
        console.log("Inicialización de noticias completada");
    } catch (error) {
        console.error("Error al inicializar las noticias:", error);
    }
}

// Ejecutar la inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarNoticias); 