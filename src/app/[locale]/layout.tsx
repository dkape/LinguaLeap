import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionaries';
import { LocaleProvider } from '@/contexts/locale-context';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  
  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  
  const locale = localeParam as Locale;

  const dict = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dict={dict}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {/* Language switcher in top right */}
          <div className="absolute top-4 right-4 z-50">
            <LanguageSwitcher currentLocale={locale} />
          </div>
          
          {children}
        </div>
        <Toaster />
      </AuthProvider>
    </LocaleProvider>
  );
}