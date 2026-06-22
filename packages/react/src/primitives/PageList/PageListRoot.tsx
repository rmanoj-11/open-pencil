import { type ReactNode } from 'react'
import { usePageList } from '#react/primitives/PageList/usePageList'

export interface PageListRootProps {
  children?: ReactNode | ((props: PageListRootSlotProps) => ReactNode)
}

export interface PageListRootSlotProps {
  pages: ReturnType<typeof usePageList>['pages']
  currentPageId: string
  switchPage: ReturnType<typeof usePageList>['switchPage']
  addPage: ReturnType<typeof usePageList>['addPage']
}

export function PageListRoot({ children }: PageListRootProps) {
  const { pages, currentPageId, switchPage, addPage } = usePageList()
  const slotProps: PageListRootSlotProps = { pages, currentPageId, switchPage, addPage }
  return <>{typeof children === 'function' ? children(slotProps) : children}</>
}