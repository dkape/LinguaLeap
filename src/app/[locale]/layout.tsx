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
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <title>{dict.app.title}</title>
        <meta name="description" content={dict.app.description} />
      </head>
      <body>
        <LocaleProvider locale={locale} dict={dict}>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              {/* Language switcher in top right */}
              <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher currentLocale={locale} dict={dict} />
              </div>
              
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}