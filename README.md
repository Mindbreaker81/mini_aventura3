# ExplorAventura 3: Minijuegos Educativos

Este repositorio contiene el proyecto **ExplorAventura 3**, una aplicación web de minijuegos educativos desarrollada con Next.js y React, optimizada para el aprendizaje interactivo.

## 🎮 Minijuegos Disponibles

- **Puerto de las Palabras**: Arrastra palabras a su categoría y practica ortografía
- **Bosc de Lectura**: Lee textos y responde preguntas para iluminar el bosque
- **Mercado de Números**: Resuelve problemas de dinero, tiempo y fracciones
- **Misión Mapamundi**: Practica geografía con mapas interactivos
- **Desafío STEAM**: Programa un robot explorador con bloques visuales
- **Laboratorio Flip-Ciencia**: Aprende ciencia con videos educativos y quiz

## 🏗️ Estructura del Proyecto

```
aventura-multimateria/
├── src/app/
│   ├── world/                    # Minijuegos
│   │   ├── puerto-palabras/      # Puerto de las Palabras
│   │   ├── bosc-lectura/         # Bosc de Lectura
│   │   ├── mercado-numeros/      # Mercado de Números
│   │   ├── mision-mapamundi-v2/  # Misión Mapamundi
│   │   ├── desafio-steam/        # Desafío STEAM
│   │   └── laboratorio-flip/     # Laboratorio Flip-Ciencia
│   ├── data/                     # Datos de configuración
│   ├── hooks/                    # Hooks personalizados
│   └── globals.css               # Estilos globales
├── public/
│   ├── locales/                  # Internacionalización (i18n)
│   └── *.geojson                 # Datos geográficos
└── package.json                  # Dependencias y scripts
```

## 🛠️ Tecnologías Principales

- **[Next.js](https://nextjs.org/)** 15 - Framework de React
- **[React](https://react.dev/)** 18 - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[Blockly](https://developers.google.com/blockly)** - Editor de bloques visuales
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado
- **[react-leaflet](https://react-leaflet.js.org/)** - Mapas interactivos
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 20.x o superior
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**:
   ```bash
   git clone <repository-url>
   cd mini_aventura3
   ```

2. **Instala las dependencias**:
   ```bash
   cd aventura-multimateria
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el entorno de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia en modo producción |
| `npm run lint` | Ejecuta el linter de código |
| `npm run supabase:start` | Inicia Supabase local |
| `npm run supabase:stop` | Detiene Supabase local |
| `npm run db:reset` | Resetea la base de datos |
| `npm run db:push` | Aplica migraciones |
| `npm run types:generate` | Genera tipos TypeScript |

## 🌐 Despliegue en Vercel

El proyecto está optimizado para despliegue automático en Vercel:

1. **Conecta tu repositorio** en [Vercel](https://vercel.com/)
2. **Selecciona la carpeta** `aventura-multimateria` como raíz del proyecto
3. **Vercel detectará automáticamente** la configuración de Next.js
4. **El despliegue se ejecutará** automáticamente en cada push a la rama principal

### Configuración de Vercel
- **Framework Preset**: Next.js
- **Root Directory**: `aventura-multimateria`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 🎯 Características Principales

- **Responsive Design**: Optimizado para móviles y tablets
- **Internacionalización**: Soporte multiidioma (ES, EN, CA)
- **Editor de Bloques**: Programación visual con Blockly
- **Mapas Interactivos**: Geografía con react-leaflet
- **Drag & Drop**: Interacciones intuitivas
- **Gestión de Estado**: Zustand para estado global
- **Optimización**: Lazy loading y code splitting

## 🔧 Configuración del Entorno

### Variables de Entorno
Crea un archivo `.env.local` en `aventura-multimateria/`:

```env
# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Configuración de Cursor
El proyecto incluye reglas personalizadas de Cursor en `.cursor/rules.json` para desarrollo optimizado.

## 📝 Licencia

Este proyecto es de uso educativo y puede ser modificado según las necesidades del equipo.

---

**Desarrollado con ❤️ para el aprendizaje interactivo**