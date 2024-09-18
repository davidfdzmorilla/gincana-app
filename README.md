# Gincana App

Gincana App es una aplicación web de competición de carreras que permite a los administradores gestionar corredores, equipos y cronómetros en tiempo real. Los usuarios pueden visualizar clasificaciones, actualizar su perfil y registrar tiempos para las carreras. La aplicación está construida con un backend en Node.js y MySQL, mientras que el frontend está desarrollado con React y Tailwind CSS. El proyecto también incluye WebSockets para la actualización en tiempo real del ranking de corredores y equipos.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Licencia](#licencia)

## Características

- **Gestión de corredores y equipos**: Los administradores pueden añadir corredores y equipos.
- **Cronómetros en tiempo real**: Se pueden iniciar, parar y gestionar múltiples cronómetros para cada corredor.
- **Ranking en tiempo real**: Actualización automática de las clasificaciones utilizando WebSockets.
- **Perfil de usuario**: Los usuarios pueden actualizar sus perfiles, incluyendo la foto de perfil.
- **Seguridad**: Autenticación mediante tokens JWT, con verificación de expiración.
- **Interfaz adaptable**: Diseño responsive utilizando Tailwind CSS.

## Tecnologías Utilizadas

### Backend

- **Node.js** y **Express** para la API.
- **MySQL** como base de datos.
- **WebSockets** para las actualizaciones en tiempo real.
- **Multer** para la gestión de archivos y subida de imágenes.
- **JWT** para autenticación de usuarios.
- **Docker** para contenerización.

### Frontend

- **React** para la interfaz de usuario.
- **Tailwind CSS** para el diseño adaptable.
- **Axios** para las solicitudes HTTP.
- **React Router** para la navegación en la aplicación.

### Otros

- **Docker** para el despliegue de la aplicación en contenedores.

## Instalación

### Requisitos previos

Asegúrate de tener instalados los siguientes programas:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Clonar el repositorio

```bash
git clone https://github.com/davidfdzmorilla/gincana-app.git
cd gincana-app
```

### Backend

1. Configura las variables de entorno en el archivo .env en el directorio backend:

   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=gincana
   JWT_SECRET=your_jwt_secret
   ```

### Frontend

1. Configura las variables de entorno en el archivo .env en el directorio frontend:

   ```bash
   REACT_APP_API_URL=your_api_url
   ```

### Docker

1. Configura las variables de entorno en el archivo .env en el directorio backend:

   ```bash
   NODE_ENV=development
   PORT=5500
   DB_HOST=db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   MYSQL_USER=your_db_user
   MYSQL_PASSWORD=your_db_password
   MYSQL_DATABASE=your_db_name
   MYSQL_ROOT_PASSWORD=your_db_root_password
   ```

2. Construye las imágenes de Docker para el backend y el frontend:

   ```bash
   docker-compose up -d --build
   ```

## Uso

### Usuarios Administradores

- Los administradores pueden crear nuevos corredores, equipos y gestionar los cronómetros.
- La administración de tiempos se realiza en la ruta /chrono, donde se pueden ver, añadir y gestionar los tiempos de los corredores.

### Usuarios Corredores

- Los corredores pueden ver sus tiempos y clasificaciones, actualizar su perfil y equipo, y subir una foto de perfil.
- Las actualizaciones en tiempo real están disponibles en la página de ranking (/ranking).

## Licencia

Este proyecto está licenciado bajo la licencia MIT.
