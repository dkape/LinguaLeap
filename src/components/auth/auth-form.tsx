
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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDictionary } from "@/hooks/use-dictionary";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
  role: UserRole;
};

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const { signUp, logIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { dictionary } = useDictionary();
  const authDict = dictionary.auth;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.extend({
      name: mode === 'signup' ? z.string().min(2, authDict.validations.nameMin) : z.string().optional(),
      email: z.string().email(authDict.validations.emailInvalid),
      password: z.string().min(6, authDict.validations.passwordMin),
    })),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!values.name) {
          toast({ variant: 'destructive', title: authDict.errors.error, description: authDict.errors.nameRequired });
          setIsLoading(false);
          return;
        }
        await signUp(values.email, values.password, values.name, role);
        toast({ title: authDict.success.title, description: authDict.success.accountCreated });
      } else {
        await logIn(values.email, values.password);
      }
      router.push(`/${role}/dashboard`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: authDict.errors.authFailed,
        description: error.message || authDict.errors.unexpected,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const roleName = role === 'student' ? dictionary.roles.studentShort : dictionary.roles.teacherShort;

  const title = mode === 'login' ? authDict.login.title : authDict.signup.title;
  const description = authDict.form.description.replace('{mode}', mode === 'login' ? authDict.form.mode.login : authDict.form.mode.signup).replace('{role}', roleName);
  const buttonText = mode === 'login' ? authDict.login.button : authDict.signup.button;
  const linkText = mode === 'login' ? authDict.login.prompt : authDict.signup.prompt;
  const linkActionText = mode === 'login' ? authDict.signup.button : authDict.login.button;
  const linkHref = `/${mode === 'login' ? 'signup' : 'login'}/${role}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authDict.form.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={authDict.form.namePlaceholder} {...field} />
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
                  <FormLabel>{authDict.form.emailLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={authDict.form.emailPlaceholder} {...field} />
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
                  <FormLabel>{authDict.form.passwordLabel}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
