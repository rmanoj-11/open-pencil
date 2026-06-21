'use client'

import { useMemo } from 'react'
import { createEditor } from '@open-pencil/react'
import {
  EditorProvider,
  CanvasRoot,
  CanvasSurface,
  useSelectionState,
  useEditor
} from '@open-pencil/react'
import type { Editor } from '@open-pencil/core/editor'

function createDemoEditor(): Editor {
  const editor = createEditor({
    width: 1200,
    height: 800,
  })
  editor.createShape('FRAME', 100, 100, 400, 300)
  editor.createShape('RECTANGLE', 150, 150, 200, 150)
  editor.createShape('ELLIPSE', 450, 200, 120, 120)
  editor.zoomToFit()
  return editor
}

function SelectionInfo() {
  const { hasSelection, selectedCount, selectedNodeType } = useSelectionState()

  return (
    <div style={styles.panel}>
      <h3 style={styles.h3}>Selection</h3>
      <p style={styles.p}>Has selection: {hasSelection ? 'Yes' : 'No'}</p>
      <p style={styles.p}>Count: {selectedCount}</p>
      <p style={styles.p}>Type: {selectedNodeType ?? '—'}</p>
    </div>
  )
}

function Toolbar() {
  const editor = useEditor()
  const tools = useMemo(
    () => [
      { id: 'SELECT', label: 'Select' },
      { id: 'FRAME', label: 'Frame' },
      { id: 'RECTANGLE', label: 'Rectangle' },
      { id: 'ELLIPSE', label: 'Ellipse' },
      { id: 'TEXT', label: 'Text' },
      { id: 'HAND', label: 'Hand' },
    ] as const,
    []
  )

  return (
    <div style={styles.toolbar}>
      {tools.map((tool) => (
        <button
          key={tool.id}
          style={styles.toolBtn}
          onClick={() => editor.setTool(tool.id)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const editor = useMemo(() => createDemoEditor(), [])

  return (
    <EditorProvider editor={editor}>
      <div style={styles.app}>
        <div style={styles.topBar}>
          <h2 style={styles.title}>OpenPencil — React SDK Example</h2>
          <Toolbar />
        </div>
        <div style={styles.body}>
          <CanvasRoot>
            <CanvasSurface style={styles.canvas} />
          </CanvasRoot>
          <div style={styles.sidebar}>
            <SelectionInfo />
          </div>
        </div>
      </div>
    </EditorProvider>
  )
}

const styles: Record<string, React.CSSProperties> = {
  app: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, sans-serif' },
  topBar: { display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
  title: { fontSize: 14, margin: 0, fontWeight: 600 },
  toolbar: { display: 'flex', gap: 4 },
  toolBtn: { padding: '4px 10px', fontSize: 12, border: '1px solid #d0d0d0', borderRadius: 4, background: '#fff', cursor: 'pointer' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  canvas: { width: '100%', height: '100%', display: 'block' },
  sidebar: { width: 240, borderLeft: '1px solid #e0e0e0', padding: 12, overflow: 'auto', background: '#fff' },
  panel: { marginBottom: 16 },
  h3: { fontSize: 13, margin: '0 0 8px', fontWeight: 600 },
  p: { fontSize: 12, margin: '4px 0', color: '#333' },
}