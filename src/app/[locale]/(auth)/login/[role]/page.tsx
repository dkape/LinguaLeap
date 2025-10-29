import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";

type LoginPageProps = {
  params: { role: UserRole; locale: Locale };
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { role, locale } = params;
  const dict = await getDictionary(locale);
  
  if (role !== 'student' && role !== 'teacher') {
    return <div>{dict.errors.invalidRole}</div>;
  }
  
  return <AuthForm mode="login" role={role} />;
}