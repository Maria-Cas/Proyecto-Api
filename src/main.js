import './style.css'

// API Key para acceder a The Dog API
const API_KEY = 'live_ObhKAQTiehStNYDlSLfGYeA4E31qnpEPZmEks4TgPD6IgdiyCs6MQCO1AIEZjQ02';

// Elementos del DOM
const paginaPrincipal = document.getElementById('paginaPrincipal');
const galeriaPerros = document.getElementById('galeriaPerros');
const contenedorGaleria = document.getElementById('contenedorGaleria');

// Variables para el buscador
let searchInput;
let clearSearch;
let todasLasTarjetas = [];

// Inicializar elementos del buscador
function inicializarBuscador() {
    searchInput = document.getElementById('searchInput');
    clearSearch = document.getElementById('clearSearch');

    if (searchInput && clearSearch) {
        // Event listener para el input de búsqueda
        searchInput.addEventListener('input', (e) => {
            filtrarTarjetas(e.target.value);
        });

        // Event listener para el botón de limpiar búsqueda
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            filtrarTarjetas('');
        });
    }
}

/*
 * Función principal que obtiene y muestra una imagen aleatoria de perro
 * Realiza una petición a la API y maneja la visualización de todos los datos
 */
async function obtenerImagenPerro() {
    try {
        // Obtenemos referencias a los elementos del DOM
        const imagen = document.getElementById('dogImage');
        const edadInfo = document.getElementById('edadInfo');
        const origenInfo = document.getElementById('origenInfo');
        const detallesInfo = document.getElementById('detallesInfo');
        const breedName = document.getElementById('breedName');
        const contenedorImagenes = document.getElementById('additionalImages');

        // Verificar si los elementos existen
        if (!imagen || !edadInfo || !origenInfo || !detallesInfo || !breedName || !contenedorImagenes) {
            console.error('No se encontraron todos los elementos necesarios en el DOM');
            return;
        }

        // Limpiar las imágenes adicionales y mostrar mensaje de carga
        contenedorImagenes.innerHTML = '<p class="text-center">Cargando...</p>';

        // Realizamos la petición a la API
        const respuesta = await fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1', {
            headers: {
                'x-api-key': API_KEY
            }
        });
        const [data] = await respuesta.json();
        
        console.log('Datos recibidos de la API:', data);
        
        // Mostramos la imagen
        imagen.src = data.url;
        imagen.style.display = 'block';

        // Si la imagen tiene información de raza, mostramos todos los detalles
        if (data.breeds && data.breeds.length > 0) {
            const raza = data.breeds[0];
            console.log('Información de la raza:', raza);

            // Mostrar el nombre de la raza
            breedName.textContent = raza.name;

            // Calcular y mostrar la edad media
            const edadMedia = calcularEdadMedia(raza);
            if (edadMedia) {
                edadInfo.textContent = `Raza: ${raza.name} - Edad media: ${edadMedia.toFixed(1)} años`;
                edadInfo.style.display = 'block';
            }

            // Mostrar origen
            if (raza.origin || raza.country_code) {
                const origen = raza.origin || `País: ${raza.country_code}`;
                origenInfo.textContent = `Origen: ${origen}`;
                origenInfo.style.display = 'block';
            } else {
                origenInfo.textContent = 'Origen: No disponible';
                origenInfo.style.display = 'block';
            }

            // Mostrar detalles adicionales
            const detalles = [];
            if (raza.temperament) detalles.push(`🦮 Temperamento: ${raza.temperament}`);
            if (raza.weight?.metric) detalles.push(`⚖️ Peso: ${raza.weight.metric} kg`);
            if (raza.height?.metric) detalles.push(`📏 Altura: ${raza.height.metric} cm`);
            if (raza.bred_for) detalles.push(`🎯 Criado para: ${raza.bred_for}`);
            if (raza.breed_group) detalles.push(`👥 Grupo: ${raza.breed_group}`);

            if (detalles.length > 0) {
                detallesInfo.innerHTML = detalles.join('<br>');
                detallesInfo.style.display = 'block';
            }

            // Obtener y mostrar imágenes adicionales
            console.log('Obteniendo imágenes adicionales para la raza principal:', raza.name, 'ID:', raza.id);
            if (raza.id) {
                const imagenesAdicionales = await obtenerImagenesAdicionales(raza.id);
                mostrarImagenesAdicionales(imagenesAdicionales, data.url);
            } else {
                contenedorImagenes.innerHTML = '<p class="text-center text-muted">No se pueden obtener imágenes adicionales</p>';
            }
        } else {
            console.log('La imagen no tiene información de raza');
            edadInfo.style.display = 'none';
            origenInfo.style.display = 'none';
            detallesInfo.style.display = 'none';
            breedName.textContent = 'Raza no disponible';
            contenedorImagenes.innerHTML = '<p class="text-center text-muted">No hay información de raza disponible</p>';
        }
    } catch (error) {
        console.error('Error detallado:', error);
        const contenedorImagenes = document.getElementById('additionalImages');
        if (contenedorImagenes) {
            contenedorImagenes.innerHTML = '<p class="text-center text-danger">Error al cargar las imágenes adicionales</p>';
        }
        alert('¡Ups! Hubo un error al obtener la información del perro. Por favor, intenta de nuevo.');
    }
}

/*
 * Calcula la edad media de una raza
 * Recibe: objeto breed con la información de la raza
 * Devuelve: número con la edad media o null si no hay datos
 */
function calcularEdadMedia(breed) {
    if (breed.life_span) {
        const edades = breed.life_span.split('-').map(num => parseInt(num.trim()));
        return edades.reduce((a, b) => a + b, 0) / edades.length;
    }
    return null;
}

/*
 * Muestra la información de la raza y su edad media en la interfaz
 * Recibe: 
 * - nombreRaza: string con el nombre de la raza
 * - edadMedia: número con la edad media calculada
 */
function mostrarEdadMedia(nombreRaza, edadMedia) {
    const edadInfo = document.getElementById('edadInfo');
    if (edadMedia) {
        edadInfo.textContent = `Raza: ${nombreRaza} - Edad media: ${edadMedia.toFixed(1)} años`;
        edadInfo.style.display = 'block';
    } else {
        edadInfo.style.display = 'none';
    }
}

/*
 * Muestra el país de origen de la raza
 * Recibe: objeto breed con la información de la raza
 */
function mostrarOrigen(breed) {
    const origenInfo = document.getElementById('origenInfo');
    if (breed.origin || breed.country_code) {
        // Usamos el origen completo o el código de país si no hay origen
        const origen = breed.origin || `País: ${breed.country_code}`;
        origenInfo.textContent = `Origen: ${origen}`;
        origenInfo.style.display = 'block';
    } else {
        origenInfo.textContent = 'Origen: No disponible';
        origenInfo.style.display = 'block';
    }
}

/*
 * Muestra detalles adicionales de la raza como temperamento, peso, altura, etc.
 * Recibe: objeto breed con la información completa de la raza
 */
function mostrarDetallesRaza(breed) {
    const detallesInfo = document.getElementById('detallesInfo');
    const detalles = [];

    // Agregamos cada detalle disponible con su emoji correspondiente
    if (breed.temperament) {
        detalles.push(`🦮 Temperamento: ${breed.temperament}`);
    }

    if (breed.weight?.metric) {
        detalles.push(`⚖️ Peso: ${breed.weight.metric} kg`);
    }

    if (breed.height?.metric) {
        detalles.push(`📏 Altura: ${breed.height.metric} cm`);
    }

        // Mostramos los detalles si hay información disponible
    if (detalles.length > 0) {
        detallesInfo.innerHTML = detalles.join('<br>');
        detallesInfo.style.display = 'block';
    } else {
        detallesInfo.style.display = 'none';
    }
}

// Función para filtrar las tarjetas según el término de búsqueda
function filtrarTarjetas(searchTerm) {
    // Convertir el término de búsqueda a minúsculas y eliminar espacios en blanco
    const termino = searchTerm.toLowerCase().trim();
    console.log('Filtrando por:', termino);
    
    // Obtener todas las tarjetas del contenedor
    const tarjetas = document.querySelectorAll('.dog-card');
    console.log('Número de tarjetas encontradas:', tarjetas.length);
    
    let tarjetasEncontradas = 0;
    
    tarjetas.forEach(tarjeta => {
        const contenedorTarjeta = tarjeta.closest('.col-md-6');
        // Obtener el texto del título y convertirlo a minúsculas
        const nombreRaza = tarjeta.querySelector('.card-title')?.textContent?.toLowerCase() || '';
        
        // Comprobar si el término está vacío o si el nombre contiene el término
        if (termino === '' || nombreRaza.includes(termino)) {
            contenedorTarjeta.style.display = '';
            tarjetasEncontradas++;
        } else {
            contenedorTarjeta.style.display = 'none';
        }
    });
    
    console.log('Tarjetas mostradas:', tarjetasEncontradas);
    
    // Mostrar mensaje si no hay resultados
    const mensajeNoResultados = document.getElementById('mensajeNoResultados');
    if (!mensajeNoResultados) {
        const mensaje = document.createElement('div');
        mensaje.id = 'mensajeNoResultados';
        mensaje.className = 'col-12 text-center mt-4';
        contenedorGaleria.appendChild(mensaje);
    }
    
    const mensajeElement = document.getElementById('mensajeNoResultados');
    if (tarjetasEncontradas === 0 && termino !== '') {
        mensajeElement.innerHTML = `<p class="text-muted">No se encontraron razas que coincidan con "${searchTerm}"</p>`;
        mensajeElement.style.display = 'block';
    } else {
        mensajeElement.style.display = 'none';
    }
}

// Función para obtener y mostrar la galería de perros
async function cargarGaleria() {
    try {
        const respuesta = await fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1&limit=20', {
            headers: {
                'x-api-key': API_KEY
            }
        });
        const perros = await respuesta.json();
        
        contenedorGaleria.innerHTML = '';
        
        // Crear el contenedor para el mensaje de no resultados
        const mensajeNoResultados = document.createElement('div');
        mensajeNoResultados.id = 'mensajeNoResultados';
        mensajeNoResultados.className = 'col-12 text-center mt-4';
        mensajeNoResultados.style.display = 'none';
        
        perros.forEach(perro => {
            if (perro.breeds && perro.breeds.length > 0) {
                const raza = perro.breeds[0];
                const tarjeta = crearTarjetaPerro(perro.url, raza.name, raza);
                contenedorGaleria.appendChild(tarjeta);
            }
        });
        
        // Agregar el mensaje de no resultados al final
        contenedorGaleria.appendChild(mensajeNoResultados);

        // Inicializar el buscador
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput && clearSearch && searchButton) {
            // Eliminar event listeners anteriores
            const nuevoSearchInput = searchInput.cloneNode(true);
            const nuevoSearchButton = searchButton.cloneNode(true);
            const nuevoClearSearch = clearSearch.cloneNode(true);
            
            searchInput.parentNode.replaceChild(nuevoSearchInput, searchInput);
            searchButton.parentNode.replaceChild(nuevoSearchButton, searchButton);
            clearSearch.parentNode.replaceChild(nuevoClearSearch, clearSearch);

            // Event listener para el input de búsqueda
            nuevoSearchInput.addEventListener('input', (e) => {
                filtrarTarjetas(e.target.value);
            });

            // Event listener para el botón de búsqueda
            nuevoSearchButton.addEventListener('click', () => {
                filtrarTarjetas(nuevoSearchInput.value);
            });

            // Event listener para buscar al presionar Enter
            nuevoSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    filtrarTarjetas(nuevoSearchInput.value);
                }
            });

            // Event listener para el botón de limpiar búsqueda
            nuevoClearSearch.addEventListener('click', () => {
                nuevoSearchInput.value = '';
                filtrarTarjetas('');
            });
        }
        
        console.log('Galería cargada y buscador inicializado');
    } catch (error) {
        console.error('Error al cargar la galería:', error);
        alert('Error al cargar la galería de perros. Por favor, intenta de nuevo.');
    }
}

// Función para crear una tarjeta de perro
function crearTarjetaPerro(imagenUrl, nombreRaza, breed) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    // Guardamos el ID de la raza en un atributo de datos
    col.innerHTML = `
        <div class="dog-card" data-breed-id="${breed.id}">
            <div class="image-container">
                <img src="${imagenUrl}" class="card-image" alt="${nombreRaza}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${nombreRaza}</h3>
            </div>
        </div>
    `;
    
    // Añadir evento click para mostrar detalles
    col.querySelector('.dog-card').addEventListener('click', () => {
        console.log('Click en tarjeta, breed:', breed);
        mostrarDetallesPerro(imagenUrl, breed);
    });
    
    return col;
}

// Función para obtener imágenes adicionales de la misma raza
async function obtenerImagenesAdicionales(breedId) {
    try {
        console.log('Obteniendo imágenes adicionales para breed_id:', breedId);
        // Usamos el endpoint correcto para obtener imágenes por raza
        const respuesta = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&limit=10`, {
            headers: {
                'x-api-key': API_KEY
            }
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error en la respuesta de la API: ${respuesta.status}`);
        }
        
        const imagenes = await respuesta.json();
        console.log('Respuesta completa de la API:', imagenes);
        return imagenes;
    } catch (error) {
        console.error('Error al obtener imágenes adicionales:', error);
        return [];
    }
}

// Función para mostrar las imágenes adicionales
function mostrarImagenesAdicionales(imagenes, imagenPrincipalUrl) {
    const contenedorImagenes = document.getElementById('additionalImages');
    if (!contenedorImagenes) {
        console.error('No se encontró el contenedor de imágenes adicionales');
        return;
    }

    // Limpiar el contenedor antes de agregar nuevas imágenes
    contenedorImagenes.innerHTML = '';

    if (!imagenes || imagenes.length === 0) {
        console.log('No se encontraron imágenes adicionales');
        contenedorImagenes.innerHTML = '<p class="text-center text-muted">No hay imágenes adicionales disponibles</p>';
        return;
    }

    // Crear una fila para las imágenes
    const row = document.createElement('div');
    row.className = 'row g-2';

    // Filtrar imágenes válidas
    const imagenesUnicas = imagenes
        .filter(img => 
            img.url !== imagenPrincipalUrl && // No repetir la imagen principal
            img.url && // Asegurarse de que tiene URL
            img.breeds && 
            img.breeds.length > 0 // Asegurarse de que tiene información de raza
        )
        .slice(0, 3);

    console.log(`Mostrando ${imagenesUnicas.length} imágenes únicas`);

    if (imagenesUnicas.length === 0) {
        contenedorImagenes.innerHTML = '<p class="text-center text-muted">No hay imágenes adicionales disponibles</p>';
        return;
    }

    imagenesUnicas.forEach(imagen => {
        const col = document.createElement('div');
        col.className = 'col-4';
        
        const img = document.createElement('img');
        img.src = imagen.url;
        img.alt = imagen.breeds[0]?.name || 'Imagen adicional';
        img.className = 'img-fluid additional-image';
        img.style.cursor = 'pointer';
        
        // Agregar evento click para cambiar la imagen principal
        img.addEventListener('click', () => {
            const imagenPrincipal = document.getElementById('dogImage');
            if (imagenPrincipal) {
                imagenPrincipal.src = imagen.url;
            }
        });
        
        col.appendChild(img);
        row.appendChild(col);
    });

    contenedorImagenes.appendChild(row);
}

// Modificar la función mostrarDetallesPerro para incluir las imágenes adicionales
async function mostrarDetallesPerro(imagenUrl, breed) {
    try {
        console.log('Mostrando detalles del perro:', breed);
        console.log('ID de la raza:', breed.id);
        
        // Cambiar a la vista principal primero para mejor experiencia
        cambiarVista('paginaPrincipal');
        
        // Mostrar imagen principal
        const imagenPrincipal = document.getElementById('dogImage');
        if (imagenPrincipal) {
            imagenPrincipal.src = imagenUrl;
            imagenPrincipal.style.display = 'block';
        }
        
        // Actualizar el nombre de la raza
        const breedName = document.getElementById('breedName');
        if (breedName) {
            breedName.textContent = breed.name;
        }
        
        // Mostrar información de la raza
        const edadMedia = calcularEdadMedia(breed);
        mostrarEdadMedia(breed.name, edadMedia);
        mostrarOrigen(breed);
        mostrarDetallesRaza(breed);
        
        // Limpiar las imágenes adicionales existentes y mostrar mensaje de carga
        const contenedorImagenes = document.getElementById('additionalImages');
        if (contenedorImagenes) {
            contenedorImagenes.innerHTML = '<p class="text-center">Cargando imágenes adicionales...</p>';
        }
        
        // Obtener y mostrar imágenes adicionales
        if (!breed.id) {
            console.error('No se encontró ID de raza:', breed);
            if (contenedorImagenes) {
                contenedorImagenes.innerHTML = '<p class="text-center text-muted">No se pueden obtener imágenes adicionales</p>';
            }
            return;
        }
        
        console.log('Obteniendo imágenes adicionales para:', breed.name, 'ID:', breed.id);
        const imagenesAdicionales = await obtenerImagenesAdicionales(breed.id);
        
        if (!imagenesAdicionales || imagenesAdicionales.length === 0) {
            console.log('No se encontraron imágenes adicionales para la raza:', breed.name);
            if (contenedorImagenes) {
                contenedorImagenes.innerHTML = '<p class="text-center text-muted">No hay imágenes adicionales disponibles</p>';
            }
            return;
        }
        
        mostrarImagenesAdicionales(imagenesAdicionales, imagenUrl);
        
    } catch (error) {
        console.error('Error al mostrar detalles del perro:', error);
        const contenedorImagenes = document.getElementById('additionalImages');
        if (contenedorImagenes) {
            contenedorImagenes.innerHTML = '<p class="text-center text-danger">Error al cargar las imágenes adicionales</p>';
        }
    }
}

// Función para cambiar entre vistas
function cambiarVista(vista) {
    if (vista === 'paginaPrincipal') {
        paginaPrincipal.style.display = 'block';
        galeriaPerros.style.display = 'none';
    } else {
        paginaPrincipal.style.display = 'none';
        galeriaPerros.style.display = 'block';
    }
}

// Event Listeners
document.getElementById('obtenerPerro').addEventListener('click', obtenerImagenPerro);
document.getElementById('irGaleria').addEventListener('click', () => {
    cambiarVista('galeria');
    cargarGaleria();
});
document.getElementById('volverInicio').addEventListener('click', () => cambiarVista('paginaPrincipal'));

// Cargar la primera imagen al iniciar
obtenerImagenPerro(); 