import './style.css'

// API Key para acceder a The Dog API
const API_KEY = 'live_ObhKAQTiehStNYDlSLfGYeA4E31qnpEPZmEks4TgPD6IgdiyCs6MQCO1AIEZjQ02';

/*
 * Función principal que obtiene y muestra una imagen aleatoria de perro
 * Realiza una petición a la API y maneja la visualización de todos los datos
 */
async function obtenerImagenPerro() {
    // Obtenemos referencias a los elementos del DOM
    const imagen = document.getElementById('dogImage');
    const edadInfo = document.getElementById('edadInfo');
    const origenInfo = document.getElementById('origenInfo');
    const detallesInfo = document.getElementById('detallesInfo');

    try {
        // Realizamos la petición a la API incluyendo la API key
        // El parámetro has_breeds=1 asegura que obtengamos imágenes con información de raza
        const respuesta = await fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1', {
            headers: {
                'x-api-key': API_KEY
            }
        });
        const [data] = await respuesta.json();
        
        // Mostramos la imagen
        imagen.src = data.url;
        imagen.style.display = 'block';

        // Si la imagen tiene información de raza, mostramos todos los detalles
        if (data.breeds && data.breeds.length > 0) {
            const raza = data.breeds[0];
            const edadMedia = calcularEdadMedia(raza);
            mostrarEdadMedia(raza.name, edadMedia);
            mostrarOrigen(raza);
            mostrarDetallesRaza(raza);
        }
    } catch (error) {
        // Manejo de errores con mensaje al usuario
        console.error('Error al obtener la imagen del perro:', error);
        alert('¡Ups! Hubo un error al obtener la imagen del perro. Por favor, intenta de nuevo.');
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

    if (breed.bred_for) {
        detalles.push(`🎯 Criado para: ${breed.bred_for}`);
    }

    if (breed.breed_group) {
        detalles.push(`👥 Grupo: ${breed.breed_group}`);
    }

    // Mostramos los detalles si hay información disponible
    if (detalles.length > 0) {
        detallesInfo.innerHTML = detalles.join('<br>');
        detallesInfo.style.display = 'block';
    } else {
        detallesInfo.style.display = 'none';
    }
}

// Configuramos el evento click del botón para obtener un nuevo perro
document.getElementById('obtenerPerro').addEventListener('click', obtenerImagenPerro);

// Cargamos la primera imagen al iniciar la página
obtenerImagenPerro(); 