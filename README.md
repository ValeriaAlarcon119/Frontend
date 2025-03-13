# Proyecto Frontend - Sistema de Gestión de Solicitudes

## Descripción
Este proyecto es la interfaz de usuario para el sistema de gestión de solicitudes, permitiendo a los usuarios interactuar con los candidatos y tipos de estudios. Utiliza **Angular 17** como framework frontend.

## Requisitos
- **Node.js**: Asegúrate de tener instalada la versión de Node.js que sea compatible con Angular 17. Puedes verificar la instalación ejecutando el siguiente comando en tu terminal:

```bash
node -v
```

- **Angular CLI**: Debes tener instalado Angular CLI. Puedes instalarlo globalmente usando el siguiente comando:

```bash
npm install -g @angular/cli
```


## Instalación

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/ValeriaAlarcon119/Frontend.git
   cd Frontend
   ```

2. **Instalar Dependencias**:
   Asegúrate de tener Node.js y Angular CLI instalados, luego ejecuta:
   ```bash
   npm install
   ```

3. **Iniciar el Servidor de Desarrollo**:
   Para iniciar la aplicación, ejecuta el siguiente comando:
   ```bash
   ng serve
   ```

   La aplicación estará disponible en `http://localhost:4200`.

## Funcionalidades
- Registro y autenticación de usuarios.
- Gestión de solicitudes con opciones para crear, editar y eliminar.
- Filtrado de solicitudes por estado y tipo de estudio.

## Notas Adicionales
- Asegúrate de que el backend esté en funcionamiento y disponible en `http://localhost:8000` para que la aplicación frontend pueda interactuar con él.

## Rutas y Funcionalidades

### Registro de Usuario
- **Ruta**: `/register`
- Permite a los usuarios registrarse con un nombre, correo y contraseña. Se valida que el correo tenga un formato correcto y que no exista un usuario con el mismo correo.

### Inicio de Sesión
- **Ruta**: `/login`
- Permite a los usuarios iniciar sesión con su correo y contraseña. Al iniciar sesión, se obtiene un token de acceso que se utiliza para proteger las rutas del sistema todo salio bien en la migracion de la base de datos puedes ingresar con las siguientes credenciales:
                                                    nombre: admin
                                                    correo:admin@gmail.com
                                                    contraseña: admin123

### Dashboard
- **Ruta**: `/dashboard`
- Al iniciar sesión, los usuarios son redirigidos a esta ruta. Aquí se encuentran:
  - **Conteo de Solicitudes**: Muestra el número de solicitudes por estado.
  -Aqui también encontramos los siguientes botones: Candidatos, Solicitudes y Tipos de Estudio. 
  
1. El botón **Candidatos** nos dirige a la ruta /candidatos donde encontramos: 

      ### Listado de Candidatos**: Permite crear, editar, eliminar y ver detalles de cada candidato que estara disponible para seleccionar cuando queramos crear una solicitud. Los usuarios pueden regresar al dashboard en cada una de estas rutas,  o salir lo que nos redirige a la página de inicio de sesión. Importante tener en cuanta que no se podran eliminar los candidatos que  hayan sido usados para crear una solicitud. 

2. El botón **Solicitudes** en Dashboard nos dirige a /solicitudes donde encontramos: 
      ### Listado de Solicitudes
      - Donde se pueden aplicar filtros por estado y tipo de estudio. Hay un checkbox para activar los filtros, y por defecto se muestra todo el listado sin filtros, si los activamos podemos filtrar los resultado por tipo de estudio y por estado de cada solicitud. También permite:
      - Crear Nueva Solicitud: Abre un modal con el formulario para ingresar los datos de la nueva solicitud.
      - Editar Solicitud: Permite modificar el estado de cualquier solicitud existente y cualquier otro datos de las solicitudes.
      - Eliminar Solicitud: Opción para eliminar solicitudes.
      - Ver Detalles de Solicitudes: Muestra información detallada sobre una solicitud específica.

3. **Tipos de Estudio** nos dirige a /tipos-estudio:
      - En el dashboard, hay un botón que lleva al listado de tipos de estudio, donde se puede:
      - Crear, Editar o Eliminar Tipos de Estudio: Permite gestionar los tipos de estudio disponibles en el sistema y ver los detalles de cada uno de los tipos de estudio que estaran disponisbles a seleccionar cuando se desee crear una nueva solcitud y no se podran eliminar
      tipos de estudio que hayan sido usados para crear cualquier solicitud.


## Validaciones
- Todos los formularios exigen que se completen todos los campos.
- Los campos numéricos no aceptan letras (por ejemplo, en la cédula de candidatos).
- En los formularios de registro y login, se valida que el correo tenga un formato válido y que no se creen usuarios con correos duplicados.
- Los candidatos no pueden ser registrados si ya existe un registro con la misma cédula o correo y tampoco sepueden registrar con un formato no valido para correo.
- Se manejan errores en los formularios, mostrando mensajes claros al usuario cuando hay problemas con la entrada de datos.
- En el frontend, se manejan los errores que provienen del backend y se muestran mensajes claros al usuario cuando se intenta eliminar un candidato o tipo de estudio que está en uso.


## Herramientas Utilizadas
- **Angular 17**: Framework para el desarrollo del frontend.
- **Bootstrap**: Framework CSS para el diseño de la interfaz, proporcionando un diseño limpio y responsivo.
- **Font Awesome**: Para los íconos utilizados en la interfaz, mejorando la experiencia del usuario.

## Consumo de Endpoints del Backend
La aplicación se conecta al backend a través de los siguientes endpoints(explicación detallada en /Backend/MIREADMI):

- **Registro**: `POST /api/auth/register`
- **Inicio de Sesión**: `POST /api/auth/login`
- **Gestión de Solicitudes**: `GET /api/solicitudes`, `POST /api/solicitudes`, etc.
- **Gestión de Candidatos**: `POST /api/candidatos`, etc.
- **Gestión de Tipos de Estudio**: `POST /api/tipos-estudio`, etc.

### Uso del Token
Al iniciar sesión, se obtiene un token de acceso que se almacena en el almacenamiento local del navegador. Este token se utiliza para autenticar las solicitudes a las rutas protegidas. El interceptor `AuthInterceptor` se encarga de agregar el token a las cabeceras de las solicitudes HTTP:

## Decisiones Técnicas Tomadas


### 1. Uso de Plantillas Combinadas en Componentes
- **Razón**: Decidí incluir la plantilla HTML directamente en el archivo `solicitudes.component.ts` en lugar de separarla en un archivo HTML independiente. Esto simplifica la gestión de la vista y permite realizar configuraciones de la interfaz de usuario de manera más eficiente en un solo lugar.

### 2. Uso de Bootstrap para el Diseño
- **Razón**: Bootstrap proporciona un conjunto de herramientas CSS y JavaScript que permite crear interfaces responsivas y atractivas de manera rápida. Esto ahorra tiempo en el diseño y asegura que la aplicación se vea bien en diferentes dispositivos.

### 3. Manejo de Errores y Validaciones
- **Razón**: Se implementaron validaciones en los formularios para mejorar la experiencia del usuario. Los mensajes de error claros ayudan a los usuarios a corregir problemas de entrada antes de enviar formularios.


## Notas
Asegúrate de que el backend esté corriendo y accesible en `http://localhost:8000` para que el frontend funcione correctamente. Sigue todos los pasos de instalación y configuración para garantizar que la aplicación funcione sin problemas.





This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
