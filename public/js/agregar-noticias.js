import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBwQJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4QJ4Q",
    authDomain: "weekendplay-12345.firebaseapp.com",
    projectId: "weekendplay-12345",
    storageBucket: "weekendplay-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890123456789012"
};

// Inicializar Firebase con manejo de errores
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase inicializado correctamente");
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
    // Mostrar mensaje de error al usuario
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff4444; color: white; padding: 15px; border-radius: 5px; z-index: 1000;';
    errorDiv.textContent = 'Error al conectar con la base de datos. Por favor, verifica tu conexión a internet.';
    document.body.appendChild(errorDiv);
}

// Datos de las noticias
const noticias = [
    {
        "titulo": "Consejos útiles para tu primer streaming",
        "fecha": "3 de enero de 2023",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "Nadie comienza a ser streamer experto cuando se adentra en este universo, pero sí que hay algunas claves importantes a tener en cuenta para empezar...",
            "secciones": [{
                titulo: "Contenido",
                items: ["Nadie comienza a ser streamer experto cuando se adentra en este universo, pero sí que hay algunas claves importantes a tener en cuenta para empezar..."]
            }]
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "¿Qué puede ofrecerte la nueva Play Station 5?",
        "fecha": "16 de noviembre de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan...",
            "secciones": [{
                titulo: "Contenido",
                items: ["No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan..."]
            }]
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "League of Legends, el videojuego competitivo por excelencia",
        "fecha": "18 de septiembre de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "El fenómeno de los esports sigue creciendo y League of Legends se mantiene como uno de los juegos más populares en la escena competitiva...",
            "secciones": [{
                titulo: "Contenido",
                items: ["El fenómeno de los esports sigue creciendo y League of Legends se mantiene como uno de los juegos más populares en la escena competitiva..."]
            }]
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "¿Pueden los videojuegos usarse como una herramienta educativa?",
        "fecha": "10 de julio de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "La gamificación en la educación está demostrando ser una herramienta muy efectiva para el aprendizaje...",
            "secciones": [{
                titulo: "Contenido",
                items: ["La gamificación en la educación está demostrando ser una herramienta muy efectiva para el aprendizaje..."]
            }]
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Los videojuegos en eventos corporativos",
        "fecha": "12 de mayo de 2022",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Buen uso de los videojuegos en casa",
        "fecha": "15 de marzo de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Los canales de Twitch más vistos de España",
        "fecha": "9 de febrero de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Los mejores videojuegos de 2021",
        "fecha": "3 de enero de 2022",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Curiosidades que no sabías de la realidad virtual",
        "fecha": "10 de diciembre de 2021",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
    {
        "titulo": "Sin entradas para Ficzone, Granada Gaming y Meeple Factory",
        "fecha": "22 de noviembre de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Montaje de truss para eventos",
        "fecha": "7 de octubre de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "La Feria del Libro en streaming",
        "fecha": "15 de septiembre de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Ocho claves del marketing esports",
        "fecha": "16 de agosto de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "League of Legends de Pokémon",
        "fecha": "19 de julio de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "España se une a la familia de World Esports",
        "fecha": "1 de julio de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Producciones audiovisuales en torneos",
        "fecha": "29 de junio de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "El éxito del Circuito Tormenta",
        "fecha": "21 de junio de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Competiciones amateur Esports",
        "fecha": "26 de abril de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Somos más fuertes",
        "fecha": "19 de abril de 2021",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Eventos seguros",
        "fecha": "12 de abril de 2021",
        "categoria": "Eventos",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    },
        {
        "titulo": "Cambios que son necesarios",
        "fecha": "5 de abril de 2021",
        "categoria": "Novedades",
        "contenido": {
            "introduccion": "No debemos demonizar los videojuegos, hay muchos mitos alrededor de ellos que hacen que parezcan solo perjudiciales para la salud de quienes los usan…",
            "secciones": []
        },
        "imagen": "default.svg"
    }
    
];

// Enlaces predefinidos para las noticias
const enlacesNoticias = {
    "Competiciones amateur Esports": "https://www.weekendplay.es/noticias/competiciones-amateur-esports/",
    "No debemos demonizar los videojuegos": "https://www.weekendplay.es/noticias/no-debemos-demonizar-los-videojuegos/",
    "Consejos útiles para tu primer streaming": "https://www.weekendplay.es/noticias/consejos-utiles-para-tu-primer-streaming/",
    "¿Qué puede ofrecerte la nueva Play Station 5?": "https://www.weekendplay.es/noticias/que-puede-ofrecerte-la-nueva-play-station-5/",
    "League of Legends, el videojuego competitivo por excelencia": "https://www.weekendplay.es/noticias/league-of-legends-el-videojuego-competitivo-por-excelencia/",
    "¿Pueden los videojuegos usarse como una herramienta educativa?": "https://www.weekendplay.es/noticias/pueden-los-videojuegos-usarse-como-una-herramienta-educativa/",
    "Los videojuegos en eventos corporativos": "https://www.weekendplay.es/noticias/los-videojuegos-en-eventos-corporativos/",
    "Buen uso de los videojuegos en casa": "https://www.weekendplay.es/noticias/buen-uso-de-los-videojuegos-en-casa/",
    "Los canales de Twitch más vistos de España": "https://www.weekendplay.es/noticias/los-canales-de-twitch-mas-vistos-de-espana/",
    "Los mejores videojuegos de 2021": "https://www.weekendplay.es/noticias/los-mejores-videojuegos-de-2021/",
    "Curiosidades que no sabías de la realidad virtual": "https://www.weekendplay.es/noticias/curiosidades-que-no-sabias-de-la-realidad-virtual/",
    "Sin entradas para Ficzone, Granada Gaming y Meeple Factory": "https://www.weekendplay.es/noticias/sin-entradas-para-ficzone-granada-gaming-y-meeple-factory/",
    "Montaje de truss para eventos": "https://www.weekendplay.es/noticias/montaje-de-truss-para-eventos/",
    "La Feria del Libro en streaming": "https://www.weekendplay.es/noticias/la-feria-del-libro-en-streaming/",
    "Ocho claves del marketing esports": "https://www.weekendplay.es/noticias/ocho-claves-del-marketing-esports/",
    "League of Legends de Pokémon": "https://www.weekendplay.es/noticias/league-of-legends-de-pokemon/",
    "España se une a la familia de World Esports": "https://www.weekendplay.es/noticias/espana-se-une-a-la-familia-de-world-esports/",
    "Producciones audiovisuales en torneos": "https://www.weekendplay.es/noticias/producciones-audiovisuales-en-torneos/",
    "El éxito del Circuito Tormenta": "https://www.weekendplay.es/noticias/el-exito-del-circuito-tormenta/",
    "Somos más fuertes": "https://www.weekendplay.es/noticias/somos-mas-fuertes/",
    "Eventos seguros": "https://www.weekendplay.es/noticias/eventos-seguros/",
    "Cambios que son necesarios": "https://www.weekendplay.es/noticias/cambios-que-son-necesarios/"
};

const meses = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
};

function parsearFechaTexto(fechaTexto) {
    // Ejemplo: "02 de abril de 2022"
    const partes = fechaTexto.toLowerCase().split(" de ");
    const dia = parseInt(partes[0]);
    const mes = meses[partes[1]];
    const anio = parseInt(partes[2]);

    return new Date(anio, mes, dia); // JS: mes empieza desde 0
}

async function buscarEnlaceNoticia(titulo) {
    try {
        // Primero buscar en los enlaces predefinidos
        const tituloLimpio = titulo.trim();
        
        // Buscar coincidencia exacta
        if (enlacesNoticias[tituloLimpio]) {
            console.log(`Enlace encontrado en lista predefinida para: ${tituloLimpio}`);
            return enlacesNoticias[tituloLimpio];
        }
        
        // Buscar coincidencia parcial
        for (const [key, value] of Object.entries(enlacesNoticias)) {
            if (tituloLimpio.toLowerCase().includes(key.toLowerCase()) || 
                key.toLowerCase().includes(tituloLimpio.toLowerCase())) {
                console.log(`Enlace encontrado por coincidencia parcial para: ${tituloLimpio}`);
                return value;
            }
        }

        // Si no está en los predefinidos, buscar en la web
        console.log(`Buscando enlace en la web para: ${tituloLimpio}`);
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent('https://www.weekendplay.es/noticias/');
        const response = await fetch(proxyUrl + targetUrl);
        const html = await response.text();
        
        const parser = new DOMParser();
        const docHTML = parser.parseFromString(html, 'text/html');
        
        // Buscar todos los enlaces y títulos
        const articulos = docHTML.querySelectorAll('article, .post, .blog-post, .noticia, .entry');
        
        for (const articulo of articulos) {
            const tituloArticulo = articulo.querySelector('h2, h1, .titulo')?.textContent?.trim() || '';
            if (tituloArticulo.toLowerCase().includes(tituloLimpio.toLowerCase()) || 
                tituloLimpio.toLowerCase().includes(tituloArticulo.toLowerCase())) {
                const enlace = articulo.querySelector('a')?.href || '';
                if (enlace) {
                    console.log(`Enlace encontrado en la web para: ${tituloLimpio}`);
                    return enlace;
                }
            }
        }
        console.log(`No se encontró enlace para: ${tituloLimpio}`);
        return "#"; // Si no se encuentra enlace
    } catch (error) {
        console.error("Error al buscar enlace para noticia:", error);
        return "#";
    }
}

async function borrarColeccionNoticias() {
    try {
        console.log("Borrando colección de noticias existente...");
        const noticiasRef = collection(db, "noticias");
        const snapshot = await getDocs(noticiasRef);
        
        const promesasBorrado = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(promesasBorrado);
        
        console.log("Colección de noticias borrada exitosamente");
        return true;
    } catch (error) {
        console.error("Error al borrar la colección:", error);
        return false;
    }
}

async function verificarColeccionNoticias() {
    try {
        console.log("Verificando colección de noticias...");
        
        // Primero borrar la colección existente
        await borrarColeccionNoticias();
        
        console.log("Creando nueva colección con datos actualizados...");
        const noticiasRef = collection(db, "noticias");

        // Preparar las noticias con enlaces y timestamps
        const noticiasPreparadas = noticias.map(noticia => {
            const fechaObjeto = parsearFechaTexto(noticia.fecha);
            const fechaTimestamp = fechaObjeto.getTime();
            
            // Buscar enlace en la lista predefinida
            let enlace = enlacesNoticias[noticia.titulo] || "#";
            
            // Si no se encuentra, intentar buscar por coincidencia parcial
            if (enlace === "#") {
                for (const [key, value] of Object.entries(enlacesNoticias)) {
                    if (noticia.titulo.toLowerCase().includes(key.toLowerCase()) || 
                        key.toLowerCase().includes(noticia.titulo.toLowerCase())) {
                        enlace = value;
                        break;
                    }
                }
            }

            return {
                ...noticia,
                fechaTimestamp,
                enlace
            };
        });

        // Ordenar por fecha antes de subir
        noticiasPreparadas.sort((a, b) => b.fechaTimestamp - a.fechaTimestamp);

        console.log("\nAñadiendo noticias ordenadas:");
        let contador = 1;
        for (const noticia of noticiasPreparadas) {
            try {
                await addDoc(noticiasRef, noticia);
                console.log(`${contador++}. ${noticia.fecha}: ${noticia.titulo} - Enlace: ${noticia.enlace}`);
            } catch (error) {
                console.error(`Error al añadir noticia ${noticia.titulo}:`, error);
            }
        }

        console.log("\nColección 'noticias' actualizada exitosamente.");
        
        // Verificar que las noticias se guardaron correctamente
        const q = query(noticiasRef, orderBy("fechaTimestamp", "desc"));
        const snapshotFinal = await getDocs(q);
        console.log("\nNoticias en la base de datos (verificación final):");
        contador = 1;
        snapshotFinal.forEach(doc => {
            const noticia = doc.data();
            console.log(`${contador++}. ${noticia.fecha}: ${noticia.titulo} - Enlace: ${noticia.enlace}`);
        });

    } catch (error) {
        console.error("Error al verificar/crear la colección:", error);
    }
}

async function comprobarNoticiaExistente(titulo) {
    try {
        const q = query(collection(db, "noticias"), where("titulo", "==", titulo));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error al comprobar noticia existente:", error);
        return false;
    }
}

async function actualizarNoticias() {
    if (!db) {
        console.error("Firebase no está inicializado");
        return;
    }

    try {
        console.log("Iniciando actualización de noticias...");
        
        // Obtener referencia a la colección
        const noticiasRef = collection(db, "noticias");
        
        // Borrar noticias existentes
        const snapshot = await getDocs(noticiasRef);
        const promesasBorrado = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(promesasBorrado);
        
        console.log("Noticias anteriores eliminadas");
        
        // Agregar nuevas noticias
        for (const noticia of noticias) {
            try {
                await addDoc(noticiasRef, noticia);
                console.log(`Noticia agregada: ${noticia.titulo}`);
            } catch (error) {
                console.error(`Error al agregar noticia ${noticia.titulo}:`, error);
            }
        }
        
        console.log("Actualización de noticias completada");
        
    } catch (error) {
        console.error("Error en actualizarNoticias:", error);
        // Mostrar mensaje de error al usuario
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ff4444; color: white; padding: 15px; border-radius: 5px; z-index: 1000;';
        errorDiv.textContent = 'Error al actualizar las noticias. Por favor, intenta recargar la página.';
        document.body.appendChild(errorDiv);
    }
}

// Ejecutar la actualización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página cargada, iniciando actualización de noticias...");
    actualizarNoticias();
}); 