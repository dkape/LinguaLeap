'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { locales, type Locale, getPathnameWithoutLocale, getLocalizedPath } from '@/lib/i18n';

import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

const languageNames: Record<Locale, { native: string; english: string }> = {
  de: { native: 'Deutsch', english: 'German' },
  en: { native: 'English', english: 'English' },
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);
  const { user } = useAuth();

  const handleLanguageChange = async (newLocale: Locale) => {
    if (newLocale === currentLocale || isChanging) return;
    
    setIsChanging(true);
    
    try {
      // Set locale cookie
      document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
      
      // Update user preference in database if logged in
      if (user) {
        try {
          await axios.put('/auth/language-preference', { language: newLocale });
        } catch (error) {
          console.error('Failed to update language preference:', error);
          // Continue with language change even if database update fails
        }
      }
      
      // Get current path without locale
      const pathWithoutLocale = getPathnameWithoutLocale(pathname);
      
      // Create new localized path
      const newPath = getLocalizedPath(pathWithoutLocale, newLocale);
      
      // Navigate to new path
      router.push(newPath);
      router.refresh();
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" disabled={isChanging}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageNames[currentLocale].native}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {languageNames[locale].native}
              </span>
              <span className="text-xs text-muted-foreground">
                {languageNames[locale].english}
              </span>
            </div>
            {currentLocale === locale && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}