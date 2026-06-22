import {
  createGridTrackActions, createLayoutActions, createLayoutSelectionState,
  createPaddingActions, createTrackSizingOptions, trackLabel
} from '#react/controls/layout/helpers'
import { useEditor } from '#react/editor/context'
import { useI18n } from '#react/i18n'

export function useLayout() {
  const editor = useEditor()
  const { panels } = useI18n()

  const state = createLayoutSelectionState(editor, {
    sizingFixed: panels.sizingFixed,
    sizingHug: panels.sizingHug,
    sizingFill: panels.sizingFill
  })

  const paddingActions = createPaddingActions(editor, () => state.node)

  const layoutActions = createLayoutActions({
    editor,
    getNode: () => state.node,
    isFlex: () => state.isFlex,
    isInAutoLayout: () => state.isInAutoLayout
  })

  const gridActions = createGridTrackActions(editor, () => state.node)

  return {
    editor,
    node: state.node,
    layoutDirection: state.layoutDirection,
    gapAuto: state.gapAuto,
    isInAutoLayout: state.isInAutoLayout,
    isGrid: state.isGrid,
    isFlex: state.isFlex,
    widthSizing: state.widthSizing,
    heightSizing: state.heightSizing,
    widthSizingOptions: state.widthSizingOptions,
    heightSizingOptions: state.heightSizingOptions,
    alignGrid: state.alignGrid,
    showIndividualPadding: paddingActions.showIndividualPadding,
    setShowIndividualPadding: paddingActions.setShowIndividualPadding,
    hasUniformPadding: paddingActions.hasUniformPadding(),
    hasSymmetricPadding: paddingActions.hasSymmetricPadding(),
    trackSizingOptions: createTrackSizingOptions({
      sizingFillFr: panels.sizingFillFr,
      sizingFixedPx: panels.sizingFixedPx,
      sizingFixed: panels.sizingFixed,
      sizingHug: panels.sizingHug,
      sizingFill: panels.sizingFill
    }),
    updateProp: layoutActions.updateProp,
    updateSizeLimit: layoutActions.updateSizeLimit,
    setSizeLimitToCurrent: layoutActions.setSizeLimitToCurrent,
    commitSizeLimit: layoutActions.commitSizeLimit,
    addSizeLimit: layoutActions.addSizeLimit,
    removeSizeLimit: layoutActions.removeSizeLimit,
    commitProp: layoutActions.commitProp,
    setWidthSizing: layoutActions.setWidthSizing,
    setHeightSizing: layoutActions.setHeightSizing,
    setHorizontalPadding: paddingActions.setHorizontalPadding,
    commitHorizontalPadding: paddingActions.commitHorizontalPadding,
    setVerticalPadding: paddingActions.setVerticalPadding,
    commitVerticalPadding: paddingActions.commitVerticalPadding,
    setAlignment: layoutActions.setAlignment,
    setGapAuto: layoutActions.setGapAuto,
    setLayoutDirection: layoutActions.setLayoutDirection,
    updateGridTrack: gridActions.updateGridTrack,
    addTrack: gridActions.addTrack,
    removeTrack: gridActions.removeTrack,
    trackLabel,
    toggleIndividualPadding: paddingActions.toggleIndividualPadding
  }
}