'use client';

import { useState, useRef, useEffect } from 'react';
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

interface ExistingLearningPath {
  _id: string;
  title: string;
  description: string;
  levelCount: number;
  isActive: boolean;
}

export function CreateLearningPathForm() {
  const [existingLearningPaths, setExistingLearningPaths] = useState<ExistingLearningPath[]>([]);
  const [learningPath, setLearningPath] = useState<GenerateSuggestedLearningPathOutput | null>(null);
  const generatedCardRef = useRef<HTMLDivElement | null>(null);
    // Scroll to the generated card when it appears
    useEffect(() => {
      fetchLearningPaths();
    }, []);

    useEffect(() => {
      if (learningPath && generatedCardRef.current) {
        generatedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [learningPath]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();


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
        title: t('createLearningPathForm.successToastTitle'),
        description: t('createLearningPathForm.successToastDescription'),
      });
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: t('createLearningPathForm.errorToastTitle'),
        description: t('createLearningPathForm.errorToastDescription'),
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
            title: t('createLearningPathForm.saveSuccessToastTitle'),
            description: t('createLearningPathForm.saveSuccessToastDescription'),
        });
        setLearningPath(null);
        form.reset();
        // Maybe redirect to the new course page in the future
    } catch (error) {
        console.error("Error saving learning path:", error);
        toast({
            variant: "destructive",
            title: t('createLearningPathForm.saveErrorToastTitle'),
            description: t('createLearningPathForm.saveErrorToastDescription'),
        });
    } finally {
        setIsSaving(false);
    }
  }

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get('/learning-paths/teacher');
      setExistingLearningPaths(response.data.learningPaths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    }
  };

  return (
    <div className="space-y-6">
      {existingLearningPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('createLearningPathForm.existingPathsTitle')}</CardTitle>
            <CardDescription>{t('createLearningPathForm.existingPathsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {existingLearningPaths.map((path) => (
              <Card key={path._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span><BookText className="inline-block w-4 h-4 mr-1" /> {path.levelCount} Levels</span>
                  </div>
                </CardContent>
                <CardFooter>
                    <Badge variant={path.isActive ? "default" : "secondary"}>
                        {path.isActive ? t('createLearningPathForm.statusActive') : t('createLearningPathForm.statusInactive')}
                    </Badge>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Wand2 className='h-6 w-6 text-primary' />
            <CardTitle className="text-2xl font-headline">{t('createLearningPathForm.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('createLearningPathForm.description')}
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
                          <Textarea
                            placeholder={t('createLearningPathForm.studentGroupDescriptionPlaceholder')}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{t('createLearningPathForm.studentGroupDescriptionDescription')}</FormDescription>
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
                            <FormLabel>{t('createLearningPathForm.ageRangeLabel')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={t('createLearningPathForm.ageRangePlaceholder')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="5-6">{t('createLearningPathForm.ageRange5_6')}</SelectItem>
                                <SelectItem value="7-8">{t('createLearningPathForm.ageRange7_8')}</SelectItem>
                                <SelectItem value="9-10">{t('createLearningPathForm.ageRange9_10')}</SelectItem>
                                <SelectItem value="11-12">{t('createLearningPathForm.ageRange11_12')}</SelectItem>
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
                                <SelectTrigger><SelectValue placeholder={t('createLearningPathForm.readingLevelPlaceholder')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="beginner">{t('createLearningPathForm.readingLevelBeginner')}</SelectItem>
                                <SelectItem value="intermediate">{t('createLearningPathForm.readingLevelIntermediate')}</SelectItem>
                                <SelectItem value="advanced">{t('createLearningPathForm.readingLevelAdvanced')}</SelectItem>
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
                                <SelectTrigger><SelectValue placeholder={t('createLearningPathForm.languagePlaceholder')} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="en">{t('createLearningPathForm.languageEnglish')}</SelectItem>
                                <SelectItem value="de">{t('createLearningPathForm.languageGerman')}</SelectItem>
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
                    {t('createLearningPathForm.generatingButton')}
                  </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {t('createLearningPathForm.generateButton')}
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
            <p className="text-muted-foreground">{t('createLearningPathForm.generatingMessage')}</p>
        </div>
      )}

      {learningPath && (
        <Card className="mt-8" ref={generatedCardRef}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">{t('createLearningPathForm.generatedTitle')}</CardTitle>
                <CardDescription>{t('createLearningPathForm.generatedDescription')}</CardDescription>
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
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('createLearningPathForm.savingButton')}</> : t('createLearningPathForm.saveButton')}
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}