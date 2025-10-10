
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from '@/i18n-config';
import enDictionary from '@/dictionaries/en.json';
import deDictionary from '@/dictionaries/de.json';

type Dictionary = typeof enDictionary;

const dictionaries: Record<Locale, Dictionary> = {
  en: enDictionary,
  de: deDictionary,
};

interface DictionaryContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaries.en);

  useEffect(() => {
    // Here you could add logic to get the locale from localStorage or browser settings
    setDictionary(dictionaries[locale]);
  }, [locale]);
  
  const value = {
    locale,
    setLocale,
    dictionary,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
};
