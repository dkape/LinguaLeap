import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionaries';
import { LocaleProvider } from '@/contexts/locale-context';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import Image from 'next/image';

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
        <div className="min-h-screen bg-background relative">
          <Image
            src="/background.png"
            alt="Decorative background"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-25 pointer-events-none lg:object-contain"
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </LocaleProvider>
  );
}