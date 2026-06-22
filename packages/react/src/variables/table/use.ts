import { useMemo } from 'react'

import { createVariableColumns, type VariablesTableOptions } from '#react/variables/table/helpers'

export function useVariablesTable(options: VariablesTableOptions) {
  const columns = useMemo(() => createVariableColumns(options), [
    options.activeModes, options.formatModeValue, options.parseVariableValue,
    options.shortName, options.renameVariable, options.updateVariableValue, options.removeVariable
  ])
  return { columns }
}