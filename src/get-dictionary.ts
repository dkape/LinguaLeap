import 'server-only'
import type { Locale } from './i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We do not want to use dynamic imports, as it will be compiled into a require() call which is not supported by Edge functions
const dictionaries = {
  en: () => import('../dictionaries/en.json').then(module => module.default),
  de: () => import('../dictionaries/de.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale] ? dictionaries[locale]() : dictionaries.en()
