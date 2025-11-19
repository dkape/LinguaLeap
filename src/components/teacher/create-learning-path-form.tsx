'use client';

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from '@/contexts/locale-context';
import axios from "axios";

interface CreateLearningPathFormProps {
  onSuccess?: () => void;
}

export function CreateLearningPathForm({ onSuccess }: CreateLearningPathFormProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  interface GeneratedLevel {
    title: string;
    description?: string;
    activities?: Array<{ title: string; description?: string }>;
  }

  const [generatedPath, setGeneratedPath] = useState<{ title: string; description?: string; levels: GeneratedLevel[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formSchema = useMemo(() => z.object({
    topic: z.string().min(3, { message: t('createLearningPathForm.validation.topicMin') }),
    studentGroupDescription: z.string().min(10, { message: t('createLearningPathForm.validation.descriptionMin') }),
    ageRange: z.string(),
    readingLevel: z.string(),
    language: z.string(),
  }), [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      studentGroupDescription: "",
      ageRange: "5-6",
      readingLevel: "beginner",
      language: "en",
    },
  });

  async function onGenerate(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedPath(null);
    try {
      const response = await axios.post("/learning-paths/generate", values);
      setGeneratedPath(response.data);
      toast({ title: t('createLearningPathForm.successTitle'), description: t('createLearningPathForm.successDescription') });
    } catch {
      toast({ variant: "destructive", title: t('createLearningPathForm.errorTitle'), description: t('createLearningPathForm.errorDescription') });
    }
    setIsGenerating(false);
  }

  async function onSave() {
    setIsSaving(true);
    try {
      await axios.post("/learning-paths", generatedPath);
      toast({ title: t('createLearningPathForm.saveSuccessTitle'), description: t('createLearningPathForm.saveSuccessDescription') });
      setGeneratedPath(null);
      form.reset();
      if (onSuccess) onSuccess();
    } catch {
      toast({ variant: "destructive", title: t('createLearningPathForm.saveErrorTitle'), description: t('createLearningPathForm.saveErrorDescription') });
    }
    setIsSaving(false);
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-8">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createLearningPathForm.topicLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('createLearningPathForm.topicPlaceholder')} {...field} />
                </FormControl>
                <FormDescription>{t('createLearningPathForm.topicDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentGroupDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createLearningPathForm.studentGroupDescriptionLabel')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('createLearningPathForm.studentGroupDescriptionPlaceholder')} {...field} />
                </FormControl>
                <FormDescription>{t('createLearningPathForm.studentGroupDescriptionDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createLearningPathForm.ageRangeLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('createChallengeForm.ageRangePlaceholder')} />
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
            <FormField
              control={form.control}
              name="readingLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createLearningPathForm.readingLevelLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('createChallengeForm.readingLevelPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">{t('createChallengeForm.readingLevelBeginner')}</SelectItem>
                      <SelectItem value="intermediate">{t('createChallengeForm.readingLevelIntermediate')}</SelectItem>
                      <SelectItem value="advanced">{t('createChallengeForm.readingLevelAdvanced')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createLearningPathForm.languageLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('createChallengeForm.languagePlaceholder')} />
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
          </div>
          <Button type="submit" disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? t('createLearningPathForm.generatingButton') : t('createLearningPathForm.generateButton')}
          </Button>
        </form>
      </Form>

      {generatedPath && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedPath.title}</CardTitle>
            <CardDescription>{generatedPath.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPath.levels.map((level: GeneratedLevel, index: number) => (
              <div key={index}>
                <h3 className="font-semibold">{t('createLearningPathForm.levelLabel')} {index + 1}: {level.title}</h3>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            ))}
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? t('createLearningPathForm.savingButton') : t('createLearningPathForm.saveButton')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
