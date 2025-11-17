'use client';

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import { generateChallenge, GenerateChallengeOutput } from "@/ai/flows/generate-challenge";
import { Loader2, Wand2, BookText, FileQuestion, Clock, Trophy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/locale-context';
import axios from 'axios';

interface ChallengeItem {
  type: 'text' | 'quiz';
  title: string;
  content: string;
  points_value: number;
  estimated_reading_time?: number;
  questions?: ChallengeQuestion[];
  source_reference?: string;
  word_count?: number;
  pointsValue?: number;
  estimatedReadingTime?: number;
}

interface ChallengeQuestion {
  question: string;
  points_value: number;
  correct_answer: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  pointsValue?: number;
  correctAnswer?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
}

interface StudentClass {
  _id: string;
  name: string;
  language: 'de' | 'en';
  age_range: string;
  student_count: number;
}

interface ExistingChallenge {
  _id: string;
  title: string;
  description: string;
  total_points: number;
  time_limit_minutes?: number;
  estimated_time_minutes?: number;
  isActive: boolean;
  topic: string;
  class_description: string;
  age_range: string;
  reading_level: 'beginner' | 'intermediate' | 'advanced';
  language: 'en' | 'de';
  class_id?: string;
  source_references?: { title?: string; url?: string }[];
  items?: ChallengeItem[];
}

const formSchema = z.object({
  topic: z.string().min(3, { message: "Thema muss mindestens 3 Zeichen lang sein." }),
  class_description: z.string().min(10, { message: "Beschreibung muss mindestens 10 Zeichen lang sein." }),
  age_range: z.string({ required_error: "Bitte wählen Sie einen Altersbereich." }),
  reading_level: z.enum(['beginner', 'intermediate', 'advanced'], { required_error: "Bitte wählen Sie ein Leseniveau." }),
  language: z.enum(['en', 'de']),
  class_id: z.string().optional(),
});

export function CreateChallengeForm() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [existingChallenges, setExistingChallenges] = useState<ExistingChallenge[]>([]);
  const [editingChallenge, setEditingChallenge] = useState<ExistingChallenge | null>(null);
  const [challenge, setChallenge] = useState<GenerateChallengeOutput | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const generatedCardRef = useRef<HTMLDivElement | null>(null);
    // Scroll to the generated card when it appears
    useEffect(() => {
      if (challenge && generatedCardRef.current) {
        generatedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [challenge]);
  const [isSaving, setIsSaving] = useState(false);
  const [fullEditingChallengeDetails, setFullEditingChallengeDetails] = useState<ExistingChallenge | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { toast } = useToast();
  const { dict } = useTranslation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      class_description: "",
      language: "de",
    },
  });

  useEffect(() => {
    fetchClasses();
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (editingChallenge) {
      form.reset({
        topic: editingChallenge.topic,
        class_description: editingChallenge.class_description,
        age_range: editingChallenge.age_range,
        reading_level: editingChallenge.reading_level,
        language: editingChallenge.language,
        class_id: editingChallenge.class_id,
      });
    } else {
      form.reset();
    }
  }, [editingChallenge, form]);

  useEffect(() => {
    if (editingChallenge) {
      const fetchChallengeDetails = async () => {
        setIsLoadingDetails(true);
        setFullEditingChallengeDetails(null);
        try {
          const response = await axios.get(`/challenges/${editingChallenge._id}`);
          setFullEditingChallengeDetails(response.data);
        } catch (error) {
          console.error('Error fetching challenge details:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load challenge details.",
          });
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchChallengeDetails();
    } else {
      setFullEditingChallengeDetails(null);
    }
  }, [editingChallenge, toast]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/classes/teacher');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/challenges/teacher');
      setExistingChallenges(response.data.challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setChallenge(null);
    try {
      const result = await generateChallenge({
        topic: values.topic,
        language: values.language,
        age_range: values.age_range,
        reading_level: values.reading_level,
        class_description: values.class_description,
      });
      setChallenge(result);
      toast({
        title: dict.createChallengeForm.successToastTitle,
        description: dict.createChallengeForm.successToastDescription,
      });
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        variant: "destructive",
        title: dict.createChallengeForm.errorToastTitle,
        description: dict.createChallengeForm.errorToastDescription,
      });
    }
  }

  async function onSaveChallenge() {
    if (!challenge) return;
    
    setIsSaving(true);
    try {
      const formValues = form.getValues();
      await axios.post("/challenges", {
        title: challenge.title,
        description: challenge.description,
        topic: formValues.topic,
        language: formValues.language,
        age_range: formValues.age_range,
        reading_level: formValues.reading_level,
        class_id: formValues.class_id || null,
        total_points: challenge.total_points,
        time_limit_minutes: challenge.estimated_time_minutes,
        items: challenge.items.map((item: ChallengeItem, index: number) => ({
          type: item.type,
          title: item.title,
          content: item.content,
          pointsValue: item.points_value,
          orderIndex: index,
          estimatedReadingTime: item.estimated_reading_time || 60,
          questions: (item.questions || []).map((q: ChallengeQuestion, qIndex: number) => ({
            question: q.question,
            pointsValue: q.points_value,
            orderIndex: qIndex,
            correctAnswer: q.correct_answer,
            optionA: q.option_a,
            optionB: q.option_b,
            optionC: q.option_c,
            optionD: q.option_d
          }))
        })),
      });
      
      toast({
        title: dict.createChallengeForm.saveSuccessToastTitle,
        description: dict.createChallengeForm.saveSuccessToastDescription,
      });
      setChallenge(null);
      form.reset();
    } catch (error) {
      console.error("Error saving challenge:", error);
      toast({
        variant: "destructive",
        title: dict.createChallengeForm.saveErrorToastTitle,
        description: dict.createChallengeForm.saveErrorToastDescription,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const toggleChallengeStatus = async (challengeId: string) => {
    setIsTogglingStatus(challengeId);
    try {
      const response = await axios.patch(`/challenges/${challengeId}/toggle-status`);
      setExistingChallenges((prev: ExistingChallenge[]) => 
        prev.map((c: ExistingChallenge) => c._id === challengeId ? { ...c, isActive: response.data.isActive } : c)
      );
      toast({
        title: dict.createChallengeForm.statusUpdateSuccessTitle,
        description: response.data.isActive 
          ? dict.createChallengeForm.statusUpdateSuccessDescriptionActive 
          : dict.createChallengeForm.statusUpdateSuccessDescriptionInactive,
      });
    } catch (error) {
      console.error('Error toggling challenge status:', error);
      toast({
        variant: "destructive",
        title: dict.createChallengeForm.statusUpdateErrorTitle,
        description: dict.createChallengeForm.statusUpdateErrorDescription,
      });
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      {existingChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{dict.createChallengeForm.existingChallengesTitle}</CardTitle>
            <CardDescription>{dict.createChallengeForm.existingChallengesDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {existingChallenges.map((challenge: ExistingChallenge) => (
              <Card key={challenge._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span><Trophy className="inline-block w-4 h-4 mr-1" /> {challenge.total_points} {dict.createChallengeForm.pointsLabel}</span>
                    <span><Clock className="inline-block w-4 h-4 mr-1" /> {challenge.time_limit_minutes} {dict.createChallengeForm.minutesLabel}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant={challenge.isActive ? "secondary" : "default"} 
                    size="sm" 
                    onClick={() => toggleChallengeStatus(challenge._id)}
                    disabled={isTogglingStatus === challenge._id}
                  >
                    {isTogglingStatus === challenge._id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      challenge.isActive ? dict.createChallengeForm.deactivate : dict.createChallengeForm.activate
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingChallenge(challenge)}>
                      {dict.common.edit}
                  </Button>
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
            <CardTitle className="text-2xl font-headline">{dict.createChallengeForm.title}</CardTitle>
          </div>
          <CardDescription>
            {dict.createChallengeForm.description}
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
                        <FormLabel>{dict.createChallengeForm.topicLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={dict.createChallengeForm.topicPlaceholder} {...field} />
                        </FormControl>
                        <FormDescription>{dict.createChallengeForm.topicDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.createChallengeForm.classDescriptionLabel}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={dict.createChallengeForm.classDescriptionPlaceholder}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{dict.createChallengeForm.classDescriptionDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="age_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.createChallengeForm.ageRangeLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={dict.createChallengeForm.ageRangePlaceholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5-6">{dict.createChallengeForm.ageRange5_6}</SelectItem>
                            <SelectItem value="7-8">{dict.createChallengeForm.ageRange7_8}</SelectItem>
                            <SelectItem value="9-10">{dict.createChallengeForm.ageRange9_10}</SelectItem>
                            <SelectItem value="11-12">{dict.createChallengeForm.ageRange11_12}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reading_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.createChallengeForm.readingLevelLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={dict.createChallengeForm.readingLevelPlaceholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">{dict.createChallengeForm.readingLevelBeginner}</SelectItem>
                            <SelectItem value="intermediate">{dict.createChallengeForm.readingLevelIntermediate}</SelectItem>
                            <SelectItem value="advanced">{dict.createChallengeForm.readingLevelAdvanced}</SelectItem>
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
                        <FormLabel>{dict.createChallengeForm.languageLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={dict.createChallengeForm.languagePlaceholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="de">{dict.createChallengeForm.languageGerman}</SelectItem>
                            <SelectItem value="en">{dict.createChallengeForm.languageEnglish}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dict.createChallengeForm.assignToClassLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={dict.createChallengeForm.assignToClassPlaceholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls: StudentClass) => (
                              <SelectItem key={cls._id} value={cls._id}>
                                {cls.name} ({cls.student_count} {dict.createChallengeForm.studentsLabel})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>{dict.createChallengeForm.assignToClassDescription}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {editingChallenge ? 'Update Challenge' : dict.createChallengeForm.generateButton}
              </Button>
              {editingChallenge && (
                <Button variant="ghost" onClick={() => setEditingChallenge(null)}>
                  {dict.common.cancel}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {isSubmitting && (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">{dict.createChallengeForm.generatingMessage}</p>
        </div>
      )}

      {isLoadingDetails && (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading challenge details...</p>
        </div>
      )}

      {(challenge || fullEditingChallengeDetails) && (() => {
        const challengeToDisplay = challenge || fullEditingChallengeDetails;
        if (!challengeToDisplay) return null;
        return (
          <Card className="mt-8" ref={generatedCardRef}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{challengeToDisplay.title}</CardTitle>
              <CardDescription>{challengeToDisplay.description}</CardDescription>
              <div className="flex gap-4 mt-4">
                <Badge variant="secondary">
                  <Trophy className="mr-1 h-3 w-3" />
                  {challengeToDisplay.total_points} {dict.createChallengeForm.pointsLabel}
                </Badge>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  ~{challengeToDisplay.estimated_time_minutes} {dict.createChallengeForm.minutesLabel}
                </Badge>
                {challengeToDisplay.items &&
                  <Badge variant="secondary">
                    <BookText className="mr-1 h-3 w-3" />
                    {challengeToDisplay.items.length} {dict.createChallengeForm.tasksLabel}
                  </Badge>
                }
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challengeToDisplay.source_references && challengeToDisplay.source_references.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{dict.createChallengeForm.sourcesLabel}</h4>
                    <div className="flex flex-wrap gap-2">
                      {challengeToDisplay.source_references.map((source: { title?: string; url?: string } | string, index: number) => (
                        <Badge key={index} variant="outline">{typeof source === 'string' ? source : source.title || source.url}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {challengeToDisplay.items &&
                  <Accordion type="single" collapsible className="w-full">
                    {challengeToDisplay.items.map((item: ChallengeItem, index: number) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg">
                          <div className="flex items-center gap-2">
                            {item.type === 'text' ? (
                              <BookText className="h-5 w-5 text-primary" />
                            ) : (
                              <FileQuestion className="h-5 w-5 text-accent" />
                            )}
                            <span>{item.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {item.pointsValue || item.points_value} {dict.createChallengeForm.pointsLabel}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose max-w-none text-foreground/90 p-4 bg-muted/50 rounded-md">
                          <div className="space-y-4">
                            <pre className="whitespace-pre-wrap font-sans text-sm bg-transparent p-0 border-0">
                              {item.content}
                            </pre>

                            {item.source_reference && (
                              <p className="text-xs text-muted-foreground italic">
                                {dict.createChallengeForm.sourceLabel}: {item.source_reference}
                              </p>
                            )}

                            {item.word_count && (
                              <p className="text-xs text-muted-foreground">
                                {dict.createChallengeForm.wordsLabel}: {item.word_count} | {dict.createChallengeForm.estimatedReadingTimeLabel}: {Math.ceil((item.estimated_reading_time || item.estimatedReadingTime || 0) / 60)} {dict.createChallengeForm.minutesLabel}
                              </p>
                            )}

                            {item.questions && item.questions.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-semibold mb-2">{dict.createChallengeForm.quizQuestionsLabel}</h5>
                                {item.questions.map((question: ChallengeQuestion, qIndex: number) => (
                                  <div key={qIndex} className="mb-4 p-3 border rounded">
                                    <p className="font-medium mb-2">{question.question}</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className={(question.correct_answer || question.correctAnswer) === 'a' ? 'font-bold text-green-600' : ''}>
                                        A) {question.option_a || question.optionA}
                                      </div>
                                      <div className={(question.correct_answer || question.correctAnswer) === 'b' ? 'font-bold text-green-600' : ''}>
                                        B) {question.option_b || question.optionB}
                                      </div>
                                      <div className={(question.correct_answer || question.correctAnswer) === 'c' ? 'font-bold text-green-600' : ''}>
                                        C) {question.option_c || question.optionC}
                                      </div>
                                      <div className={(question.correct_answer || question.correctAnswer) === 'd' ? 'font-bold text-green-600' : ''}>
                                        D) {question.option_d || question.optionD}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {dict.createChallengeForm.pointsLabel}: {question.points_value || question.pointsValue}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                }
              </div>
            </CardContent>
            {challenge && (
              <CardFooter>
                <Button onClick={onSaveChallenge} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {dict.createChallengeForm.savingButton}
                    </>
                  ) : (
                    dict.createChallengeForm.saveButton
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        )
      })()}
    </div>
  );
}