
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{dictionary.brand.name}</h1>
        </div>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-4">
            {dictionary.home.headline}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {dictionary.home.tagline}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button size="lg" className="w-full text-lg py-8" asChild>
              <Link href={`/${lang}/login/student`}>
                {dictionary.roles.student}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full text-lg py-8"
              asChild
            >
              <Link href={`/${lang}/login/teacher`}>
                {dictionary.roles.teacher}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="p-4 text-center text-muted-foreground text-sm">
        <p>
          &copy; {new Date().getFullYear()} {dictionary.brand.name}. {dictionary.home.footerRights}
        </p>
      </footer>
    </div>
  );
}
