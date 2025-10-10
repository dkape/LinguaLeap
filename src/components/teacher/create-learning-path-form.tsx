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
        title: "Success!",
        description: "Your new learning path has been generated.",
      });
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem generating the learning path. Please try again.",
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
            title: "Learning Path Saved!",
            description: "The new course is now available for your students.",
        });
        setLearningPath(null);
        form.reset();
        // Maybe redirect to the new course page in the future
    } catch (error) {
        console.error("Error saving learning path:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save the learning path. Please try again.",
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
            <CardTitle className="text-2xl font-headline">Create a Learning Path</CardTitle>
          </div>
          <CardDescription>
            Use AI to instantly generate a tailored reading course for your students. Just provide the topic and student details.
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
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System, Dinosaurs, Ancient Rome" {...field} />
                        </FormControl>
                        <FormDescription>What subject do you want to teach?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentGroupDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Group Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A class of 2nd graders who enjoy stories about animals and adventure."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe your students to help tailor the content.</FormDescription>
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
                            <FormLabel>Age Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select an age range" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="5-6">5-6 years</SelectItem>
                                <SelectItem value="7-8">7-8 years</SelectItem>
                                <SelectItem value="9-10">9-10 years</SelectItem>
                                <SelectItem value="11-12">11-12 years</SelectItem>
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
                            <FormLabel>Reading Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a reading level" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
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
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="de">German</SelectItem>
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
                    Generating...
                  </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Learning Path
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
            <p className="text-muted-foreground">Our AI is crafting the perfect learning path... Please wait.</p>
        </div>
      )}

      {learningPath && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Generated Learning Path</CardTitle>
                <CardDescription>Here is the AI-suggested learning path based on your criteria. You can now save it for your students.</CardDescription>
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
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Learning Path"}
                </Button>
            </CardFooter>
        </Card>
      )}
    </>
  );
}
