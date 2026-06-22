// Core re-exports
export type {
  Editor, EditorState, EditorOptions, EditorEvents, EditorEventName, Tool, EditorToolDef
} from '@open-pencil/core/editor'
export { createEditor, EDITOR_TOOLS, TOOL_SHORTCUTS } from '@open-pencil/core/editor'

// Editor context
export { EditorProvider, provideEditor, useEditor, EDITOR_KEY } from '#react/editor/context'
export type { EditorProviderProps } from '#react/editor/context'

// Events and viewport
export { useEditorEvent } from '#react/editor/events/use'
export { useViewportKind } from '#react/editor/viewport-kind/use'

// Reactivity bridge
export { useSceneComputed } from '#react/internal/scene-computed/use'
export { useSceneVersion, useSelectionIds, useRenderVersion, useCurrentPageId } from '#react/internal/scene-computed/use'
export { useNanoStore } from '#react/internal/use-nano-store'

// Selection
export { useSelectionState } from '#react/selection-state/use'
export { useSelectionCapabilities } from '#react/editor/selection-capabilities/use'

// Commands and menus
export { useEditorCommands } from '#react/editor/commands/use'
export { EDITOR_COMMAND_METADATA, editorCommandMetadata } from '#react/editor/commands/registry'
export { formatShortcut, shortcutPlatform } from '#react/editor/commands/shortcut'
export type { EditorCommandMetadata } from '#react/editor/commands/registry'
export type { ShortcutPlatform } from '#react/editor/commands/shortcut'
export type { EditorCommand, EditorCommandId, EditorCommandMenuEntry, EditorCommandMenuItem, EditorCommandMenuSeparator } from '#react/editor/commands/types'
export { useMenuModel } from '#react/editor/menu-model/use'
export type { MenuActionNode, MenuEntry, MenuSeparatorNode } from '#react/editor/menu-model/use'

// Editor shell helpers
export { useInlineRename } from '#react/editor/inline-rename/use'
export { toolCursor } from '#react/editor/tool-cursor'

// Canvas
export { useCanvas } from '#react/canvas/surface/use'
export type { UseCanvasOptions, CanvasRenderLayer } from '#react/canvas/surface/types'
export { CanvasRoot, CanvasSurface } from '#react/canvas/CanvasRoot'
export type { CanvasRootProps, CanvasRootSlotProps } from '#react/canvas/CanvasRoot'
export { CanvasContextProvider, provideCanvas, useCanvasContext, CANVAS_KEY } from '#react/canvas/context'
export type { CanvasContext } from '#react/canvas/context'
export { useCanvasInput } from '#react/canvas/useCanvasInput'
export { useCanvasVirtualReference } from '#react/canvas/overlays/useCanvasVirtualReference'
export { useTextEdit } from '#react/canvas/text-edit/use'
export { useCanvasDrop, extractImageFilesFromClipboard } from '#react/canvas/drop/use'

// Node props and helpers
export { useNodeProps, MIXED } from '#react/controls/node-props/use'
export type { MixedValue } from '#react/controls/node-props/helpers'
export { useSceneComputed as useScene } from '#react/internal/scene-computed/use'
export { usePropScrub } from '#react/controls/prop-scrub/use'

// Property-panel hooks
export { usePosition } from '#react/controls/position/use'
export { useLayout } from '#react/controls/layout/use'
export type { SizeLimitProp } from '#react/controls/layout/helpers'
export { useAppearance } from '#react/controls/appearance/use'
export { useTypography } from '#react/controls/typography/use'
export type { UseTypographyOptions } from '#react/controls/typography/use'
export { useExport } from '#react/document/export/use'
export type { ExportFormatId, ExportSetting } from '@open-pencil/core/scene-graph'
export type { ExportPanelTarget } from '#react/document/export/helpers'
export { useFillControls } from '#react/controls/fill/use'
export { useStrokeControls } from '#react/controls/stroke/use'
export { useEffectsControls } from '#react/controls/effects/use'
export { useOkHCL } from '#react/controls/okhcl/use'
export { useColorVariableBinding } from '#react/controls/color-variable-binding/use'
export { useNumberVariableBinding } from '#react/controls/number-variable-binding/use'
export type { NumberBindingPath } from '#react/controls/number-variable-binding/use'
export { useVariableBinding } from '#react/controls/variable-binding/use'
export type { VariableBindingState, UseVariableBindingOptions } from '#react/controls/variable-binding/use'
export { useUndoBatch } from '#react/controls/undo-batch/use'

// Variables
export { useVariables } from '#react/variables/use'
export { useVariablesDialogState } from '#react/variables/dialog/use'
export { useVariablesEditor } from '#react/variables/editor/use'
export { useVariablesTable } from '#react/variables/table/use'

// Pickers and page list
export { usePageList } from '#react/primitives/PageList/usePageList'
export { useFillPicker } from '#react/primitives/FillPicker/useFillPicker'
export { useGradientStops } from '#react/primitives/GradientEditor/useGradientStops'
export { useFontPicker } from '#react/primitives/FontPicker/useFontPicker'
export type { FontFamilyOption, FontPickerUi } from '#react/primitives/FontPicker/types'
export { useLayerDrag } from '#react/primitives/LayerTree/useLayerDrag'
export { useToolbarState } from '#react/primitives/Toolbar/useToolbarState'
export { useNodeFontStatus } from '#react/shared/font-status/use'

// Headless primitives — Canvas (already exported above)
// CanvasRoot, CanvasSurface, useCanvasContext already exported in Canvas section

// Headless primitives — LayerTree
export { LayerTreeRoot, LayerTreeItem } from '#react/primitives/LayerTree'
export type { LayerTreeRootProps, LayerTreeRootSlotProps, LayerTreeItemProps } from '#react/primitives/LayerTree'
export { LayerTreeProvider, useLayerTree, provideLayerTree, LAYER_TREE_KEY } from '#react/primitives/LayerTree'
export type { LayerTreeContext, LayerNode, LayerDragInstruction } from '#react/primitives/LayerTree'

// Headless primitives — PageList
export { PageListRoot } from '#react/primitives/PageList'
export type { PageListRootProps, PageListRootSlotProps } from '#react/primitives/PageList'

// Headless primitives — PropertyList
export { PropertyListRoot, PropertyListItem } from '#react/primitives/PropertyList'
export { PropertyListProvider, usePropertyList, providePropertyList, PROPERTY_LIST_KEY } from '#react/primitives/PropertyList'
export type { PropertyListContext } from '#react/primitives/PropertyList'

// Headless primitives — Toolbar
export { ToolbarRoot, ToolbarItem } from '#react/primitives/Toolbar'
export type { ToolbarRootProps, ToolbarRootSlotProps, ToolbarItemProps, ToolbarItemSlotProps } from '#react/primitives/Toolbar'
export { ToolbarProvider, useToolbar, provideToolbar, TOOLBAR_KEY } from '#react/primitives/Toolbar'
export type { ToolbarContext } from '#react/primitives/Toolbar'

// Headless primitives — ScrubInput
export { ScrubInputRoot, ScrubInputField, ScrubInputDisplay } from '#react/primitives/ScrubInput'
export { ScrubInputProvider, useScrubInput, provideScrubInput, SCRUB_INPUT_KEY } from '#react/primitives/ScrubInput'
export type { ScrubInputContext } from '#react/primitives/ScrubInput'

// Headless primitives — ColorPicker
export { ColorPickerRoot, ColorInputRoot } from '#react/primitives/ColorPicker'
export {
  createColorPickerModel, createOkHCLSliderGradientModel, createOkHCLSliderPreviewModel,
  createSliderGradientModel, createSliderPreviewModel,
  fromPercent, rekaToAppColor, toPercent,
  updateAlpha, updateHSBChannel, updateHSLChannel, updateHue, updateRGBChannel,
  applySolidFillColor, applySolidStrokeColor
} from '#react/primitives/ColorPicker'
export type { ColorFieldFormat, OkHCLControls } from '#react/primitives/ColorPicker'

// Headless primitives — FillPicker
export { FillPickerRoot } from '#react/primitives/FillPicker'
export type { FillPickerRootProps, FillPickerRootSlotProps } from '#react/primitives/FillPicker'

// Headless primitives — FontPicker
export { FontPickerRoot } from '#react/primitives/FontPicker'
export type { FontPickerRootProps, FontPickerRootSlotProps } from '#react/primitives/FontPicker'

// Headless primitives — GradientEditor
export { GradientEditorRoot, GradientEditorBar, GradientEditorStop } from '#react/primitives/GradientEditor'
export type { GradientEditorRootProps, GradientEditorRootSlotProps } from '#react/primitives/GradientEditor'

// Headless primitives — Controls
export { LayoutControlsRoot } from '#react/primitives/LayoutControls'
export { LayoutControlsProvider, useLayoutControlsContext, provideLayoutControls, LAYOUT_CONTROLS_KEY } from '#react/primitives/LayoutControls'
export type { LayoutControlsContext } from '#react/primitives/LayoutControls'

export { AppearanceControlsRoot } from '#react/primitives/AppearanceControls'
export { PositionControlsRoot } from '#react/primitives/PositionControls'
export { TypographyControlsRoot } from '#react/primitives/TypographyControls'

// DOM event helpers
export { blurTarget, inputNumberValue, inputValue, selectTarget } from '#react/shared/dom-events'

// i18n
export { useI18n } from '#react/i18n'
export { locale, localeSetting, setLocale, AVAILABLE_LOCALES, LOCALE_LABELS } from '#react/i18n'
export type { Locale } from '#react/i18n'
export {
  menuMessages, commandMessages, toolMessages, panelMessages,
  variableTypeMessages, pageMessages, dialogMessages
} from '#react/i18n'

// Testing helpers
export {
  acpPermissionOptionTestId, testId, testIdSelector,
  toolbarFlyoutItemTestId, toolbarFlyoutTestId, toolbarToolTestId,
  variablesAddTestId
} from '#react/testing/test-id'
export type {
  RequiredTestIdProps, TestId, TestIdProps, WithoutTestId,
  WithRequiredTestId, WithTestId
} from '#react/testing/test-id'
export { withTestId } from '#react/testing/with-test-id'

// Vue directive equivalent — in React, use the withTestId() HOC
export { withTestId as vTestId } from '#react/testing/with-test-id'