# @open-pencil/react architecture

## Folder conventions

Mirrors the Vue SDK folder layout where applicable. Differences are noted below.

- `canvas/` — canvas surface, context, and the `CanvasRoot`/`CanvasSurface` headless components
- `editor/context/` — editor dependency injection (`EditorProvider`, `useEditor`)
- `editor/events/` — editor event subscription hook (`useEditorEvent`)
- `editor/viewport-kind/` — responsive viewport kind hook (`useViewportKind`)
- `internal/` — cross-cutting internals (`createContext` factory, `useSceneComputed` reactivity bridge)
- `selection-state/` — selection-derived state hook (`useSelectionState`)

## Reactivity bridge

The Vue SDK relies on Vue's reactivity system (`computed`, `watch`, `watchEffect`) reading `editor.state.sceneVersion` to trigger re-evaluation. React has no equivalent auto-tracking reactivity, so this SDK uses `useSyncExternalStore` (React 18) to subscribe to the editor's typed event bus and snapshot mutable state.

`useSceneComputed(fn)` subscribes to all scene-affecting events (`render:requested`, `repaint:requested`, `graph:replaced`, `selection:changed`, `tool:changed`, `page:changed`, `viewport:changed`, `node:*`) and memoizes `fn()` with `useMemo`, keyed on `sceneVersion`, `selectedIds`, and `currentPageId` snapshots.

Lower-level hooks (`useSceneVersion`, `useSelectionIds`, `useRenderVersion`, `useCurrentPageId`) are also exported for granular subscriptions.

## Context system

Vue's `provide`/`inject` with `InjectionKey` symbols maps to React's `createContext` + `useContext`. The generic `createContext<T>(name)` factory in `internal/create-context.tsx` returns `[useCtx, Provider, Context]` — a React-idiomatic equivalent of the Vue factory.

Each primitive domain (Editor, Canvas) has its own context module exporting a Provider component, a `useXxxContext()` hook, and (for backward-compatibility naming) a `provideXxx` function that returns a Provider wrapper component.

## Naming conventions

- Composable (hook) filenames match export names: `useSelectionState.ts`, `useCanvas.ts`
- Structural primitives follow the compound component pattern: `CanvasRoot`, `CanvasSurface`
- React components use `.tsx` extension; pure logic/hooks use `.ts`
- Context modules export a typed `Context` object, a `Provider` component, and a `useXxxContext()` hook

## Public API guidance

- Export stable, intentional entry points from `src/index.ts`
- Prefer hooks for editor/property-panel logic
- Prefer compound components for headless UI primitives with internal coordination
- `*Root` components accept both `children` (compound) and `children(props)` (render-prop) patterns for ergonomic migration from Vue's `v-slot`

## Pending

See README.md "Roadmap / Pending" section for the full list of Vue SDK exports not yet ported.