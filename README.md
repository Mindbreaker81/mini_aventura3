# app_minigames

Este repositorio contiene el proyecto **Aventura Multimateria**, una aplicación web de minijuegos educativos desarrollada con Next.js y React.

## Estructura del repositorio

- `aventura-multimateria/`: Código fuente de la aplicación principal.
  - `src/app/world/puerto-palabras/`: Minijuego "Puerto Palabras" y utilidades relacionadas.
  - `src/app/world/mision-mapamundi-v1/`: Minijuego de mapa interactivo usando react-leaflet (versión original).
  - `src/app/data/`: Archivos de configuración y datos de minijuegos.
  - `public/locales/`: Archivos de internacionalización (i18n) en varios idiomas.
  - Otros archivos de configuración y dependencias.

## Tecnologías principales

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (scripts disponibles)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-leaflet](https://react-leaflet.js.org/) (mapas interactivos)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (drag and drop para React)

## Instalación y uso

1. Entra en la carpeta `aventura-multimateria`:
   ```bash
   cd aventura-multimateria
   ```
2. Instala las dependencias:
   ```bash
   npm install
   # o yarn install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o yarn dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts útiles

- `npm run dev` — Inicia el entorno de desarrollo
- `npm run build` — Compila la aplicación para producción
- `npm run start` — Inicia la app en modo producción
- `npm run lint` — Linter de código
- `npm run supabase:start` — Inicia Supabase local
- `npm run supabase:stop` — Detiene Supabase local
- `npm run db:reset` — Resetea la base de datos local
- `npm run db:push` — Aplica migraciones a la base de datos
- `npm run types:generate` — Genera tipos TypeScript desde Supabase
- `npm test` — Ejecuta los tests con Jest y React Testing Library

## Despliegue en Vercel

Puedes desplegar este proyecto fácilmente en [Vercel](https://vercel.com/):

1. Haz push de tu rama principal a GitHub.
2. Conecta tu repositorio en Vercel y selecciona la carpeta `aventura-multimateria` como raíz del proyecto si es necesario.
3. Vercel instalará automáticamente las dependencias y ejecutará el build.

Si ves errores de dependencias, asegúrate de que todas estén listadas en `package.json` y subidas a tu repositorio.

## Licencia

Este proyecto es de uso educativo y puede ser modificado según las necesidades del equipo.