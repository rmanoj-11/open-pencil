# @open-pencil/react

Headless React SDK for building OpenPencil-powered editors.

`@open-pencil/react` sits on top of `@open-pencil/core` and provides:

- React editor context via `<EditorProvider>` / `useEditor()`
- canvas integration via `useCanvas()`
- reactive selection state via `useSelectionState()`
- headless structural primitives like `<CanvasRoot>` and `<CanvasSurface>`
- a reactivity bridge (`useSceneComputed`, `useSceneVersion`, `useSelectionIds`) built on `useSyncExternalStore`

The SDK is headless by design: it provides logic and structure, while your app owns styling and product-specific UI.

## Status

**Full parity with `@open-pencil/vue`.** This package is a complete React equivalent of `@open-pencil/vue`. All 160 Vue SDK exports have React counterparts.

### Implemented — Full Parity

| Category | APIs | Status |
|----------|------|--------|
| Editor context | `EditorProvider`, `useEditor`, `provideEditor`, `EDITOR_KEY` | ✅ |
| Reactivity bridge | `useSceneComputed`, `useSceneVersion`, `useSelectionIds`, `useRenderVersion`, `useCurrentPageId`, `useNanoStore` | ✅ |
| Events | `useEditorEvent` | ✅ |
| Viewport | `useViewportKind` | ✅ |
| Selection | `useSelectionState`, `useSelectionCapabilities` | ✅ |
| Commands | `useEditorCommands`, `EDITOR_COMMAND_METADATA`, `editorCommandMetadata`, `formatShortcut`, `shortcutPlatform` | ✅ |
| Menus | `useMenuModel` | ✅ |
| Canvas | `useCanvas`, `useCanvasInput`, `useCanvasVirtualReference`, `useTextEdit`, `useCanvasDrop`, `extractImageFilesFromClipboard` | ✅ |
| Canvas components | `CanvasRoot`, `CanvasSurface`, `useCanvasContext`, `CanvasContextProvider` | ✅ |
| Node props | `useNodeProps`, `MIXED`, `useSceneComputed`, `usePropScrub` | ✅ |
| Property panels | `usePosition`, `useLayout`, `useAppearance`, `useTypography`, `useExport` | ✅ |
| Fill/Stroke/Effects | `useFillControls`, `useStrokeControls`, `useEffectsControls`, `useOkHCL` | ✅ |
| Variable binding | `useColorVariableBinding`, `useNumberVariableBinding`, `useVariableBinding` | ✅ |
| Undo | `useUndoBatch` | ✅ |
| Variables | `useVariables`, `useVariablesDialogState`, `useVariablesEditor`, `useVariablesTable` | ✅ |
| Pickers | `useFillPicker`, `useGradientStops`, `useFontPicker`, `usePageList` | ✅ |
| Headless primitives | `LayerTreeRoot/Item`, `PageListRoot`, `PropertyListRoot/Item`, `ToolbarRoot/Item`, `ScrubInput*`, `ColorPickerRoot`, `FillPickerRoot`, `FontPickerRoot`, `GradientEditor*`, `LayoutControlsRoot`, `AppearanceControlsRoot`, `PositionControlsRoot`, `TypographyControlsRoot` | ✅ |
| Contexts | Canvas, LayerTree, Toolbar, PropertyList, ScrubInput, LayoutControls | ✅ |
| i18n | `useI18n`, `locale`, `localeSetting`, `setLocale`, `AVAILABLE_LOCALES`, `LOCALE_LABELS` + all message stores | ✅ |
| Testing | `testId`, `testIdSelector`, `withTestId`/`vTestId`, all test ID helpers | ✅ |
| DOM helpers | `inputValue`, `inputNumberValue`, `blurTarget`, `selectTarget` | ✅ |
| Shell helpers | `useInlineRename`, `toolCursor`, `useNodeFontStatus`, `useLayerDrag`, `useToolbarState` | ✅ |

## Install

```sh
bun add @open-pencil/react @open-pencil/core canvaskit-wasm
# peer deps:
bun add react react-dom
```

## Quick start

```tsx
'use client'

import { createEditor } from '@open-pencil/react'
import { EditorProvider, CanvasRoot, CanvasSurface } from '@open-pencil/react'

const editor = createEditor({
  width: 1200,
  height: 800,
})
editor.createShape('RECTANGLE', 100, 100, 200, 150)
editor.zoomToFit()

export default function App() {
  return (
    <EditorProvider editor={editor}>
      <div style={{ height: '100vh' }}>
        <CanvasRoot>
          <CanvasSurface style={{ width: '100%', height: '100%' }} />
        </CanvasRoot>
      </div>
    </EditorProvider>
  )
}
```

## Core concepts

### Editor context

Wrap your React subtree once with `<EditorProvider>`:

```tsx
<EditorProvider editor={editor}>
  {/* child components can call useEditor() */}
</EditorProvider>
```

Read the editor anywhere below with `useEditor()`:

```tsx
const editor = useEditor()
```

### Canvas wiring

`<CanvasRoot>` is a headless provider that sets up the CanvasKit rendering surface and provides canvas context to children. It accepts either children or a render-prop:

```tsx
// Compound component pattern
<CanvasRoot>
  <CanvasSurface style={{ width: '100%', height: '100%' }} />
</CanvasRoot>

// Render-prop pattern (slot props, like Vue's v-slot)
<CanvasRoot>
  {({ canvasRef, ready }) => (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  )}
</CanvasRoot>
```

### Reactive selection state

```tsx
const { hasSelection, selectedCount, selectedNode, selectedNodeType } = useSelectionState()
```

This hook uses `useSyncExternalStore` under the hood to subscribe to editor scene/selection events, ensuring concurrent-safe reactivity.

### Reactivity bridge

The `useSceneComputed` hook is the React equivalent of Vue's `useSceneComputed` + reactive `computed()`. It subscribes to `sceneVersion`, `selectedIds`, and `currentPageId` via `useSyncExternalStore` and memoizes the return value:

```tsx
const myDerived = useSceneComputed(() => {
  // reads from editor.state / editor.graph
  return editor.graph.getNodeCount()
})
```

Lower-level hooks are also exported: `useSceneVersion()`, `useSelectionIds()`, `useRenderVersion()`, `useCurrentPageId()`.

## Next.js integration

CanvasKit requires a client-side environment (WASM + WebGL). In Next.js App Router, mark canvas components as client components:

```tsx
'use client'

import { CanvasRoot, CanvasSurface } from '@open-pencil/react'
```

The library itself ships ESM with `"sideEffects": false` so server bundles can tree-shake canvas code. See `packages/react/example/` for a working Next.js example.

## Documentation

For fuller guides and API docs (Vue-specific but conceptually equivalent), see the documentation site:
- `packages/docs/programmable/sdk/`

## Example app

Run the included Next.js example:

```sh
cd packages/react/example
bun install
bun run dev
```

## License

MIT