import './style.css'

// API Key para acceder a The Dog API
const API_KEY = 'live_ObhKAQTiehStNYDlSLfGYeA4E31qnpEPZmEks4TgPD6IgdiyCs6MQCO1AIEZjQ02';

// Elementos del DOM
const paginaPrincipal = document.getElementById('paginaPrincipal');
const galeriaPerros = document.getElementById('galeriaPerros');
const contenedorGaleria = document.getElementById('contenedorGaleria');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');

// Almacenar todas las tarjetas de perros
let todasLasTarjetas = [];

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

        // Verificar si los elementos existen
        if (!imagen || !edadInfo || !origenInfo || !detallesInfo || !breedName) {
            console.error('No se encontraron todos los elementos necesarios en el DOM');
            return;
        }

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
        } else {
            console.log('La imagen no tiene información de raza');
            edadInfo.style.display = 'none';
            origenInfo.style.display = 'none';
            detallesInfo.style.display = 'none';
            breedName.textContent = 'Raza no disponible';
        }
    } catch (error) {
        console.error('Error detallado:', error);
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
    const termino = searchTerm.toLowerCase().trim();
    
    todasLasTarjetas.forEach(tarjeta => {
        const nombreRaza = tarjeta.querySelector('.card-title').textContent.toLowerCase();
        if (nombreRaza.includes(termino)) {
            tarjeta.parentElement.classList.remove('hidden');
        } else {
            tarjeta.parentElement.classList.add('hidden');
        }
    });
}

// Event listener para el input de búsqueda
searchInput.addEventListener('input', (e) => {
    filtrarTarjetas(e.target.value);
});

// Event listener para el botón de limpiar búsqueda
clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    filtrarTarjetas('');
});

// Función para obtener y mostrar la galería de perros
async function cargarGaleria() {
    try {
        const respuesta = await fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1&limit=12', {
            headers: {
                'x-api-key': API_KEY
            }
        });
        const perros = await respuesta.json();
        
        contenedorGaleria.innerHTML = '';
        todasLasTarjetas = []; // Limpiar el array de tarjetas
        
        perros.forEach(perro => {
            if (perro.breeds && perro.breeds.length > 0) {
                const raza = perro.breeds[0];
                const tarjeta = crearTarjetaPerro(perro.url, raza.name, raza);
                contenedorGaleria.appendChild(tarjeta);
                todasLasTarjetas.push(tarjeta.querySelector('.dog-card')); // Almacenar la tarjeta
            }
        });
    } catch (error) {
        console.error('Error al cargar la galería:', error);
        alert('Error al cargar la galería de perros. Por favor, intenta de nuevo.');
    }
}

// Función para crear una tarjeta de perro
function crearTarjetaPerro(imagenUrl, nombreRaza, breed) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="dog-card">
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
        mostrarDetallesPerro(imagenUrl, breed);
    });
    
    return col;
}

// Función para mostrar los detalles de un perro al hacer click
function mostrarDetallesPerro(imagenUrl, breed) {
    document.getElementById('dogImage').src = imagenUrl;
    document.getElementById('dogImage').style.display = 'block';
    
    const edadMedia = calcularEdadMedia(breed);
    mostrarEdadMedia(breed.name, edadMedia);
    mostrarOrigen(breed);
    mostrarDetallesRaza(breed);
    
    cambiarVista('paginaPrincipal');
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