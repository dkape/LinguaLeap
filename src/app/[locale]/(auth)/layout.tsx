
import { Logo } from "@/components/icons";
import Link from "next/link";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function AuthLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-primary">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold">{dictionary.brand.name}</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
