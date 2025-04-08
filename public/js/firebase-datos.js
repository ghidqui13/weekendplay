import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Función para obtener todas las colecciones de la base de datos
async function obtenerTodasLasColecciones() {
    try {
        console.log("Obteniendo todas las colecciones de Firebase...");
        
        // Obtener la colección de noticias
        const noticiasRef = collection(db, "noticias");
        const noticiasQuery = query(noticiasRef, orderBy("fecha", "desc"));
        const noticiasSnapshot = await getDocs(noticiasQuery);
        
        const noticias = [];
        noticiasSnapshot.forEach((doc) => {
            noticias.push({ id: doc.id, ...doc.data() });
        });

        // Aquí puedes agregar más colecciones según necesites
        // Por ejemplo: usuarios, servicios, etc.
        
        return {
            noticias: noticias
        };
    } catch (error) {
        console.error("Error al obtener las colecciones:", error);
        return {};
    }
}

// Función para mostrar los datos en el DOM
async function mostrarDatosFirebase() {
    const datosContainer = document.getElementById('datos-container');
    if (!datosContainer) {
        console.error("No se encontró el contenedor de datos");
        return;
    }

    try {
        const datos = await obtenerTodasLasColecciones();
        
        if (!datos.noticias || datos.noticias.length === 0) {
            datosContainer.innerHTML = '<p>No hay datos disponibles en la base de datos.</p>';
            return;
        }

        const htmlDatos = `
            <h2>Datos de Firebase</h2>
            <div class="datos-section">
                <h3>Noticias (${datos.noticias.length})</h3>
                ${datos.noticias.map(noticia => `
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
        console.log("Datos de Firebase mostrados correctamente");
    } catch (error) {
        console.error("Error al mostrar los datos:", error);
        datosContainer.innerHTML = '<p class="error">Error al cargar los datos. Por favor, intenta más tarde.</p>';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, iniciando mostrarDatosFirebase");
    mostrarDatosFirebase();
}); 