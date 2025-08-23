# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `npm start` - Start development server (runs renderer process with hot reload)
- `npm run build` - Build production version (builds both main and renderer processes)
- `npm run package` - Package app for distribution
- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run Jest tests
- `npm run format` - Format code with Prettier

### Specific Build Commands

- `npm run build:main` - Build main process only
- `npm run build:renderer` - Build renderer process only
- `npm run start:main` - Start main process in development mode
- `npm run start:renderer` - Start renderer process development server
- `npm run start:preload` - Build preload script in development mode

## Application Architecture

### Technology Stack

This is an Electron application built with:

- **Electron 20+** - Desktop app framework
- **React 18** - UI framework with functional components and hooks
- **TypeScript 4.7+** - Type-safe JavaScript with strict mode enabled
- **Redux Toolkit 1.8+** - State management with @reduxjs/toolkit
- **Webpack 5** - Module bundling and build system
- **SASS** - CSS preprocessing
- **React Router 6** - Client-side routing
- **AG Grid React 28** - Data grid component
- **React Toastify** - Toast notifications
- **Fast XML Parser** - XML parsing for .wcu file imports

### Project Structure

- `src/main/` - Electron main process (Node.js environment)

  - `main.ts` - Main application entry point, window management, file I/O
  - `menu.ts` - Application menu setup
  - `preload.ts` - Preload script for secure renderer communication
  - `util.ts` - Main process utilities and IPC channel definitions

- `src/renderer/` - React frontend (runs in Electron renderer process)

  - `App.tsx` - Main React application with React Router routing
  - `components/` - React components organized by feature
    - `Button/` - Reusable button component
    - `CardList/` - Main flashcard list view with grid layout
    - `EditCard/` - Form for creating/editing flashcards
    - `Study/` - Study mode interface with question/answer flow
    - `ErrorBoundary/` - Error boundary for graceful error handling
  - `hooks/` - Custom React hooks
    - `useCueCardOperations.ts` - Flashcard operations hook
    - `useFormInput.ts` - Form input management hook
    - `useWindowSize.ts` - Window size tracking hook
  - `types/` - TypeScript interface definitions
    - `cueCard.ts` - Core flashcard data models
    - `common.ts` - Common type definitions
    - `scroll.ts` - Scroll-related types
  - `util/` - Renderer utilities
    - `cueCard.ts` - Flashcard utility functions
    - `errorHandling.ts` - Error handling utilities
    - `layout.ts` - Layout calculation utilities
    - `scoring.ts` - Study scoring utilities
    - `validation.ts` - Form validation utilities
  - `constants.ts` - Application constants

- `src/redux/` - State management

  - `store.ts` - Redux store configuration
  - `cueCards.ts` - Main reducer with all flashcard logic
  - `hooks.ts` - Typed Redux hooks

- `src/__tests__/` - Test files
  - Component tests using React Testing Library
  - Redux slice tests
  - Utility function tests
  - `setup.ts` - Jest test configuration

### Core Application Logic

This is a **flashcards application** where users can:

1. Create, edit, and delete flashcards (cue cards)
2. Study flashcards with a question/answer format
3. Track study history and scores
4. Save/load flashcard sets to/from JSON files
5. Import .wcu files

### State Management Architecture

- **Redux Toolkit** manages all application state through a single `cueCards` slice
- Key state properties:
  - `cueCards: CueCard[]` - Array of flashcards
  - `filePath?: string` - Current file path
  - `isDirty: boolean` - Tracks unsaved changes
  - `studyMode?: StudyStatus` - Current study state (Question/Answer)
  - `studyCueCardIndex?: number` - Index of card being studied
  - `shouldScroll?: ScrollAction` - Scroll behavior control

### Core Data Models

- **CueCard** interface:
  - `id: string` - Unique identifier (UUID)
  - `question: string` - Question text
  - `answer: string` - Answer text
  - `history: string` - Study history tracking correct/incorrect responses
- **StudyStatus** enum: Question (0) or Answer (1) states

### Inter-Process Communication (IPC)

- Main and renderer processes communicate via IPC channels defined in `src/main/util.ts`
- State changes in renderer are sent to main process via `UpdateState` and `SetDirty` channels
- File operations (save/load/import) handled in main process with native dialog interactions
- Dirty state tracking prevents data loss on app closure with confirmation dialogs

### File Operations

- Flashcard sets saved as JSON files with .json extension
- Import functionality supports .wcu files (XML format) via fast-xml-parser
- Auto-save prompting when closing with unsaved changes
- File path tracking in Redux state and window title updates
- New file creation and file opening with dialog integration

### Component Architecture

- **App** - Main application shell with routing and window title management
- **CardList** - Main view showing all flashcards in a responsive grid layout
- **EditCard** - Form for creating/editing individual flashcards with validation
- **Study** - Study mode interface with question/answer flow and scoring
- **Button** - Reusable button component with consistent styling
- **ErrorBoundary** - Error boundary component for graceful error handling

### Custom Hooks

- **useCueCardOperations** - Handles flashcard CRUD operations
- **useFormInput** - Form input state management and validation
- **useWindowSize** - Window size tracking for responsive layouts

### Development Practices

- ESLint with Airbnb config, TypeScript, React, and Prettier rules
- Jest testing with React Testing Library and jsdom environment
- Husky git hooks with lint-staged for pre-commit quality checks
- TypeScript strict mode with comprehensive type definitions
- Functional React components with hooks pattern (no class components)
- CSS modules and SASS preprocessing
- Webpack configuration for both main and renderer processes

### Testing Strategy

- Component unit tests with React Testing Library
- Redux slice tests for state management logic
- Utility function tests for business logic
- Test coverage for form validation and error handling
- Mock implementations for Electron APIs in tests

### Build and Distribution

- Electron Builder for packaging across platforms (Windows, macOS, Linux)
- Cross-platform build support with architecture targeting
- Development hot reload for renderer process
- Production builds with code splitting and optimization

### Key Files to Understand

- `src/redux/cueCards.ts` - Complete state management and business logic
- `src/main/main.ts` - Electron main process, window management, and file I/O
- `src/renderer/App.tsx` - Main React application with routing and IPC
- `src/renderer/types/cueCard.ts` - Core data model definitions
- `src/main/util.ts` - IPC channel definitions and utility functions
