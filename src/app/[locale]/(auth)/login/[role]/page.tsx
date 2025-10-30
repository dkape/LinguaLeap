import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";

type LoginPageProps = {
  params: { role: UserRole; locale: Locale };
};

export default async function LoginPage({ params }: LoginPageProps) {
  const dict = await getDictionary(params.locale);
  
  if (params.role !== 'student' && params.role !== 'teacher') {
    return <div>{dict.errors.invalidRole}</div>;
  }
  
  return <AuthForm mode="login" role={params.role} />;
}