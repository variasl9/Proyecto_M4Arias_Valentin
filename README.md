# MateCode Tasks

Gestor de tareas SPA para pequeñas empresas. Cada usuario se registra, gestiona sus propias tareas (crear, listar, editar, completar y eliminar) con persistencia en la nube, y puede recibir por email un resumen del estado de todas sus tareas.

**URL de producción:** https://proyecto-m4-arias-valentin.vercel.app

## Stack

- **Frontend:** React + TypeScript (Vite) y React Router
- **Backend as a Service:** Firebase Auth + Cloud Firestore
- **Email:** AWS SES, invocado desde una Vercel Function
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

## Funcionalidades

- Registro e inicio de sesión con email y contraseña, o con Google.
- Rutas privadas: no se pueden ver las tareas sin haber iniciado sesión.
- Mensajes claros para los errores de autenticación.
- CRUD completo de tareas con persistencia en Firestore.
- Cada usuario solo ve y modifica sus propias tareas.
- Estados de carga y de error, y actualización automática de la UI tras cada operación.
- Botón para enviar por email un resumen de todas las tareas.
- Diseño responsive con enfoque mobile first.

## Estructura del proyecto

```
├─ api/                  # Vercel Function (envío de email con SES)
├─ src/
│  ├─ components/        # Componentes UI (AuthForm, TodoForm, TodoItem, TodoList, SendSummaryButton)
│  ├─ features/auth/     # Contexto y provider de autenticación
│  ├─ hooks/             # useAuth, useTasks
│  ├─ pages/             # LoginPage, RegisterPage, TasksPage
│  ├─ routes/            # AppRouter y ProtectedRoute
│  ├─ services/          # Integraciones: Firebase, auth, tareas, email
│  ├─ types/             # Tipos e interfaces compartidas
│  └─ utils/             # Validaciones y traducción de errores
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

`npm test` ejecuta 11 tests con Vitest y React Testing Library:

- **Unitarios:** `validateTitle` y `getAuthErrorMessage`.
- **De componentes:** `TodoForm` y `TodoList`.
- **Con mocks de servicios externos:** `sendTasksSummary`, con `fetch` y Firebase simulados.

## Uso de IA en el proceso

_(se completa en el siguiente paso)_