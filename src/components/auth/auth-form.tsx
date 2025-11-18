'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale, useTranslation } from "@/contexts/locale-context";
import { Logo } from "@/components/icons";

type AuthFormProps = {
  mode: 'login' | 'signup';
  role: UserRole;
};

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const { signUp, logIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { locale } = useLocale();
  const { t } = useTranslation();

  useEffect(() => {
    if (submissionError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submissionError]);

  const formSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: t('validation.email') }),
    password: z.string().min(6, { message: t('validation.passwordTooShort') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.extend({
      name: mode === 'signup' ? z.string().min(2, t('validation.minLength', { min: '2' })) : z.string().optional(),
    })),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSubmissionError(null);
    try {
      if (mode === 'signup') {
        if (!values.name) {
          setSubmissionError(t('auth.signup.nameRequired'));
          setIsLoading(false);
          return;
        }
        const response = await signUp(values.email, values.password, values.name, role);
        toast({ 
          title: t('auth.signup.registrationSuccessful'), 
          description: (response.data as { message?: string })?.message || t('auth.signup.checkEmail')
        });
        // Don't redirect to dashboard - user needs to verify email first
        router.push(`/${locale}/login/${role}`);
      } else {
        await logIn(values.email, values.password);
        router.push(`/${locale}/${role}/dashboard`);
      }
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = t('errors.general');
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: { message?: string; emailVerificationRequired?: boolean } } };
        if (axiosError.response?.status === 401) {
          errorMessage = t('auth.login.invalidCredentials');
        } else if (axiosError.response?.status === 409) {
          errorMessage = t('auth.signup.emailInUse');
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
        
        // Handle email verification required for login
        if (axiosError.response?.data?.emailVerificationRequired) {
          setSubmissionError(t('auth.login.emailVerificationRequiredDescription'));
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmissionError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const roleName = t(`auth.roles.${role}`);
  const title = mode === 'login' 
    ? `${t('auth.login.title')} ${roleName}!` 
    : `${t('auth.signup.title')} ${roleName}`;
  const description = mode === 'login' ? t('auth.login.description') : t('auth.signup.description');
  const buttonText = mode === 'login' ? t('auth.login.button') : t('auth.signup.button');
  const linkText = mode === 'login' ? t('auth.login.noAccount') : t('auth.signup.hasAccount');
  const linkActionText = mode === 'login' ? t('auth.signup.button') : t('auth.login.button');
  const linkHref = `/${locale}/${mode === 'login' ? 'signup' : 'login'}/${role}`;

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo />
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {submissionError && (
              <div ref={errorRef} className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
                <p className="font-semibold mb-1">{mode === 'signup' ? t('auth.signup.registrationFailed') : t('auth.login.loginFailed')}</p>
                <p>{submissionError}</p>
              </div>
            )}
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.signup.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('auth.signup.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.login.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.login.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.login.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('auth.login.passwordPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
            <div className="text-sm text-muted-foreground">
              {linkText}{" "}
              <Link href={linkHref} className="text-primary hover:underline">
                {linkActionText}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}