# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Aventura Multimateria**, an educational web application featuring educational mini-games built with Next.js 15 and React 19. The application is designed for language learning with a focus on Spanish/Catalan education.

## Architecture

The project follows a monorepo structure with the main application in `aventura-multimateria/`:

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand stores for each mini-game
- **Internationalization**: next-i18next with support for Spanish (es), Catalan (ca), and English (en)
- **Backend**: Supabase integration for data persistence
- **Styling**: Tailwind CSS with custom game-specific themes

### Key Components

1. **Dashboard** (`src/app/page.tsx`): Main landing page displaying available mini-games
2. **Mini-games**: Located in `src/app/world/[game-name]/`
   - `puerto-palabras/`: Drag-and-drop word categorization game
   - `bosc-lectura/`: Reading comprehension game
3. **Data**: Game configurations and content in `src/app/data/`
4. **Stores**: Zustand stores for game state management

### Game Architecture Pattern

Each mini-game follows this structure:
- `page.tsx`: Main game page component
- `use[GameName]Store.ts`: Zustand store for state management
- `[game-specific-utils].ts`: Game-specific utilities and types
- Data files in `src/app/data/` directory

## Development Commands

**Working Directory**: Always work within `aventura-multimateria/` directory

```bash
# Development
npm run dev                 # Start development server on http://localhost:3000
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database (Supabase)
npm run supabase:start     # Start local Supabase instance
npm run supabase:stop      # Stop local Supabase instance
npm run db:reset           # Reset local database
npm run db:push            # Push database changes
npm run types:generate     # Generate TypeScript types from Supabase schema
```

## Game Data Structure

Games are configured through JSON files in `src/app/data/`:
- `minigames_config.json`: Game metadata and configuration
- `puerto-words.json`: Word data for Puerto Palabras game
- `bosc-passages.json`: Reading passages for Bosc Lectura game

## State Management

Each game uses Zustand for state management with common patterns:
- Game progress tracking (XP, levels, completion)
- User feedback handling
- Game-specific mechanics (drag-and-drop, reading comprehension)

## Internationalization

The app supports multiple languages with files in `public/locales/[locale]/common.json`:
- `es` (Spanish) - Default locale
- `ca` (Catalan)
- `en` (English)

Translation keys follow the pattern: `game.feature.specific_key`

## Testing and Quality

- Run `npm run lint` before committing changes
- Type checking is handled by TypeScript compiler
- Build verification with `npm run build`

## Key Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Supabase**: Backend as a Service
- **next-i18next**: Internationalization
- **Lucide React**: Icons