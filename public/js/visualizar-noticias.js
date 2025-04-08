import { obtenerNoticias } from './noticias.js';

// Función para formatear la fecha
function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    try {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', opciones);
    } catch (error) {
        return fecha; // Si hay error, devolver la fecha original
    }
}

// Función para crear el HTML de una noticia
function crearNoticiaHTML(noticia) {
    return `
        <article class="noticia-card">
            <div class="noticia-imagen">
                <img src="images/noticias/${noticia.imagen}" alt="${noticia.titulo}">
            </div>
            <div class="noticia-contenido">
                <div class="noticia-meta">
                    <span class="fecha">${formatearFecha(noticia.fecha)}</span>
                    <span class="categoria">${noticia.categoria}</span>
                </div>
                <h2>${noticia.titulo}</h2>
                <p>${noticia.contenido.introduccion}</p>
                <a href="noticias/${noticia.titulo.toLowerCase().replace(/\s+/g, '-')}.html" class="btn-leer-mas">Leer más</a>
            </div>
        </article>
    `;
}

// Función para cargar las noticias en el contenedor
async function cargarNoticias() {
    try {
        const noticias = await obtenerNoticias();
        const contenedor = document.getElementById('noticias-container');
        
        if (contenedor) {
            contenedor.innerHTML = '<h1>Últimas Noticias</h1>';
            
            // Invertir el orden para mostrar las más recientes primero
            noticias.reverse().forEach(noticia => {
                contenedor.innerHTML += crearNoticiaHTML(noticia);
            });
        }
    } catch (error) {
        console.error("Error al cargar las noticias:", error);
    }
}

// Cargar las noticias cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarNoticias); 