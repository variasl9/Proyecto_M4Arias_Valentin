# MateCode Tasks

Gestor de tareas SPA para pequeñas empresas. Cada usuario se registra, gestiona sus propias tareas (crear, listar, editar, completar y eliminar) con persistencia en la nube, y puede recibir por email un resumen del estado de todas sus tareas.

**URL de producción:** https://proyecto-m4-arias-valentin.vercel.app

## Stack

- **Frontend:** React + TypeScript (Vite) y React Router
- **Backend as a Service:** Firebase Auth + Cloud Firestore
- **Email:** AWS SES, invocado desde una Vercel Function
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library
- **Drag & drop:** dnd-kit

## Funcionalidades

- Registro e inicio de sesión con email y contraseña, o con Google.
- Rutas privadas: no se pueden ver las tareas sin haber iniciado sesión.
- Mensajes claros para los errores de autenticación.
- CRUD completo de tareas con persistencia en Firestore.
- Cada usuario solo ve y modifica sus propias tareas.
- Estados de carga y de error, y actualización automática de la UI tras cada operación.
- Botón para enviar por email un resumen de todas las tareas.
- Diseño responsive con enfoque mobile first.
- **Extra:** filtros por estado (todas, pendientes o completadas).
- **Extra:** prioridad (baja, media o alta) y fecha de vencimiento, con aviso de tareas vencidas.
- **Extra:** orden por más recientes, por prioridad o por fecha de vencimiento.
- **Extra:** orden manual con drag & drop (`dnd-kit`), que se guarda en Firestore.

## Estructura del proyecto

```
├─ api/                  # Vercel Function (envío de email con SES)
├─ src/
│  ├─ components/        # Componentes UI (AuthForm, TodoForm, TodoItem, SortableTodoItem, TodoList, TaskFilters, TaskSortSelect, SendSummaryButton)
│  ├─ features/auth/     # Contexto y provider de autenticación
│  ├─ hooks/             # useAuth, useTasks
│  ├─ pages/             # LoginPage, RegisterPage, TasksPage
│  ├─ routes/            # AppRouter y ProtectedRoute
│  ├─ services/          # Integraciones: Firebase, auth, tareas, email
│  ├─ types/             # Tipos e interfaces compartidas
│  └─ utils/             # Validaciones, errores de auth, fechas, prioridades, filtros y orden
├─ tests/                # Tests unitarios, de componentes y mocks
├─ firestore.rules       # Reglas de seguridad de Firestore
├─ .env.example          # Plantilla de variables de entorno (sin secretos)
└─ vercel.json           # Rewrites para el ruteo de la SPA
```

## Decisiones arquitectónicas

- **Código por capas.** Los componentes no hablan con Firebase directamente: pasan por `hooks` y `services`. Así la lógica se puede cambiar o testear sin tocar la interfaz.
- **Contexto de autenticación.** `AuthProvider` escucha el estado de sesión de Firebase y lo comparte con toda la app mediante el hook `useAuth`. `ProtectedRoute` usa ese estado para bloquear las rutas privadas.
- **Actualización en tiempo real.** Las tareas se leen con `onSnapshot` de Firestore, por lo que la UI se actualiza sola después de crear, editar o eliminar.
- **Seguridad de los datos.** Las reglas de Firestore (`firestore.rules`) permiten leer, crear, editar y borrar solo las tareas cuyo `userId` coincide con el usuario autenticado. Además, el frontend filtra por `userId`.
- **Función serverless en `api/`.** La consigna sugiere una carpeta `functions/`, pero Vercel solo reconoce las funciones que están dentro de `api/`, por eso se usa esa carpeta.
- **Email seguro.** La función verifica el token de Firebase del usuario, lee sus tareas directamente desde Firestore en el servidor y envía el correo únicamente al email de ese usuario. Así nadie puede usar el endpoint para mandar correos a terceros, y ningún secreto de AWS ni de Firebase Admin llega al frontend.
- **`vercel.json`.** Redirige todas las rutas que no sean `/api/*` a `index.html`, para que recargar una ruta como `/tasks` funcione en producción.
- **Filtros y orden como funciones puras.** `filterTasks` y `sortTasks` reciben una lista y devuelven una copia nueva, sin modificar la original. La página los aplica en ese orden (primero filtra, después ordena), y al ser funciones aisladas se testean sin necesidad de una pantalla.
- **Compatibilidad con tareas anteriores.** Al agregar prioridad, fecha y orden, las tareas ya guardadas no tenían esos campos. El servicio los completa al leer (prioridad media y sin fecha) y el orden manual usa `createdAt` si falta `order`, así que no hizo falta migrar datos.
- **Drag & drop con `dnd-kit`.** Solo se puede arrastrar con el orden «Orden manual» y el filtro «Todas», para no reordenar una lista incompleta. Se agarra únicamente desde un asa, así los botones y el texto siguen funcionando, y también se puede reordenar con teclado.
- **Reordenamiento atómico.** Al soltar una tarea, se actualiza el campo `order` de todas con un único `writeBatch` de Firestore: se guardan todos los cambios o ninguno. Los números bajan de a uno a partir de la hora actual, por lo que las tareas nuevas siguen apareciendo arriba.

## Instalación

1. Clonar el repositorio:

```bash
   git clone https://github.com/variasl9/Proyecto_M4Arias_Valentin.git
   cd Proyecto_M4Arias_Valentin
```

2. Instalar dependencias:

```bash
   npm install
```

3. Crear el archivo `.env` a partir de la plantilla y completar los valores:

```bash
   cp .env.example .env
```

4. Ejecutar la app:
   - Solo el frontend: `npm run dev`
   - Frontend y función de email: `vercel dev` (requiere la CLI de Vercel: `npm install -g vercel`)

5. Ejecutar los tests:

```bash
   npm test
```

## Variables de entorno

Se cargan en un archivo `.env` local (ignorado por Git) y, en producción, en **Vercel → Settings → Environment Variables**. La plantilla sin datos está en `.env.example`.

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | API key de la app web de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | Dominio de autenticación de Firebase |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | ID del proyecto de Firebase |
| `VITE_FIREBASE_APP_ID` | Frontend | ID de la app web de Firebase |
| `FIREBASE_PROJECT_ID` | Función | ID del proyecto (cuenta de servicio) |
| `FIREBASE_CLIENT_EMAIL` | Función | Email de la cuenta de servicio de Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | Función | Clave privada de la cuenta de servicio (en una línea, con `\n` como texto) |
| `AWS_REGION` | Función | Región de AWS SES (`us-east-1`) |
| `AWS_ACCESS_KEY_ID` | Función | ID de acceso del usuario IAM con permiso `ses:SendEmail` |
| `AWS_SECRET_ACCESS_KEY` | Función | Clave secreta del usuario IAM |
| `SES_FROM_EMAIL` | Función | Email remitente verificado en SES |

Las variables con prefijo `VITE_` quedan visibles en el navegador (son la configuración pública de Firebase). Las demás solo existen en el servidor.

## Flujo de envío de emails

1. El usuario hace clic en **Enviar resumen por email**.
2. El frontend obtiene el ID token de Firebase del usuario y llama a `POST /api/send-summary` con ese token en el encabezado `Authorization`.
3. La Vercel Function verifica el token con Firebase Admin y obtiene el `uid` y el email del usuario.
4. La función lee desde Firestore las tareas de ese usuario y arma el resumen (total, completadas y pendientes).
5. La función envía el correo con AWS SES al email del usuario.
6. La función responde OK o con un error, y el botón muestra el resultado.

**Limitaciones conocidas:** la cuenta de AWS SES está en modo *sandbox*, por lo que solo puede enviar a direcciones verificadas, y los correos pueden llegar a la carpeta de spam porque el remitente no tiene autenticación de dominio (DKIM/SPF).

## Tests

`npm test` ejecuta 35 tests, repartidos en 11 archivos, con Vitest y React Testing Library:

- **Unitarios:** `validateTitle`, `getAuthErrorMessage`, `filterTasks`, `sortTasks`, `computeOrders` y las utilidades de fechas.
- **De componentes:** `TodoForm`, `TodoList` (con y sin arrastre) y `TaskFilters`.
- **Con mocks de servicios externos:** `sendTasksSummary`, con `fetch` y Firebase simulados.

El arrastre real con el mouse no se simula en los tests: se prueba la lógica del reordenamiento y que las asas aparezcan solo cuando corresponde. El arrastre en sí se verificó a mano en el navegador.

## Uso de IA en el proceso

Usé **Claude** como apoyo durante todo el proyecto. Le compartí el enunciado y una primera parte del proyecto, le pedí mejoras y le pedí que me guiara en la parte de **Firebase, AWS y Vercel**, que era la que menos conocía.

### Cómo lo integré en mi trabajo

- Trabajé **paso a paso**: le pedí que me diera una sola tarea por vez (crear un archivo, pegar el código, probarlo) y no avancé hasta que funcionara.
- Después de cada archivo o cambio hice un **commit en español** con un mensaje descriptivo, para que el historial de Git refleje cómo fue creciendo el proyecto.
- Probé cada parte en el navegador antes de seguir (login, CRUD, email), y al final probé todo en la URL de producción.

### En qué situaciones fue más efectiva

- **Configurar servicios externos.** Me guió en la consola de Firebase (Auth, Firestore, reglas de seguridad), en AWS (verificar el email en SES y crear un usuario IAM con permiso solo para enviar emails) y en Vercel (variables de entorno, dominio autorizado y deploy).
- **Resolver errores.** Le pegué los mensajes de error y me ayudó a encontrar la causa. Algunos ejemplos:
  - Un error de TypeScript por una diferencia de mayúsculas en el nombre de `LoginPage.tsx`, que habría roto el deploy en Linux.
  - Un error `invalid_grant: account not found` al enviar el email: el `FIREBASE_CLIENT_EMAIL` del `.env` no coincidía con el de la cuenta de servicio real. Lo detectamos con un script de diagnóstico y lo arreglé regenerando la clave y copiando los tres valores del mismo archivo.
  - Un email que figuraba como enviado pero no llegaba: estaba en la carpeta de spam, por usar SES en modo sandbox y sin autenticación de dominio.
- **Mejorar y ordenar el código** por capas (`components`, `hooks`, `services`, etc.) y agregar tests.
- **Sumar los extras** (filtros, prioridad y fechas, orden y drag & drop) en pasos chicos, cada uno con sus tests y su commit.

### Patrones y buenas prácticas que descubrí

- Pedir pasos cortos y pegar **el error completo** (sin claves) da mejores respuestas que describirlo.
- **Nunca pegar secretos en el chat.** En un momento pegué por error mis claves de AWS; las eliminé y generé unas nuevas. Desde entonces las cargo directo en el `.env` y en Vercel.
- **Verificar lo que genera la IA.** Probé cada cosa antes de seguir y revisé los archivos para entender qué hace cada uno y por qué existe, en vez de copiar sin leer.
- Cuando un error no es obvio, conviene **hacer una prueba chica y aislada** (como el script que probaba solo las credenciales de Firebase) en lugar de adivinar.