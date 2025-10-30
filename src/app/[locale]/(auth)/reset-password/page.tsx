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
import { useAuth } from "@/hooks/use-auth";
import { useState, Suspense, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';
import { useLocale } from "@/contexts/locale-context";

function ResetPasswordContent() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { dict } = useLocale();

  useEffect(() => {
    if (submissionMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submissionMessage]);

  const formSchema = z.object({
    password: z.string().min(6, { message: dict.auth.resetPassword.passwordTooShort }),
    confirmPassword: z.string().min(6, { message: dict.auth.resetPassword.passwordTooShort }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: dict.auth.resetPassword.passwordsDontMatch,
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      setSubmissionMessage({ type: 'error', message: dict.auth.resetPassword.invalidToken });
      return;
    }
    setIsLoading(true);
    setSubmissionMessage(null);
    try {
      await resetPassword(token, values.password);
      setSubmissionMessage({ type: 'success', message: dict.auth.resetPassword.successDescription });
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = dict.auth.resetPassword.genericError;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmissionMessage({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{dict.auth.resetPassword.title}</CardTitle>
        <CardDescription>{dict.auth.resetPassword.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {submissionMessage && (
              <div
                ref={messageRef}
                className={`p-4 mb-4 rounded-md text-sm ${
                  submissionMessage.type === 'success'
                    ? 'bg-green-100 border border-green-200 text-green-800'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}
              >
                <p className="font-semibold mb-1">
                  {submissionMessage.type === 'success'
                    ? dict.auth.resetPassword.successTitle
                    : dict.auth.resetPassword.errorTitle}
                </p>
                <p>{submissionMessage.message}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.auth.resetPassword.passwordLabel}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.auth.resetPassword.confirmPasswordLabel}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.auth.resetPassword.button}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function ResetPasswordLoading() {
  const { dict } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{dict.auth.resetPassword.title}</CardTitle>
        <CardDescription>{dict.auth.resetPassword.loading}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}