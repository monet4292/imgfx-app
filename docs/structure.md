# Structure: Architecture & Layout

Architecture & major components
- Client pages (`src/pages/*.tsx`): main UI lives in `src/pages/index.tsx` (uses `CookieContext` and `src/components/*`).
- API routes (`src/pages/api/*.ts`): thin server-side endpoints — `generate.ts` is the primary route that proxies to `ImageFX`.
- Core library (`src/lib/core/*`): `ImageFX.ts`, `Account.ts`, `Prompt.ts`, and `Image.ts` encapsulate network calls, request shapes, error types, and models.
- Helpers & state: `src/context/CookieContext.tsx` (cookie management), `src/lib/history.ts` (localStorage history), `src/lib/utils.ts` (className helper).

Entry points & runtime files
- Client entry: `src/pages/index.tsx` (UI + API client).  
- Server/API entry: `src/pages/api/generate.ts` (constructs `Prompt`, calls `ImageFX`).
- Core business logic: `src/lib/core/ImageFX.ts` (main class used by API routes). 

Folder layout (top-level)
- `src/pages/` — Next.js pages and API routes.  
- `src/components/` — UI components and primitives under `ui/` (Radix + Tailwind based).
- `src/lib/core/` — core domain classes and types interacting with external APIs.
- `src/context/` — React contexts (cookie).  
- `src/lib/` — small utilities (history, utils).

Key configs
- `package.json` scripts: `dev` (`next dev --webpack`), `build` (`next build --webpack`), `start`, `lint`.  
- `tsconfig.json`: path alias `@/*` → `./src/*` (use `@/...` imports).  
- Lint: `eslint` configured via `eslint-config-next`.  
- No test runner or test scripts present by default.

Dependencies between modules
- UI → `CookieContext` (reads cookie) → sends cookie to API.  
- API routes → `src/lib/core/*` classes (Account, Prompt, ImageFX) → external services.  
- `DefaultHeader` in `Constants.ts` is a shared `Headers` object used by `Account` and `ImageFX`.

Where to add new features
- UI changes: add components under `src/components/` and pages under `src/pages/`.  
- API changes: add files in `src/pages/api/` that construct and call `ImageFX` or extend `Account` as necessary.  
- New core behaviors: extend `Prompt.ts` or add methods to `ImageFX.ts` while keeping network logic inside `src/lib/core`.

CI / pre-merge checks
- No CI workflows detected in repository (`.github/workflows` not present). Recommend adding a GitHub Actions workflow that runs `npm ci`, `npm run lint`, and `npm run build` on PRs.
# Web Interface Structure

## Architecture & Components
The web application follows a standard Next.js Pages Router architecture with a component-based design:

### Core Pages
- **index.tsx**: Main image generation interface
  - Form with prompt input, model selection, and generation options
  - Real-time image display and download functionality
  - Integration with generation API endpoint

- **caption.tsx**: Image captioning interface
  - Drag-and-drop file upload with preview
  - Integration with caption API endpoint
  - Display of generated captions

- **gallery.tsx**: Local gallery management
  - Display of generation history from local storage
  - Image management (view, download, delete)
  - History clearing functionality

### API Routes
- **api/generate.ts**: Backend for image generation
  - Handles POST requests with generation parameters
  - Integrates with imgfx-api library
  - Returns base64-encoded images

- **api/caption.ts**: Backend for image captioning
  - Processes uploaded images
  - Calls imgfx-api caption generation
  - Returns generated text descriptions

- **api/fetch.ts**: Backend for fetching images by ID
  - Retrieves previously generated images
  - Handles media ID lookups

### Core Components
- **Layout.tsx**: Main application layout
  - Navigation between pages
  - Cookie management dialog
  - Responsive header with settings

- **UI Components** (components/ui/):
  - Reusable Radix UI components with custom styling
  - Button, Card, Dialog, Input, Label, Select, Tabs, Textarea
  - Consistent design system across the application

### Context & State Management
- **CookieContext.tsx**: Authentication state management
  - Global cookie state across the application
  - Local storage persistence
  - Configuration validation

### Utilities
- **history.ts**: Gallery history management
  - Local storage operations for generated images
  - CRUD operations for history items
  - Data structure for history entries

- **utils.ts**: Shared utility functions
  - Helper functions used across components

## Entry Points
- **Application**: `pages/_app.tsx` (App configuration with providers)
- **Pages**: Individual page components in `pages/` directory
- **API**: Server-side endpoints in `pages/api/` directory

## Folder Layout
- `src/pages/`: React page components and API routes
- `src/components/`: Reusable UI components
- `src/context/`: React Context providers
- `src/lib/`: Utility functions and helpers
- `src/styles/`: Global CSS and styling
- `public/`: Static assets
- `docs/`: Documentation files

## Key Configurations
- **Next.js**: `next.config.ts` (Next.js configuration)
- **TypeScript**: `tsconfig.json` (TypeScript configuration)
- **Tailwind**: `tailwind.config.js` (Styling configuration)
- **Package**: `package.json` (Dependencies and scripts)

## Dependencies
- **Runtime**: React, Next.js, Radix UI components
- **Styling**: Tailwind CSS, class-variance-authority, clsx, tailwind-merge
- **Icons**: Lucide React
- **API Integration**: @monet4292/imgfx-api (local package)
- **Utilities**: UUID for unique ID generation

## Data Flow
1. User interacts with UI components
2. State managed through React Context
3. API calls made to Next.js API routes
4. API routes use imgfx-api library to communicate with Google
5. Results returned to UI for display
6. Generated content stored in browser local storage

## Component Dependencies
- Pages depend on Layout and UI components
- Layout depends on CookieContext
- API routes depend on imgfx-api library
- Gallery depends on history utility functions
- All pages depend on CookieContext for authentication

## Build & Deployment
- **Development**: `npm run dev` (Next.js development server)
- **Production**: `npm run build` (Optimized production build)
- **Start**: `npm start` (Production server)
- **Linting**: `npm run lint` (Code quality checks)
