import { Logo } from "@/components/icons";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href={`/${locale}`} className="flex items-center justify-center gap-2 mb-8">
            <Logo className="h-12 w-12 text-primary" />
            <span className="text-3xl font-bold text-primary">{dict.app.title}</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}