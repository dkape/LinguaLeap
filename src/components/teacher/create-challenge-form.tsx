'use client';

import { useState, useEffect } from 'react';
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

import axios from 'axios';

interface StudentClass {
  id: number;
  name: string;
  language: 'de' | 'en';
  age_range: string;
  student_count: number;
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
  const [challenge, setChallenge] = useState<GenerateChallengeOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
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
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/classes/teacher');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
        title: "Erfolg!",
        description: "Ihre neue Herausforderung wurde generiert.",
      });
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        variant: "destructive",
        title: "Fehler!",
        description: "Es gab ein Problem beim Generieren der Herausforderung. Bitte versuchen Sie es erneut.",
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
        class_id: formValues.class_id ? parseInt(formValues.class_id) : null,
        total_points: challenge.total_points,
        time_limit_minutes: challenge.estimated_time_minutes,
        items: challenge.items.map((item) => ({
          type: item.type,
          title: item.title,
          content: item.content,
          points_value: item.points_value,
          time_estimate_seconds: item.estimated_reading_time || 60,
          questions: item.questions || []
        })),
      });
      
      toast({
        title: "Herausforderung gespeichert!",
        description: "Die neue Herausforderung ist jetzt für Ihre Schüler verfügbar.",
      });
      setChallenge(null);
      form.reset();
    } catch (error) {
      console.error("Error saving challenge:", error);
      toast({
        variant: "destructive",
        title: "Speichern fehlgeschlagen",
        description: "Die Herausforderung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Wand2 className='h-6 w-6 text-primary' />
            <CardTitle className="text-2xl font-headline">Herausforderung erstellen</CardTitle>
          </div>
          <CardDescription>
            Verwenden Sie KI, um sofort eine maßgeschneiderte Lese-Herausforderung für Ihre Schüler zu generieren. 
            Geben Sie einfach das Thema und die Schülerdetails an.
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
                        <FormLabel>Thema</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Das Sonnensystem, Dinosaurier, Märchen" {...field} />
                        </FormControl>
                        <FormDescription>Welches Thema möchten Sie unterrichten?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klassenbeschreibung</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="z.B. Eine Klasse von 2. Klässlern, die gerne Geschichten über Tiere und Abenteuer hören."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Beschreiben Sie Ihre Schüler, um den Inhalt anzupassen.</FormDescription>
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
                        <FormLabel>Altersbereich</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Altersbereich wählen" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5-6">5-6 Jahre</SelectItem>
                            <SelectItem value="7-8">7-8 Jahre</SelectItem>
                            <SelectItem value="9-10">9-10 Jahre</SelectItem>
                            <SelectItem value="11-12">11-12 Jahre</SelectItem>
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
                        <FormLabel>Leseniveau</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Leseniveau wählen" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Anfänger</SelectItem>
                            <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                            <SelectItem value="advanced">Experte</SelectItem>
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
                        <FormLabel>Sprache</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Sprache wählen" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="en">Englisch</SelectItem>
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
                        <FormLabel>Klasse zuweisen (optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Klasse wählen" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Keine Klasse</SelectItem>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id.toString()}>
                                {cls.name} ({cls.student_count} Schüler)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Wählen Sie eine Klasse, um die Herausforderung zuzuweisen.</FormDescription>
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
                    Generiere...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Herausforderung generieren
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
          <p className="text-muted-foreground">Unsere KI erstellt die perfekte Herausforderung... Bitte warten.</p>
        </div>
      )}

      {challenge && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
            <div className="flex gap-4 mt-4">
              <Badge variant="secondary">
                <Trophy className="mr-1 h-3 w-3" />
                {challenge.total_points} Punkte
              </Badge>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                ~{challenge.estimated_time_minutes} Min
              </Badge>
              <Badge variant="secondary">
                <BookText className="mr-1 h-3 w-3" />
                {challenge.items.length} Aufgaben
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Quellen:</h4>
                <div className="flex flex-wrap gap-2">
                  {challenge.source_references.map((source, index) => (
                    <Badge key={index} variant="outline">{source}</Badge>
                  ))}
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {challenge.items.map((item, index) => (
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
                          {item.points_value} Punkte
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
                            Quelle: {item.source_reference}
                          </p>
                        )}
                        
                        {item.word_count && (
                          <p className="text-xs text-muted-foreground">
                            Wörter: {item.word_count} | Geschätzte Lesezeit: {Math.ceil((item.estimated_reading_time || 0) / 60)} Min
                          </p>
                        )}
                        
                        {item.questions && item.questions.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold mb-2">Quiz-Fragen:</h5>
                            {item.questions.map((question, qIndex) => (
                              <div key={qIndex} className="mb-4 p-3 border rounded">
                                <p className="font-medium mb-2">{question.question}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className={question.correct_answer === 'a' ? 'font-bold text-green-600' : ''}>
                                    A) {question.option_a}
                                  </div>
                                  <div className={question.correct_answer === 'b' ? 'font-bold text-green-600' : ''}>
                                    B) {question.option_b}
                                  </div>
                                  <div className={question.correct_answer === 'c' ? 'font-bold text-green-600' : ''}>
                                    C) {question.option_c}
                                  </div>
                                  <div className={question.correct_answer === 'd' ? 'font-bold text-green-600' : ''}>
                                    D) {question.option_d}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Punkte: {question.points_value}
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
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onSaveChallenge} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speichere...
                </>
              ) : (
                "Herausforderung speichern"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}