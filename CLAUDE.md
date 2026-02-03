# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tabasco is a guitar tablature editor built with React, TypeScript, and Vite. It provides an interactive interface for creating, editing, and managing guitar tabs with features like capo support, import/export, and drag-to-swap note editing. The app stores all data locally in the browser using IndexedDB (no backend required).

## Development Commands

### Build and Development
- `bun dev` - Start development server with hot module replacement
- `bun run build` - Type-check with TypeScript and build for production
- `bun run preview` - Preview production build locally

### Code Quality
- `bun run lint` - Run ESLint on the codebase
- `bun run biome` - Format code with Biome (only formats `./src` directory)

Note: Biome is configured with tab indentation and double quotes for JavaScript/TypeScript files. It excludes CSS, JSON, MD, and JS files from formatting.

## Architecture

### Data Flow Pattern
The app follows a unidirectional data flow:
1. User interaction in component (e.g., clicking a note cell)
2. Component calls handler from `useGuitarTab` hook
3. Hook checks lock state and updates local React state
4. Hook calls CRUD function to persist changes to IndexedDB
5. For some operations, uses `navigate()` to refresh via URL change
6. Components using `useLiveQuery` automatically re-render when database changes

### Data Layer - Dexie (IndexedDB)
The app uses Dexie.js for local browser storage of guitar tabs. The database schema is at `src/db/db.ts`:
- Database name: `TabInfo`
- Current version: 3
- Schema: `++id, tabName, position, capo`
- Default tab created on first initialization

CRUD operations are separated into individual files under `src/db/crud/`:
- `AddTab.ts` - Create new tabs
- `GetTab.ts` - Fetch tabs by position
- `UpdateTab.ts` - Update existing tabs (includes `updateTabNameByPosition`, `updateCurrentTabs`, `updateTabCapoByPosition`, `switchTwoNotesByPosition` for drag-to-swap, and `updateTabPositionById`)
- `DeleteTab.ts` - Remove tabs
- `ClearTab.ts` - Clear tab data
- `Export.ts` - Export tabs as JSON
- `Import.ts` - Import tabs from JSON

### Routing
React Router is configured in `src/main.tsx`:
- Default route: redirects to `/sheet/0`
- Active route: `/sheet/:tabPositionFromParam` - displays tab at specific position using `App.tsx`
- Experimental route: `/sheet/modern/:tabPositionFromParam` - alternative UI layout using `ModernApp.tsx`
- The `position` field in the database corresponds to the URL parameter (stored as strings)

### State Management

**Provider Pattern**:
All contexts are unified through `src/providers/Providers.tsx`, which wraps the app with `ThemeProvider` and `LockProvider`. This component initializes theme and lock state from localStorage and manages their state at the top level.

**Global Contexts** (defined in `src/contexts/`):
- `LockContext` - Controls edit locking to prevent accidental changes (persists to localStorage)
- `ThemeContext` - Dark/light theme support (persists to localStorage)

**Custom Hooks** (in `src/hooks/`):
- `useGuitarTab` - Main hook managing tab state and all tab operations (click, increment, add line, remove section, import/export, switch notes). Integrates with routing via `useParams` to sync with URL position parameter.
- `useCapo` - Manages capo position using `useLiveQuery` for reactive updates (-1 means no capo)
- `useTabOperations` - Additional tab operation utilities
- `useTabCreation` - Tab creation utilities

### Component Structure

**Main Application Flow**:
1. `main.tsx` - Entry point with routing setup and React Router configuration
2. `App.tsx` - Root component that uses `Providers` wrapper and renders tab editor UI
3. `providers/Providers.tsx` - Unified context provider (ThemeProvider + LockProvider)
4. `guitar-tab-creator.tsx` - Core tab editor component

**Key Components**:
- `GuitarTabCreator` (`guitar-tab-creator.tsx`) - Main tab editing interface
  - Divides tabs into sections of `NOTES_PER_SECTION` (54 notes)
  - Each section can be deleted via trash button (unless only one section remains)
  - Renders `StringRow` components for each of 6 guitar strings
  - `NoteCell` components handle individual note interactions:
    - Click to increment fret number
    - Right-click to toggle note state (-, 0, X)
    - Mouse down/up to swap notes via drag interaction
  - Uses `noteOnePosition` state to track drag-to-swap operations
- `TabName` - Editable tab name input
- `Capo` - Capo position selector
- `LockButton`/`LockSwitcher` - Toggle for edit lock with visual feedback
- `SettingsMenu` - Settings dropdown with import/export, theme, clear, delete options
- `BreadCrumbs` - Navigation breadcrumbs
- `ThemeSwitcher` - Dark/light theme toggle

**UI Components** (`src/components/ui/`):
- Built with Radix UI primitives and styled with Tailwind CSS
- Custom button variants defined in `buttonVariants.tsx`
- Components follow shadcn/ui patterns

### Constants (`src/constants/guitar-tab.ts`)
- `STRINGS = 6` - Number of guitar strings
- `DEFAULT_NOTE = "-"` - Empty/unplayed note
- `OPEN_STRING = "0"` - Open string notation
- `MUTED_STRING = "X"` - Muted string notation
- `MAX_FRET = 24` - Maximum fret number
- `NOTES_PER_SECTION = 54` - Notes displayed per visual section

### Types (`src/types/guitar-tab.ts`)
Central type definitions for the tab system:
- `TabInfo` - Database entity shape (id, tabName, tabs, position, capo)
- `Tab` - 2D array representing the entire tablature
- `TabString` - Array of notes for one string
- `NoteValue` - Union type for note values
- `NoteCellPosition` - Position coordinates (string, position)
- `TabOperations` - Interface for all tab manipulation functions

### Note Interaction Behavior
- **Left click**: Increment fret number (cycles: `-` → `1` → `2` → ... → `24` → `-`)
- **Right click**: Toggle note state (cycles: `-` → `0` → `X` → `-`)
- **Drag**: Click and hold on one note, release on another to swap their positions
- **`X`**: Muted string notation (not playable)

### Import/Export Format
JSON structure for tabs:
```json
{
  "tabName": "Song Name",
  "tabs": [
    ["array", "of", "notes", "for", "string", "1"],
    ["array", "of", "notes", "for", "string", "2"],
    ...
  ],
  "capo": -1
}
```

## Important Notes

- The app uses `@` path alias for `./src` (configured in `vite.config.ts` and `tsconfig.json`)
- Tab positions are stored as strings in the database and used directly in URL routing
- Lock state and theme preference are both persisted to localStorage to survive page refreshes
- The app includes Vercel Analytics integration
- All state updates that modify tab data trigger database writes via CRUD operations
- The `useGuitarTab` hook handles lock checks before allowing edit operations and triggers visual feedback when locked
- Database transactions are used for atomic operations like note swapping and position updates
