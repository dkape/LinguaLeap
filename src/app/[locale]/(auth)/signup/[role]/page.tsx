import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";

type SignupPageProps = {
  params: Promise<{ role: UserRole; locale: Locale }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { role, locale } = await params;
  const dict = await getDictionary(locale);
  
  if (role !== 'student' && role !== 'teacher') {
    return <div>{dict.errors.invalidRole}</div>;
  }
  
  return <AuthForm mode="signup" role={role} />;
}