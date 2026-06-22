import type { Editor } from '@open-pencil/core/editor'
import { BUILTIN_IO_FORMATS, IORegistry } from '@open-pencil/core/io'
import { MAX_EXPORT_SCALE, MIN_EXPORT_SCALE, clampExportScale } from '@open-pencil/core/scene-graph'
import type { ExportFormatId, ExportSetting, PluginDataEntry } from '@open-pencil/core/scene-graph'

export const EXPORT_SCALES = [0.5, 0.75, 1, 1.5, 2, 3, 4] as const
export const EXPORT_FORMATS: ExportFormatId[] = ['png', 'jpg', 'webp', 'svg', 'pdf']

export type ExportPanelTarget = 'selection' | 'page'

export { MIN_EXPORT_SCALE, MAX_EXPORT_SCALE, clampExportScale }

const io = new IORegistry(BUILTIN_IO_FORMATS)

export function createDefaultExportSetting(): ExportSetting {
  return { scale: 1, format: 'png' }
}

export function formatSupportsScale(format: ExportFormatId) {
  return io.getFormat(format)?.exportOptions?.scale ?? false
}

export function createExportTargetState(editor: Editor, getSelectedIds: () => string[]) {
  function hasSelection() { return getSelectedIds().length > 0 }
  function activeTarget(): ExportPanelTarget { return hasSelection() ? 'selection' : 'page' }
  function targetIds() {
    const ids = getSelectedIds()
    return ids.length > 0 ? ids : [editor.state.currentPageId]
  }
  function selectedNodeName() {
    const ids = editor.state.selectedIds
    if (ids.size === 1) {
      const id = [...ids][0]
      return editor.graph.getNode(id)?.name ?? 'Export'
    }
    if (ids.size > 1) return `${ids.size} layers`
    return null
  }
  function currentPageName() {
    const page = editor.graph.getNode(editor.state.currentPageId)
    return page?.name ?? 'Page'
  }
  function activeName() {
    return activeTarget() === 'selection' ? (selectedNodeName() ?? 'Export') : currentPageName()
  }
  function activeSettings() {
    void editor.state.sceneVersion
    const firstId = targetIds()[0]
    return firstId ? [...(editor.graph.getNode(firstId)?.exportSettings ?? [])] : []
  }
  function mixed() {
    void editor.state.sceneVersion
    const [firstId, ...otherIds] = targetIds()
    if (!firstId || otherIds.length === 0) return false
    const first = editor.graph.getNode(firstId)?.exportSettings ?? []
    return otherIds.some((id) => {
      const settings = editor.graph.getNode(id)?.exportSettings ?? []
      return !exportSettingsEqual(first, settings)
    })
  }

  return { hasSelection, activeTarget, targetIds, selectedNodeName, currentPageName, activeName, activeSettings, mixed }
}

function exportSettingsEqual(a: ExportSetting[], b: ExportSetting[]) {
  if (a.length !== b.length) return false
  return a.every((setting, index) => {
    const other = b[index]
    return setting.scale === other.scale && setting.format === other.format
  })
}

function nextExportSetting(settings: ExportSetting[]): ExportSetting {
  const last = settings.at(-1)
  if (!last) return createDefaultExportSetting()
  return { scale: clampExportScale(last.scale * 2), format: last.format }
}

const OPEN_PENCIL_PLUGIN_ID = 'open-pencil'
const EXPORT_SETTINGS_PLUGIN_KEY = 'exportSettings'

function syncExportSettingsPluginData(pluginData: PluginDataEntry[], settings: ExportSetting[]): PluginDataEntry[] {
  const without = pluginData.filter((e) => !(e.pluginId === OPEN_PENCIL_PLUGIN_ID && e.key === EXPORT_SETTINGS_PLUGIN_KEY))
  if (settings.length === 0) return without
  return [...without, { pluginId: OPEN_PENCIL_PLUGIN_ID, key: EXPORT_SETTINGS_PLUGIN_KEY, value: JSON.stringify(settings) }]
}

function updateEveryTarget(editor: Editor, getTargetIds: () => string[], label: string, update: (settings: ExportSetting[]) => ExportSetting[]) {
  editor.undo.runBatch(label, () => {
    for (const id of getTargetIds()) {
      const node = editor.graph.getNode(id)
      if (!node) continue
      const exportSettings = update(node.exportSettings)
      editor.updateNodeWithUndo(id, {
        exportSettings,
        pluginData: syncExportSettingsPluginData(node.pluginData, exportSettings)
      }, label)
    }
  })
}

export function createExportSettingActions(editor: Editor, getTargetIds: () => string[]) {
  function addSetting() {
    updateEveryTarget(editor, getTargetIds, 'Add export setting', (s) => [...s, nextExportSetting(s)])
  }
  function removeSetting(index: number) {
    updateEveryTarget(editor, getTargetIds, 'Remove export setting', (s) => s.filter((_, i) => i !== index))
  }
  function updateScale(index: number, scale: number) {
    updateEveryTarget(editor, getTargetIds, 'Update export scale', (s) => s.map((st, i) => i === index ? { ...st, scale: clampExportScale(scale) } : st))
  }
  function updateFormat(index: number, format: ExportFormatId) {
    updateEveryTarget(editor, getTargetIds, 'Update export format', (s) => s.map((st, i) => i === index ? { ...st, format } : st))
  }
  return {
    addSetting, removeSetting, updateScale, updateFormat,
    addSelectionSetting: addSetting, addPageSetting: addSetting,
    removeSelectionSetting: removeSetting, removePageSetting: removeSetting,
    updateSelectionScale: updateScale, updatePageScale: updateScale,
    updateSelectionFormat: updateFormat, updatePageFormat: updateFormat
  }
}