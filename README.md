# app_minigames

Este repositorio contiene el proyecto **Aventura Multimateria**, una aplicación web de minijuegos educativos desarrollada con Next.js y React.

## Estructura del repositorio

- `aventura-multimateria/`: Código fuente de la aplicación principal.
  - `src/app/world/puerto-palabras/`: Minijuego "Puerto Palabras" y utilidades relacionadas.
  - `src/app/world/mision-mapamundi/`: Minijuego de mapa interactivo usando react-leaflet.
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

## Licencia

Este proyecto es de uso educativo y puede ser modificado según las necesidades del equipo.