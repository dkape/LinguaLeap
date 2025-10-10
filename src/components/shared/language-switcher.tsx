
'use client'

import { i18n, type Locale } from '@/i18n-config'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useDictionary } from '@/hooks/use-dictionary';

export function LanguageSwitcher() {
  const { setLocale } = useDictionary();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map(locale => {
          const flag = locale === 'en' ? '🇺🇸' : '🇩🇪';
          const label = locale === 'en' ? 'English' : 'German';
          return (
            <DropdownMenuItem key={locale} onClick={() => setLocale(locale)}>
              <span className="mr-2">{flag}</span> {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
