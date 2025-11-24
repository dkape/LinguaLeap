import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { getDictionary, t } from '@/lib/dictionaries';
import { LocaleProvider } from '@/contexts/locale-context';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
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
      <div className="min-h-screen bg-background relative">
        <Image
          src="/background.png"
          alt={t(dict, 'common.decorativeBackground')}
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-25 pointer-events-none lg:object-contain"
        />
        {/* Language switcher in top right */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher currentLocale={locale} />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </LocaleProvider>
  );
}