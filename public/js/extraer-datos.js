import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function extraerDatos() {
    try {
        // Mostrar estado de conexión
        const estadoConexion = document.getElementById('estadoConexion');
        estadoConexion.innerHTML = "🔄 Obteniendo noticias de WeekendPlay...";
        
        console.log("Iniciando extracción de noticias...");
        
        // Obtener datos de la web
        const response = await fetch('https://www.weekendplay.es/noticias/');
        const html = await response.text();
        
        // Crear un parser para el HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Obtener todas las noticias
        const noticias = [];
        const articulos = doc.querySelectorAll('article');
        
        console.log(`Encontrados ${articulos.length} artículos`);
        
        // Primero, eliminar todas las noticias existentes
        const noticiasRef = collection(db, "noticias");
        const noticiasSnapshot = await getDocs(noticiasRef);
        for (const doc of noticiasSnapshot.docs) {
            await deleteDoc(doc.ref);
        }
        console.log("Noticias existentes eliminadas");
        
        // Procesar cada artículo
        for (const articulo of articulos) {
            const fecha = articulo.querySelector('.date')?.textContent || '';
            const categoria = articulo.querySelector('.category')?.textContent || '';
            const titulo = articulo.querySelector('h2')?.textContent || '';
            const introduccion = articulo.querySelector('.entry-content')?.textContent || '';
            
            // Crear objeto de noticia
            const noticia = {
                fecha: new Date(fecha),
                categoria,
                titulo,
                imagen: articulo.querySelector('img')?.src || '',
                contenido: {
                    introduccion,
                    secciones: [{
                        titulo: "Contenido completo",
                        items: [introduccion]
                    }]
                }
            };
            
            // Añadir a Firebase
            await addDoc(collection(db, "noticias"), noticia);
            console.log(`Noticia añadida: ${titulo}`);
            noticias.push(noticia);
        }
        
        // Crear contenido del archivo de respaldo
        let contenidoTxt = "NOTICIAS DE WEEKENDPLAY\n";
        contenidoTxt += "======================\n";
        contenidoTxt += `Fecha de extracción: ${new Date().toLocaleString('es-ES')}\n`;
        contenidoTxt += `Total de noticias: ${noticias.length}\n\n`;
        
        noticias.forEach((noticia, index) => {
            contenidoTxt += `\nNOTICIA ${index + 1}\n`;
            contenidoTxt += "----------------------------------------\n";
            contenidoTxt += `Título: ${noticia.titulo}\n`;
            contenidoTxt += `Fecha: ${noticia.fecha}\n`;
            contenidoTxt += `Categoría: ${noticia.categoria}\n`;
            contenidoTxt += "\nContenido:\n";
            contenidoTxt += `Introducción: ${noticia.contenido.introduccion}\n\n`;
            contenidoTxt += "----------------------------------------\n";
        });
        
        // Crear y descargar el archivo de respaldo
        estadoConexion.innerHTML = "🔄 Creando archivo de respaldo...";
        console.log("Creando archivo de respaldo...");
        
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'noticias-weekendplay.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        estadoConexion.innerHTML = `✅ Base de datos actualizada con ${noticias.length} noticias`;
        console.log("Base de datos actualizada correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        console.error("Stack trace:", error.stack);
        document.getElementById('estadoConexion').innerHTML = "❌ Error al actualizar la base de datos";
        alert("Error al actualizar los datos. Por favor, revisa la consola para más detalles.");
    }
}

// Ejecutar cuando se haga clic en el botón

