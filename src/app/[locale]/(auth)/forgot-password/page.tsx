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
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/locale-context";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { dict, locale } = useLocale();

  useEffect(() => {
    if (submissionMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submissionMessage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSubmissionMessage(null);
    try {
      await forgotPassword(values.email);
      setSubmissionMessage({ type: 'success', message: dict.auth.forgotPassword.successDescription });
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = dict.auth.forgotPassword.genericError;
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
        <CardTitle className="font-headline">{dict.auth.forgotPassword.title}</CardTitle>
        <CardDescription>{dict.auth.forgotPassword.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
                    ? dict.auth.forgotPassword.successTitle
                    : dict.auth.forgotPassword.errorTitle}
                </p>
                <p>{submissionMessage.message}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.auth.forgotPassword.emailLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={dict.auth.forgotPassword.emailPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.auth.forgotPassword.button}
            </Button>
            <div className="text-sm text-muted-foreground">
              {dict.auth.forgotPassword.rememberPassword}{" "}
              <Link href={`/${locale}/login/student`} className="text-primary hover:underline">
                {dict.auth.forgotPassword.loginLink}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}