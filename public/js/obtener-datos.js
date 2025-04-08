import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Función para obtener todas las noticias de Firebase
async function obtenerTodasLasNoticias() {
    try {
        console.log("Obteniendo todas las noticias de Firebase...");
        const noticiasRef = collection(db, "noticias");
        const q = query(noticiasRef, orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        
        const noticias = [];
        querySnapshot.forEach((doc) => {
            noticias.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("Noticias obtenidas:", noticias);
        return noticias;
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        return [];
    }
}

// Función para mostrar los datos en el DOM
async function mostrarDatos() {
    const datosContainer = document.getElementById('datos-container');
    if (!datosContainer) {
        console.error("No se encontró el contenedor de datos");
        return;
    }

    try {
        const noticias = await obtenerTodasLasNoticias();
        
        if (noticias.length === 0) {
            datosContainer.innerHTML = '<p>No hay datos disponibles en la base de datos.</p>';
            return;
        }

        const htmlDatos = `
            <h2>Datos de la Base de Datos</h2>
            <div class="datos-section">
                <h3>Noticias (${noticias.length})</h3>
                ${noticias.map(noticia => `
                    <div class="dato-item">
                        <h4>ID: ${noticia.id}</h4>
                        <p><strong>Título:</strong> ${noticia.titulo}</p>
                        <p><strong>Fecha:</strong> ${noticia.fecha}</p>
                        <p><strong>Categoría:</strong> ${noticia.categoria}</p>
                        <p><strong>Imagen:</strong> ${noticia.imagen}</p>
                        <div class="contenido-detalle">
                            <p><strong>Introducción:</strong> ${noticia.contenido.introduccion}</p>
                            <div class="secciones">
                                ${noticia.contenido.secciones.map(seccion => `
                                    <div class="seccion">
                                        <h5>${seccion.titulo}</h5>
                                        <ul>
                                            ${seccion.items.map(item => `<li>${item}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        datosContainer.innerHTML = htmlDatos;
        console.log("Datos mostrados correctamente");
    } catch (error) {
        console.error("Error al mostrar los datos:", error);
        datosContainer.innerHTML = '<p class="error">Error al cargar los datos. Por favor, intenta más tarde.</p>';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, iniciando mostrarDatos");
    mostrarDatos();
}); 