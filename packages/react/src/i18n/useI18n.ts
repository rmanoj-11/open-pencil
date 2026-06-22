import { useSyncExternalStore } from 'react'

import { locale, setLocale, AVAILABLE_LOCALES, LOCALE_LABELS } from '#react/i18n/locale'
import type { Locale } from '#react/i18n/locale'
import { useNanoStore } from '#react/internal/use-nano-store'
import {
  menuMessages,
  commandMessages,
  toolMessages,
  panelMessages,
  variableTypeMessages,
  pageMessages,
  dialogMessages
} from '#react/i18n/messages'

export function useI18n() {
  return {
    menu: useNanoStore(menuMessages),
    commands: useNanoStore(commandMessages),
    tools: useNanoStore(toolMessages),
    panels: useNanoStore(panelMessages),
    variableTypes: useNanoStore(variableTypeMessages),
    pages: useNanoStore(pageMessages),
    dialogs: useNanoStore(dialogMessages),
    locale: useNanoStore(locale) as Locale,
    availableLocales: AVAILABLE_LOCALES,
    localeLabels: LOCALE_LABELS,
    setLocale
  }
}