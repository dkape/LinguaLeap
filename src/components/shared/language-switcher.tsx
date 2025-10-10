'use client'

<<<<<<< HEAD
import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/app/[locale]/i18n-config'
=======
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18n, type Locale } from '@/i18n-config'
>>>>>>> origin/main
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    const hasLocale = i18n.locales.includes(segments[1] as Locale);
    if (hasLocale) {
        segments[1] = locale
    } else {
        segments.splice(1, 0, locale);
    }
    return segments.join('/')
  }

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
            <DropdownMenuItem key={locale} onClick={() => router.push(redirectedPathName(locale))}>
              <span className="mr-2">{flag}</span> {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}