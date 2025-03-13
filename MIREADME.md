# Frontend - Angular 17

## Descripción
Este es el frontend de un sistema de gestión de solicitudes de estudios de seguridad desarrollado en Angular 17. Consume la API RESTful proporcionada por el backend.

## Requerimientos
- Node.js (versión 14 o superior)
- Angular CLI

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/frontend.git
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```

4. Abre tu navegador y ve a `http://localhost:4200`.

## Funcionalidades

- **Login**: Permite a los usuarios iniciar sesión y obtener un token de autenticación.
- **Dashboard**: Muestra un conteo de solicitudes por estado.
- **Listado de Candidatos**: Permite crear, editar y eliminar candidatos.
- **Listado de Solicitudes**: Permite filtrar solicitudes por estado y tipo de estudio.
- **Crear Nueva Solicitud**: Permite seleccionar un candidato y un tipo de estudio para crear una nueva solicitud.

## Rutas

- `/login`: Página de inicio de sesión.
- `/dashboard`: Muestra el resumen de solicitudes.
- `/candidatos`: Listado de candidatos con opciones para crear, editar y eliminar.
- `/solicitudes`: Listado de solicitudes con filtros.
- `/tipos-estudio`: Listado de tipos de estudio.

## Tecnologías Utilizadas
- Angular 17
- Bootstrap para estilos
- RxJS para manejo de datos asíncronos

## Pruebas
Puedes probar la funcionalidad de la aplicación en tu navegador después de iniciar sesión.

## Credenciales de Prueba
- Usuario: `admin`
- Contraseña: `admin`
