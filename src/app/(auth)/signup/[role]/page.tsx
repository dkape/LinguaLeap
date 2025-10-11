import { AuthForm } from "@/components/auth/auth-form";
import type { UserRole } from "@/lib/types";

type SignupPageProps = {
  params: { role: UserRole };
};

export default function SignupPage({ params }: SignupPageProps) {
  if (params.role !== 'student' && params.role !== 'teacher') {
    return <div>Invalid role specified.</div>
  }
  
  return <AuthForm mode="signup" role={params.role} />;
}
