'use client';

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
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  studentGroupDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  ageRange: z.string(),
  readingLevel: z.string(),
  language: z.string(),
});

export function CreateLearningPathForm() {
  const { api } = useAuth();
  const { toast } = useToast();
  const [generatedPath, setGeneratedPath] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      const response = await api.post("/learning-paths/generate", values);
      setGeneratedPath(response.data);
      toast({ title: "Success!", description: "Learning path generated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error!", description: "Failed to generate learning path." });
    }
    setIsGenerating(false);
  }

  async function onSave() {
    setIsSaving(true);
    try {
      await api.post("/learning-paths", generatedPath);
      toast({ title: "Success!", description: "Learning path saved." });
      setGeneratedPath(null);
      form.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Error!", description: "Failed to save learning path." });
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
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. The Solar System" {...field} />
                </FormControl>
                <FormDescription>What is the main topic of this learning path?</FormDescription>
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
                  <Textarea placeholder="e.g. A group of 2nd graders who love space." {...field} />
                </FormControl>
                <FormDescription>Describe the students this path is for.</FormDescription>
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
                  <FormLabel>Age Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an age range" />
                      </SelectTrigger>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reading level" />
                      </SelectTrigger>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
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
          <Button type="submit" disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            {isGenerating ? "Generating..." : "Generate with AI"}
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
            {generatedPath.levels.map((level: any, index: number) => (
              <div key={index}>
                <h3 className="font-semibold">Level {index + 1}: {level.title}</h3>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            ))}
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Learning Path"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
