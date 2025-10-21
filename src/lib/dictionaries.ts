import type { Locale } from './i18n';

const dictionaries = {
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

// Helper function to get nested translation values
export function getTranslation(dict: Dictionary, key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: unknown = dict;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters in the translation
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

// Shorthand function for translations
export function t(dict: Dictionary, key: string, params?: Record<string, string | number>): string {
  return getTranslation(dict, key, params);
}