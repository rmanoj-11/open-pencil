import { useEditor } from '#react/editor/context'
import { useSceneComputed } from '#react/internal/scene-computed/use'

export function usePageList() {
  const editor = useEditor()

  const pages = useSceneComputed(() => editor.graph.getPages())
  const currentPageId = useSceneComputed(() => editor.state.currentPageId)

  return {
    editor,
    pages,
    currentPageId,
    switchPage: editor.switchPage,
    addPage: editor.addPage,
    deletePage: editor.deletePage,
    renamePage: editor.renamePage
  }
}