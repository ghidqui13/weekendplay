import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Noticias a agregar
const noticias = [
    {
        titulo: "Consejos útiles para tu primer streaming",
        fecha: "15 de marzo de 2024",
        categoria: "Streaming",
        contenido: {
            introduccion: "El streaming se ha convertido en una forma popular de compartir contenido y conectar con una audiencia.",
            secciones: [{ titulo: "Equipamiento básico necesario", items: ["Una buena conexión a internet", "Micrófono de calidad", "Webcam", "Software de streaming (OBS Studio)", "Luces para iluminar tu espacio"] }]
        },
        imagen: "streaming.svg"
    },
    {
        titulo: "¿Qué puede ofrecerte la nueva Play Station 5?",
        fecha: "20 de febrero de 2024",
        categoria: "Consolas",
        contenido: {
            introduccion: "La PlayStation 5 ha revolucionado el mundo de los videojuegos con sus características innovadoras y su potente hardware.",
            secciones: [{ titulo: "Características principales", items: ["Procesador AMD Zen 2 de 8 núcleos", "GPU AMD RDNA 2 personalizada", "SSD ultra rápido de 825GB", "DualSense con retroalimentación háptica", "Compatibilidad con 4K y 120fps"] }]
        },
        imagen: "ps5.svg"
    }
    // Agrega más noticias aquí si es necesario
];

// Función para convertir fecha de texto a objeto Timestamp de Firestore
function convertirFechaATimestamp(fechaTexto) {
    const meses = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
        'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    const partes = fechaTexto.split(' ');
    const dia = parseInt(partes[0]);
    const mes = meses[partes[2].toLowerCase()];
    const año = parseInt(partes[4]);

    console.log(`Fecha convertida: Año: ${año}, Mes: ${mes}, Día: ${dia}`);
    return new Timestamp(new Date(año, mes, dia).getTime() / 1000, 0);  // Firestore Timestamp
}

// Función para comprobar si una noticia ya existe en la base de datos
async function noticiaExiste(titulo) {
    const noticiasRef = collection(db, "noticias");
    const q = query(noticiasRef, where("titulo", "==", titulo));
    const querySnapshot = await getDocs(q);
    console.log(`Verificando si existe la noticia con título: ${titulo}`);
    return !querySnapshot.empty;
}

// Función para agregar noticias a Firebase evitando duplicados
async function agregarNoticias() {
    try {
        console.log("Iniciando agregarNoticias()...");
        const noticiasRef = collection(db, "noticias");
        
        for (const noticia of noticias) {
            if (!(await noticiaExiste(noticia.titulo))) {
                // Convertir la fecha a Timestamp
                noticia.fecha = convertirFechaATimestamp(noticia.fecha);

                const docRef = await addDoc(noticiasRef, noticia);
                console.log("Noticia agregada con ID:", docRef.id);
            } else {
                console.log("La noticia ya existe:", noticia.titulo);
            }
        }

        console.log("Proceso de agregación finalizado.");
    } catch (error) {
        console.error("Error al agregar las noticias:", error);
    }
}

// Función para obtener las noticias de Firebase
async function obtenerNoticias() {
    try {
        console.log("Obteniendo noticias de Firebase...");
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

// Función para mostrar las noticias en el DOM
async function mostrarNoticias() {
    console.log("Iniciando mostrarNoticias()");
    const noticiasContainer = document.querySelector('.noticias-grid');
    console.log("Contenedor de noticias:", noticiasContainer);

    if (!noticiasContainer) {
        console.error("No se encontró el contenedor de noticias");
        return;
    }

    try {
        // Obtener las noticias de Firebase
        const noticias = await obtenerNoticias();
        console.log("Datos de noticias:", noticias);
        
        if (noticias.length === 0) {
            console.log("No hay noticias disponibles");
            noticiasContainer.innerHTML = '<p class="no-noticias">No hay noticias disponibles en este momento.</p>';
            return;
        }

        const htmlNoticias = noticias.map(noticia => `
            <article class="noticia-card">
                <div class="noticia-imagen">
                    <img src="images/noticias/${noticia.imagen}" alt="${noticia.titulo}">
                </div>
                <div class="noticia-contenido">
                    <div class="noticia-meta">
                        <span class="fecha">${noticia.fecha}</span>
                        <span class="categoria">${noticia.categoria}</span>
                    </div>
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.contenido.introduccion}</p>
                    <a href="noticias/${noticia.id}.html" class="btn-leer-mas">Leer más</a>
                </div>
            </article>
        `).join('');

        console.log("HTML generado:", htmlNoticias);
        noticiasContainer.innerHTML = htmlNoticias;
        console.log("Noticias mostradas correctamente");
    } catch (error) {
        console.error("Error al mostrar las noticias:", error);
        noticiasContainer.innerHTML = '<p class="error-noticias">Error al cargar las noticias. Por favor, intenta más tarde.</p>';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, iniciando mostrarNoticias");
    mostrarNoticias();
});
