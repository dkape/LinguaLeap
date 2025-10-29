'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateSuggestedLearningPath, GenerateSuggestedLearningPathOutput } from "@/ai/flows/generate-suggested-learning-path";
import { Loader2, Wand2, BookText, FileQuestion } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';
import { useTranslation } from '@/contexts/locale-context';

export function CreateLearningPathForm() {
  const [learningPath, setLearningPath] = useState<GenerateSuggestedLearningPathOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const dict = t.createLearningPathForm;

  const formSchema = z.object({
    topic: z.string().min(3, { message: t('validation.minLength', { min: 3 }) }),
    studentGroupDescription: z.string().min(10, { message: t('validation.minLength', { min: 10 }) }),
    ageRange: z.string({ required_error: t('validation.required') }),
    readingLevel: z.string({ required_error: t('validation.required') }),
    language: z.enum(['en', 'de']),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      studentGroupDescription: "",
      language: "en",
    },
  });
  
  const { isSubmitting } = useFormState({ control: form.control });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLearningPath(null);
    try {
      const result = await generateSuggestedLearningPath(values);
      setLearningPath(result);
      toast({
        title: dict.successToastTitle,
        description: dict.successToastDescription,
      });
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: dict.errorToastTitle,
        description: dict.errorToastDescription,
      });
    }
  }

  async function onSavePath() {
    if (!learningPath || !user) return;
    setIsSaving(true);
    try {
        await axios.post("/learning-paths", {
            title: form.getValues('topic'),
            description: form.getValues('studentGroupDescription'),
            levels: learningPath.learningPath.map((item, index) => ({
                type: item.type,
                content: item.content,
                order_index: index + 1,
            })),
        });
        toast({
            title: dict.saveSuccessToastTitle,
            description: dict.saveSuccessToastDescription,
        });
        setLearningPath(null);
        form.reset();
        // Maybe redirect to the new course page in the future
    } catch (error) {
        console.error("Error saving learning path:", error);
        toast({
            variant: "destructive",
            title: dict.saveErrorToastTitle,
            description: dict.saveErrorToastDescription,
        });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Wand2 className='h-6 w-6 text-primary' />
            <CardTitle className="text-2xl font-headline">{dict.title}</CardTitle>
          </div>
          <CardDescription>
            {dict.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.topicLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={dict.topicPlaceholder} {...field} />
                        </FormControl>
                        <FormDescription>{dict.topicDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentGroupDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.studentGroupDescriptionLabel}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={dict.studentGroupDescriptionPlaceholder}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{dict.studentGroupDescriptionDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dict.ageRangeLabel}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={dict.ageRangePlaceholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="5-6">{dict.ageRange5_6}</SelectItem>
                                <SelectItem value="7-8">{dict.ageRange7_8}</SelectItem>
                                <SelectItem value="9-10">{dict.ageRange9_10}</SelectItem>
                                <SelectItem value="11-12">{dict.ageRange11_12}</SelectItem>
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
                            <FormLabel>{dict.readingLevelLabel}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={dict.readingLevelPlaceholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="beginner">{dict.readingLevelBeginner}</SelectItem>
                                <SelectItem value="intermediate">{dict.readingLevelIntermediate}</SelectItem>
                                <SelectItem value="advanced">{dict.readingLevelAdvanced}</SelectItem>
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
                            <FormLabel>{dict.languageLabel}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={dict.languagePlaceholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="en">{dict.languageEnglish}</SelectItem>
                                <SelectItem value="de">{dict.languageGerman}</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </div>
              
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dict.generatingButton}
                  </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {dict.generateButton}
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isSubmitting && (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{dict.generatingMessage}</p>
        </div>
      )}

      {learningPath && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">{dict.generatedTitle}</CardTitle>
                <CardDescription>{dict.generatedDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                {learningPath.learningPath.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg">
                        <div className="flex items-center gap-2">
                        {item.type === 'text' ? <BookText className="h-5 w-5 text-primary" /> : <FileQuestion className="h-5 w-5 text-accent" />}
                        {item.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose max-w-none text-foreground/90 p-4 bg-muted/50 rounded-md">
                        <pre className="whitespace-pre-wrap font-sans text-sm bg-transparent p-0 border-0">{item.content}</pre>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
            <CardFooter>
                <Button onClick={onSavePath} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dict.savingButton}</> : dict.saveButton}
                </Button>
            </CardFooter>
        </Card>
      )}
    </>
  );
}