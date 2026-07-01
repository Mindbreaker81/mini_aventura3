# ExplorAventura 3

El código activo del proyecto está en **`aventura-multimateria/`**.

```bash
cd aventura-multimateria
npm install
npm run dev
```

### `package.json` en la raíz

El archivo `/package.json` del repositorio es un **contenedor legacy** con scripts de conveniencia (`npm run dev` redirige al subproyecto). **No instala dependencias de la app.** Siempre usa `aventura-multimateria/` como directorio de trabajo (CI, Vercel, desarrollo).

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [aventura-multimateria/README.md](./aventura-multimateria/README.md) | Guía principal del proyecto |
| [aventura-multimateria/docs/GAME_ARCHITECTURE.md](./aventura-multimateria/docs/GAME_ARCHITECTURE.md) | Arquitectura de minijuegos |
| [aventura-multimateria/docs/PHASE7_NEW_GAMES_PLAN.md](./aventura-multimateria/docs/PHASE7_NEW_GAMES_PLAN.md) | Plan Fase 7 (3 juegos nuevos, v3.2.0) |
| [aventura-multimateria/CHANGELOG.md](./aventura-multimateria/CHANGELOG.md) | Historial de versiones |

**Estado:** 10 minijuegos en producción (v3.2.0).
