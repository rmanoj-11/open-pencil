import type { ColumnDef } from '@tanstack/react-table'
import type { ComponentType } from 'react'

import type { Variable, VariableValue } from '@open-pencil/core/scene-graph'
import type { Color } from '@open-pencil/core/types'

export interface VariablesTableOptions {
  activeModes: { modeId: string; name: string }[]
  formatModeValue: (variable: Variable, modeId: string) => string
  parseVariableValue: (variable: Variable, raw: string) => VariableValue | undefined
  shortName: (variable: Variable) => string
  renameVariable: (id: string, newName: string) => void
  updateVariableValue: (id: string, modeId: string, value: VariableValue) => void
  removeVariable: (id: string) => void
  ColorInput: ComponentType<{ color: Color; onUpdate: (color: Color) => void }>
  icons: Record<string, ComponentType<any>>
  fallbackIcon: ComponentType<any>
  deleteIcon: ComponentType<any>
}

function commitNameEdit(options: VariablesTableOptions, variable: Variable, newName: string) {
  if (newName && newName !== variable.name) options.renameVariable(variable.id, newName)
}

function commitValueEdit(options: VariablesTableOptions, variable: Variable, modeId: string, newValue: string) {
  const parsed = options.parseVariableValue(variable, newValue)
  if (parsed !== undefined) options.updateVariableValue(variable.id, modeId, parsed)
}

export function createVariableColumns(options: VariablesTableOptions): ColumnDef<Variable>[] {
  const nameColumn: ColumnDef<Variable> = {
    id: 'name', header: 'Name', size: 200, minSize: 120, maxSize: 400,
    cell: ({ row }) => {
      const variable = row.original
      return { type: 'custom', render: () => null } as never
    }
  }

  const modeColumns: ColumnDef<Variable>[] = options.activeModes.map((mode) => ({
    id: `mode-${mode.modeId}`,
    header: mode.name,
    size: 200, minSize: 120, maxSize: 500
  }))

  const deleteColumn: ColumnDef<Variable> = {
    id: 'actions', header: '', size: 36, minSize: 36, maxSize: 36, enableResizing: false
  }

  return [nameColumn, ...modeColumns, deleteColumn]
}