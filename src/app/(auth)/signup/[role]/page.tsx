import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

type SignupPageProps = {
  params: Promise<{ role: UserRole }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { role } = await params;
  if (role !== 'student' && role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }
  
  return <AuthForm mode="signup" role={role} />;
}
