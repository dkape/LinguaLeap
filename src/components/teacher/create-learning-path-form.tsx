
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateSuggestedLearningPath, GenerateSuggestedLearningPathOutput } from "@/ai/flows/generate-suggested-learning-path";
import { Loader2, Wand2, BookText, FileQuestion } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/hooks/use-dictionary';


const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  studentGroupDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  ageRange: z.string({ required_error: "Please select an age range." }),
  readingLevel: z.string({ required_error: "Please select a reading level." }),
  language: z.enum(['en', 'de']),
});

export function CreateLearningPathForm() {
  const [learningPath, setLearningPath] = useState<GenerateSuggestedLearningPathOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const { dictionary } = useDictionary();
  const formDict = dictionary.teacher.createPath;
  
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
        title: formDict.notifications.generateSuccessTitle,
        description: formDict.notifications.generateSuccessDescription,
      });
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: formDict.notifications.generateErrorTitle,
        description: formDict.notifications.generateErrorDescription,
      });
    }
  }

  async function onSavePath() {
    if (!learningPath || !user) return;
    setIsSaving(true);
    try {
        const docRef = await addDoc(collection(db, "courses"), {
            title: form.getValues('topic'),
            description: form.getValues('studentGroupDescription'),
            // For now, we'll hardcode an icon. This could be a user choice in the future.
            icon: 'BookOpen',
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            levels: learningPath.learningPath.map((item, index) => ({
                id: (index + 1).toString(),
                title: item.title,
                content: item.content,
                unlocked: index === 0, // Unlock the first level
                quiz: [], // Quiz generation will be another step
            })),
        });
        toast({
            title: formDict.notifications.saveSuccessTitle,
            description: formDict.notifications.saveSuccessDescription,
        });
        setLearningPath(null);
        form.reset();
        // Maybe redirect to the new course page in the future
    } catch (error) {
        console.error("Error saving learning path:", error);
        toast({
            variant: "destructive",
            title: formDict.notifications.saveErrorTitle,
            description: formDict.notifications.saveErrorDescription,
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
            <CardTitle className="text-2xl font-headline">{formDict.title}</CardTitle>
          </div>
          <CardDescription>
            {formDict.description}
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
                        <FormLabel>{formDict.topic.label}</FormLabel>
                        <FormControl>
                          <Input placeholder={formDict.topic.placeholder} {...field} />
                        </FormControl>
                        <FormDescription>{formDict.topic.description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentGroupDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{formDict.groupDescription.label}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={formDict.groupDescription.placeholder}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{formDict.groupDescription.description}</FormDescription>
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
                            <FormLabel>{formDict.ageRange.label}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={formDict.ageRange.placeholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="5-6">{formDict.ageRange.options.younger}</SelectItem>
                                <SelectItem value="7-8">{formDict.ageRange.options.middle}</SelectItem>
                                <SelectItem value="9-10">{formDict.ageRange.options.older}</SelectItem>
                                <SelectItem value="11-12">{formDict.ageRange.options.oldest}</SelectItem>
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
                            <FormLabel>{formDict.readingLevel.label}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={formDict.readingLevel.placeholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="beginner">{formDict.readingLevel.options.beginner}</SelectItem>
                                <SelectItem value="intermediate">{formDict.readingLevel.options.intermediate}</SelectItem>
                                <SelectItem value="advanced">{formDict.readingLevel.options.advanced}</SelectItem>
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
                            <FormLabel>{formDict.language.label}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder={formDict.language.placeholder} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="en">{formDict.language.options.en}</SelectItem>
                                <SelectItem value="de">{formDict.language.options.de}</SelectItem>
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
                    {formDict.buttons.generating}
                  </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {formDict.buttons.generate}
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
            <p className="text-muted-foreground">{formDict.generatingState}</p>
        </div>
      )}

      {learningPath && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">{formDict.generatedPath.title}</CardTitle>
                <CardDescription>{formDict.generatedPath.description}</CardDescription>
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
                        <pre className="whitespace-pre-wrap font-body text-sm bg-transparent p-0 border-0">{item.content}</pre>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
            <CardFooter>
                <Button onClick={onSavePath} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {formDict.buttons.saving}</> : formDict.buttons.save}
                </Button>
            </CardFooter>
        </Card>
      )}
    </>
  );
}
