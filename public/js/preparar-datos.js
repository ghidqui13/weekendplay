import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, deleteDoc, doc as firestoreDoc, orderBy, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function comprobarNoticiaExistente(titulo) {
    try {
        const noticiasRef = collection(db, "noticias");
        const q = query(noticiasRef, where("titulo", "==", titulo));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error al comprobar noticia existente:", error);
        return false;
    }
}

async function prepararDatos() {
    try {
        // Mostrar estado
        const estadoConexion = document.getElementById('estadoConexion');
        estadoConexion.innerHTML = "🔄 Obteniendo noticias de WeekendPlay...";
        
        console.log("Iniciando extracción de noticias...");
        
        // Usar un proxy CORS para obtener los datos
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent('https://www.weekendplay.es/noticias/');
        const response = await fetch(proxyUrl + targetUrl);
        const html = await response.text();
        
        console.log("HTML recibido:", html.substring(0, 500)); // Mostrar inicio del HTML
        
        // Crear un parser para el HTML
        const parser = new DOMParser();
        const docHTML = parser.parseFromString(html, 'text/html');
        
        // Obtener todas las noticias
        const noticias = [];
        
        // Intentar diferentes selectores
        const selectores = [
            'article',
            '.post',
            '.blog-post',
            '.noticia',
            '.entry'
        ];
        
        let articulos = null;
        for (const selector of selectores) {
            articulos = docHTML.querySelectorAll(selector);
            console.log(`Intentando selector '${selector}': ${articulos.length} artículos encontrados`);
            if (articulos.length > 0) break;
        }
        
        if (!articulos || articulos.length === 0) {
            console.log("No se encontraron artículos con ningún selector");
            console.log("Estructura del HTML:", docHTML.body.innerHTML);
            throw new Error("No se encontraron artículos en la página");
        }
        
        console.log(`Encontrados ${articulos.length} artículos`);
        
        // Procesar cada artículo y añadirlo a Firebase
        estadoConexion.innerHTML = "🔄 Procesando noticias...";
        for (const articulo of articulos) {
            try {
                // Obtener fecha y formatearla
                const fechaTexto = articulo.querySelector('.date, .fecha, time')?.textContent || '';
                const fecha = new Date(fechaTexto);
                const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Obtener categoría
                const categoria = articulo.querySelector('.category, .categoria, .tag')?.textContent || 'Novedades';
                
                // Obtener título
                const titulo = articulo.querySelector('h2, h1, .titulo')?.textContent || '';
                
                // Verificar que tenemos datos mínimos
                if (!titulo || !fechaTexto) {
                    console.log("Saltando artículo sin título o fecha");
                    continue;
                }
                
                // Comprobar si la noticia ya existe
                const existe = await comprobarNoticiaExistente(titulo);
                if (existe) {
                    console.log(`Noticia ya existe: ${titulo}`);
                    continue;
                }
                
                // Obtener introducción
                const introduccion = articulo.querySelector('.entry-content, .contenido, .resumen')?.textContent || '';
                
                // Obtener imagen
                const imagen = articulo.querySelector('img')?.src || '';
                
                // Obtener enlace
                const enlace = articulo.querySelector('a')?.href || '';
                
                // Crear objeto de noticia
                const noticia = {
                    fecha: fechaFormateada,
                    fechaOriginal: fechaTexto,
                    fechaTimestamp: fecha.getTime(),
                    categoria: categoria,
                    titulo: titulo,
                    imagen: imagen,
                    enlace: enlace,
                    contenido: {
                        introduccion: introduccion,
                        secciones: [{
                            titulo: "Contenido completo",
                            items: [introduccion]
                        }]
                    }
                };
                
                // Añadir a Firebase
                const docRef = await addDoc(collection(db, "noticias"), noticia);
                noticias.push(noticia);
                console.log(`Noticia añadida: ${titulo} (${fechaFormateada}) con ID: ${docRef.id}`);
            } catch (error) {
                console.error("Error al procesar un artículo:", error);
                continue;
            }
        }
        
        if (noticias.length === 0) {
            console.log("No se encontraron nuevas noticias para añadir");
            estadoConexion.innerHTML = "✅ No hay nuevas noticias para añadir";
            return;
        }
        
        // Ordenar noticias por fecha (más antiguas primero)
        noticias.sort((a, b) => a.fechaTimestamp - b.fechaTimestamp);
        
        // Crear contenido del archivo JSON
        const contenidoJson = {
            fechaGeneracion: new Date().toISOString(),
            totalNoticias: noticias.length,
            noticias: noticias
        };
        
        // Crear y descargar el archivo JSON
        estadoConexion.innerHTML = "🔄 Creando archivo de datos...";
        console.log("Creando archivo de datos...");
        
        const blob = new Blob([JSON.stringify(contenidoJson, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'datos-noticias.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Crear también un archivo de texto para lectura fácil
        let contenidoTxt = "DATOS DE NOTICIAS PARA BASE DE DATOS\n";
        contenidoTxt += "==================================\n";
        contenidoTxt += `Fecha de generación: ${new Date().toLocaleString('es-ES')}\n`;
        contenidoTxt += `Total de noticias: ${noticias.length}\n\n`;
        
        noticias.forEach((noticia, index) => {
            contenidoTxt += `\nNOTICIA ${index + 1}\n`;
            contenidoTxt += "----------------------------------------\n";
            contenidoTxt += `Título: ${noticia.titulo}\n`;
            contenidoTxt += `Fecha: ${noticia.fecha}\n`;
            contenidoTxt += `Fecha Original: ${noticia.fechaOriginal}\n`;
            contenidoTxt += `Categoría: ${noticia.categoria}\n`;
            contenidoTxt += `Imagen: ${noticia.imagen}\n`;
            contenidoTxt += `Enlace: ${noticia.enlace}\n`;
            contenidoTxt += "\nContenido:\n";
            contenidoTxt += `Introducción: ${noticia.contenido.introduccion}\n\n`;
            contenidoTxt += "----------------------------------------\n";
        });
        
        const blobTxt = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const urlTxt = window.URL.createObjectURL(blobTxt);
        const aTxt = document.createElement('a');
        aTxt.href = urlTxt;
        aTxt.download = 'datos-noticias.txt';
        document.body.appendChild(aTxt);
        aTxt.click();
        window.URL.revokeObjectURL(urlTxt);
        document.body.removeChild(aTxt);
        
        estadoConexion.innerHTML = `✅ Base de datos actualizada con ${noticias.length} nuevas noticias`;
        console.log("Base de datos actualizada correctamente");
    } catch (error) {
        console.error("Error al preparar los datos:", error);
        console.error("Stack trace:", error.stack);
        document.getElementById('estadoConexion').innerHTML = "❌ Error al actualizar los datos";
        alert("Error al actualizar los datos. Por favor, revisa la consola para más detalles.");
    }
}

// Ejecutar automáticamente cada 5 minutos
prepararDatos();
setInterval(prepararDatos, 5 * 60 * 1000); 