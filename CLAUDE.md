# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **ExplorAventura 3**, an educational web application featuring 6 interactive mini-games built with Next.js 15 and React 18. The application is designed for primary school students with a focus on Spanish/Catalan education across multiple subjects.

## Architecture

The project follows a monorepo structure with the main application in `aventura-multimateria/`:

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand stores for each mini-game with persistence
- **Internationalization**: next-i18next with support for Spanish (es), Catalan (ca), and English (en)
- **Backend**: Supabase integration for data persistence (optional)
- **Styling**: Tailwind CSS with custom game-specific themes
- **Specialized Libraries**: Blockly for visual programming, react-leaflet for maps, react-player for videos

### Key Components

1. **Dashboard** (`src/app/page.tsx`): Main landing page displaying all 6 mini-games
2. **Mini-games**: Located in `src/app/world/[game-name]/`
   - `puerto-palabras/`: Drag-and-drop word categorization game
   - `bosc-lectura/`: Reading comprehension game with LED progress
   - `mercado-numeros/`: Math problems (money, time, fractions)
   - `mision-mapamundi-v2/`: Interactive geography with maps
   - `desafio-steam/`: Visual programming with Blockly
   - `laboratorio-flip/`: Science lessons with videos and quizzes
3. **Data**: Game configurations and content in `src/app/data/`
4. **Stores**: Zustand stores for game state management with localStorage persistence
5. **Hooks**: Shared navigation and utility hooks

### Game Architecture Pattern

Each mini-game follows this consistent structure:
- `page.tsx`: Main game page component with navigation
- `use[GameName]Store.ts`: Zustand store for state management with persistence
- `types.ts`: TypeScript interfaces and types
- `[GameComponent].tsx`: Main game component
- Data files in `src/app/data/` directory

## Development Commands

**Working Directory**: Always work within `aventura-multimateria/` directory

```bash
# Development
npm run dev                 # Start development server on http://localhost:3000
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database (Supabase - optional)
npm run supabase:start     # Start local Supabase instance
npm run supabase:stop      # Stop local Supabase instance
npm run db:reset           # Reset local database
npm run db:push            # Push database changes
npm run types:generate     # Generate TypeScript types from Supabase schema
```

## Game Data Structure

Games are configured through JSON files in `src/app/data/`:
- `puerto-words.json`: Word data for Puerto Palabras game (50+ words categorized)
- `bosc-passages.json`: Reading passages for Bosc Lectura game (15+ texts with questions)
- `mercado-tasks.json`: Math problems for Mercado Numeros (100+ problems)
- `mapamundi-tasks.json`: Geographic data for Mapamundi game
- `steam-tasks.json`: Programming challenges for STEAM game (6 levels)
- `flip-lessons.json`: Science lessons for Laboratorio Flip (16 lessons)

## State Management

Each game uses Zustand for state management with consistent patterns:
- **Base State**: XP, score, current level, game status
- **Persistence**: Automatic localStorage saving with selective persistence
- **Feedback System**: Success/error messages with animations
- **Progress Tracking**: Level completion, badges, achievements
- **Game-specific Mechanics**: Drag-and-drop, map interactions, code execution

### Store Pattern Example:
```typescript
interface GameStore extends BaseGameState {
  // Game-specific state
  currentWords: WordItem[];
  score: number;
  xp: number;
  
  // Common functions
  initializeGame: () => void;
  awardXP: (amount: number) => void;
  showFeedback: (success: boolean, message: string) => void;
  
  // Game-specific functions
  dropWord: (wordId: number, category: string) => void;
}
```

## Mini-Games Overview

### 1. Puerto de las Palabras
- **Subject**: Grammar and word categorization
- **Mechanics**: Drag-and-drop words into grammatical categories
- **Files**: `usePuertoPalabrasStore.ts`, `dragdrop-utils.ts`
- **Data**: `puerto-words.json`

### 2. Bosc de Lectura
- **Subject**: Reading comprehension
- **Mechanics**: Read texts and answer multiple-choice questions
- **Files**: `useBoscLecturaStore.ts`, `ReadingGame.tsx`
- **Data**: `bosc-passages.json`

### 3. Mercado de Números
- **Subject**: Applied mathematics
- **Mechanics**: Solve money, time, and fraction problems
- **Files**: `useMercadoNumerosStore.ts`, `PaymentChallenge.tsx`, `TimeChallenge.tsx`, `FractionChallenge.tsx`
- **Data**: `mercado-tasks.json`

### 4. Misión Mapamundi
- **Subject**: Geography
- **Mechanics**: Locate countries, continents, and Spanish regions on interactive maps
- **Files**: `useMapamundiV2Store.ts`, `WorldMap.tsx`, `SpainMap.tsx`, `Passport.tsx`
- **Data**: `mapamundi-tasks.json`

### 5. Desafío STEAM
- **Subject**: Programming and computational thinking
- **Mechanics**: Program a robot using visual blocks
- **Files**: `useSteamStore.ts`, `BlocklyGame.client.tsx`, `RobotBoard.tsx`, `blocks.ts`
- **Data**: `steam-tasks.json`
- **Special**: Client-side only rendering to avoid SSR issues

### 6. Laboratorio Flip
- **Subject**: Science
- **Mechanics**: Watch educational videos and answer quizzes
- **Files**: `useLaboratorioFlipStore.ts`, `VideoCard.tsx`, `Quiz.tsx`
- **Data**: `flip-lessons.json`

## Internationalization

The app supports multiple languages with files in `public/locales/[locale]/common.json`:
- `es` (Spanish) - Default locale
- `ca` (Catalan)
- `en` (English)

Translation keys follow the pattern: `game.feature.specific_key`

## Key Technologies

- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Zustand**: State management with persistence
- **Tailwind CSS**: Styling with custom themes
- **Blockly**: Visual programming editor
- **react-leaflet**: Interactive maps
- **react-player**: Video playback
- **@hello-pangea/dnd**: Drag and drop functionality
- **Supabase**: Backend as a Service (optional)
- **next-i18next**: Internationalization
- **Lucide React**: Icons

## Development Guidelines

### Adding New Games
1. Create directory in `src/app/world/[game-name]/`
2. Implement store with Zustand pattern
3. Create main page component
4. Add game data to `src/app/data/`
5. Update dashboard in `src/app/page.tsx`
6. Add translations to locale files

### Code Quality
- Run `npm run lint` before committing changes
- Type checking is handled by TypeScript compiler
- Build verification with `npm run build`
- Follow existing patterns for consistency

### Performance Considerations
- Use dynamic imports for heavy libraries (Blockly, ReactPlayer)
- Implement lazy loading for game components
- Optimize images and assets
- Use React.memo for expensive components

## Recent Updates

- **STEAM v1 Removal**: Eliminated duplicate STEAM game, keeping only the improved v2 version
- **Code Cleanup**: Removed obsolete files and dependencies
- **Documentation Update**: Comprehensive README and technical documentation
- **Performance Optimization**: Improved loading and rendering performance