import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function comprobarDatosFirebase() {
    try {
        console.log("Iniciando comprobación de datos de Firebase...");
        
        // Verificar que db está definido
        if (!db) {
            throw new Error("La conexión con Firebase no está inicializada");
        }
        
        console.log("Conexión con Firebase verificada, intentando obtener la colección 'noticias'...");
        
        // Obtener todas las noticias
        const noticiasRef = collection(db, "noticias");
        console.log("Referencia a la colección 'noticias' obtenida");
        
        const noticiasQuery = query(noticiasRef, orderBy("fecha", "desc"));
        console.log("Query creada, ejecutando getDocs...");
        
        const noticiasSnapshot = await getDocs(noticiasQuery);
        console.log(`Query ejecutada. Número de documentos encontrados: ${noticiasSnapshot.size}`);
        
        let contenidoTxt = "COMPROBACIÓN DE DATOS DE FIREBASE\n";
        contenidoTxt += "==================================\n";
        contenidoTxt += `Fecha y hora de comprobación: ${new Date().toLocaleString('es-ES')}\n`;
        contenidoTxt += `Total de documentos encontrados: ${noticiasSnapshot.size}\n\n`;
        
        if (noticiasSnapshot.empty) {
            contenidoTxt += "¡ADVERTENCIA! No se encontraron documentos en la colección 'noticias'\n";
            console.log("No se encontraron documentos en la colección 'noticias'");
        } else {
            noticiasSnapshot.forEach((doc) => {
                console.log(`Procesando documento con ID: ${doc.id}`);
                const noticia = doc.data();
                console.log("Datos del documento:", noticia);
                
                contenidoTxt += `\nDOCUMENTO ID: ${doc.id}\n`;
                contenidoTxt += "----------------------------------------\n";
                contenidoTxt += `Título: ${noticia.titulo}\n`;
                contenidoTxt += `Fecha: ${noticia.fecha.toDate ? noticia.fecha.toDate().toLocaleString('es-ES') : noticia.fecha}\n`;
                contenidoTxt += `Categoría: ${noticia.categoria}\n`;
                contenidoTxt += `Imagen: ${noticia.imagen}\n`;
                contenidoTxt += "\nContenido:\n";
                contenidoTxt += `Introducción: ${noticia.contenido.introduccion}\n\n`;
                
                contenidoTxt += "Secciones:\n";
                noticia.contenido.secciones.forEach((seccion, index) => {
                    contenidoTxt += `${index + 1}. ${seccion.titulo}\n`;
                    seccion.items.forEach((item, itemIndex) => {
                        contenidoTxt += `   ${itemIndex + 1}. ${item}\n`;
                    });
                    contenidoTxt += "\n";
                });
                
                contenidoTxt += "----------------------------------------\n";
            });
        }
        
        // Crear y descargar el archivo
        console.log("Creando archivo de texto...");
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comprobacion-datos-firebase.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Mostrar mensaje de éxito
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = "Archivo generado correctamente";
        statusDiv.className = "success";
        
        console.log("Comprobación completada. Archivo descargado.");
    } catch (error) {
        console.error("Error detallado al comprobar los datos:", error);
        console.error("Stack trace:", error.stack);
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.className = "error";
        alert(`Error al comprobar los datos: ${error.message}\nPor favor, revisa la consola para más detalles.`);
    }
}

// Asegurarse de que el DOM esté cargado antes de agregar el event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, buscando botón...");
    const boton = document.getElementById('comprobarDatos');
    if (boton) {
        boton.addEventListener('click', comprobarDatosFirebase);
        console.log("Event listener agregado al botón");
    } else {
        console.error("No se encontró el botón 'comprobarDatos'");
    }
}); 