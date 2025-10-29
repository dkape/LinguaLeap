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
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';
import { useLocale } from "@/contexts/locale-context";

function ResetPasswordContent() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { dict } = useLocale();

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
      toast({ variant: 'destructive', title: dict.auth.resetPassword.errorTitle, description: dict.auth.resetPassword.invalidToken });
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, values.password);
      toast({ title: dict.auth.resetPassword.successTitle, description: dict.auth.resetPassword.successDescription });
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = dict.auth.resetPassword.genericError;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: dict.auth.resetPassword.errorTitle,
        description: errorMessage,
      });
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