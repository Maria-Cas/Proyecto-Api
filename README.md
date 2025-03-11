# 🐕 Dog Gallery API

Una aplicación web moderna que muestra imágenes aleatorias de perros utilizando The Dog API. Perfecta para amantes de los perros que quieren descubrir diferentes razas y ver adorables imágenes caninas.

## 🎯 Funcionalidades Implementadas

### Visualización de Perros
- ✅ Imágenes aleatorias de perros
- ✅ Interfaz responsive y moderna
- ✅ Animaciones suaves

### Información de Razas
- ✅ Nombre de la raza del perro
- ✅ Cálculo de edad media por raza
- ✅ País de origen de la raza
- ✅ Visualización dinámica de datos

### Características Técnicas
- ✅ Carga asíncrona con Fetch API
- ✅ Gestión de errores robusta
- ✅ Mensajes de usuario amigables
- ✅ Diseño responsive

## 🛠️ Tecnologías

- [Vite](https://vitejs.dev/) - Build tool y servidor de desarrollo
- [The Dog API](https://thedogapi.com/) - API de imágenes de perros
- JavaScript Vanilla
- CSS3 moderno
- Fetch API para peticiones asíncronas

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Maria-Cas/Proyecto-Api.git
# Navegar al directorio
cd Proyecto-Api
# Instalar dependencias
npm install
# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura

proyecto-final/
├── index.html      # Página principal
├── src/
│   ├── main.js     # Lógica de la aplicación
│   └── style.css   # Estilos
└── README.md       # Documentación


Añadir funcion asincrona para obtener la imagen del perro 
completar con la constante que recoge la informacion sobre la media de vida
Añadir la funcion para mostrar el origen

## 🔍 Detalles Técnicos

### Obtención de Datos
```javascript
async function obtenerImagenPerro() {
    try {
        const respuesta = await fetch('https://api.thedogapi.com/v1/images/search?has_breeds=1');
        const [data] = await respuesta.json();
        // Procesamiento de datos de raza...
    } catch (error) {
        manejarError(error);
    }
}
```

### Cálculo de Edad Media
```javascript
function calcularEdadMedia(breed) {
    if (breed.life_span) {
        const edades = breed.life_span.split('-').map(num => parseInt(num.trim()));
        return edades.reduce((a, b) => a + b, 0) / edades.length;
    }
    return null;
}
```

### Información de Origen
```javascript
function mostrarOrigen(breed) {
    if (breed.origin || breed.country_code) {
        const origen = breed.origin || `País: ${breed.country_code}`;
        // Mostrar origen de la raza...
    }
}
```

## 👩‍💻 Autora

María Castellano
- GitHub: [@Maria-Cas](https://github.com/Maria-Cas)

## 🙏 Agradecimientos

- [The Dog API](https://thedogapi.com/) por proporcionar las imágenes
- [Vite](https://vitejs.dev/) por el excelente tooling
