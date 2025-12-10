'use client';

import { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/contexts/locale-context';
import axios from 'axios';

export function CreateClassForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, { message: t('createClassForm.validation.nameMin') }),
    language: z.string(),
    ageRange: z.string(),
  }), [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      language: "en",
      ageRange: "5-6",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post("classes", values);
      toast({
        title: t('createClassForm.successTitle'),
        description: t('createClassForm.successDescription'),
      });
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: t('createClassForm.errorTitle'),
        description: t('createClassForm.errorDescription'),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createClassForm.classNameLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createClassForm.classNamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createClassForm.languageLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('createClassForm.languagePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">{t('createChallengeForm.languageEnglish')}</SelectItem>
                  <SelectItem value="de">{t('createChallengeForm.languageGerman')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createClassForm.ageRangeLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('createClassForm.ageRangePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5-6">{t('createChallengeForm.ageRange5_6')}</SelectItem>
                  <SelectItem value="7-8">{t('createChallengeForm.ageRange7_8')}</SelectItem>
                  <SelectItem value="9-10">{t('createChallengeForm.ageRange9_10')}</SelectItem>
                  <SelectItem value="11-12">{t('createChallengeForm.ageRange11_12')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('createClassForm.creatingButton') : t('createClassForm.createButton')}
        </Button>
      </form>
    </Form>
  );
}
