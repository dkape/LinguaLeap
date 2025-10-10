import { i18n, type Locale } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
