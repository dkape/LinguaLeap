'use server';
/**
 * @fileOverview Generates a suggested learning path for a given topic and student group.
 *
 * - generateSuggestedLearningPath - A function that generates the learning path.
 * - GenerateSuggestedLearningPathInput - The input type for the generateSuggestedLearningPath function.
 * - GenerateSuggestedLearningPathOutput - The return type for the generateSuggestedLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestedLearningPathInputSchema = z.object({
  topic: z.string().describe('The topic for the learning path.'),
  studentGroupDescription: z
    .string()
    .describe('A description of the student group, including age range and reading level.'),
  ageRange: z.string().describe('The age range of the students in the group.'),
  readingLevel: z.string().describe('The reading level of the students in the group.'),
  language: z.enum(['en', 'de']).describe('The language of the learning path content.'),
});
export type GenerateSuggestedLearningPathInput = z.infer<typeof GenerateSuggestedLearningPathInputSchema>;

const LearningContentSchema = z.object({
  title: z.string().describe('The title of the learning material.'),
  type: z.enum(['text', 'quiz']).describe('The type of learning material.'),
  content: z.string().describe('The actual learning material content (text or quiz questions).'),
});

const GenerateSuggestedLearningPathOutputSchema = z.object({
  learningPath: z.array(LearningContentSchema).describe('A list of learning materials for the suggested learning path.'),
});
export type GenerateSuggestedLearningPathOutput = z.infer<typeof GenerateSuggestedLearningPathOutputSchema>;

export async function generateSuggestedLearningPath(
  input: GenerateSuggestedLearningPathInput
): Promise<GenerateSuggestedLearningPathOutput> {
  return generateSuggestedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuggestedLearningPathPrompt',
  input: {schema: GenerateSuggestedLearningPathInputSchema},
  output: {schema: GenerateSuggestedLearningPathOutputSchema},
  prompt: `You are an experienced teacher creating a learning path for a group of students.

  The learning path should be tailored to the following topic and student group:

  Topic: {{{topic}}}
  Student Group Description: {{{studentGroupDescription}}}
  Age Range: {{{ageRange}}}
  Reading Level: {{{readingLevel}}}
  Language: {{{language}}}

  Create a learning path consisting of age-appropriate texts and quizzes related to the topic.
  The learning path should be designed to improve reading comprehension and build knowledge on the topic.

  The output MUST be a JSON array of learning materials, each with a title, type (text or quiz), and content.
  Each learning material should be tailored to the specified student group's age and reading level.

  Example output:
  {
    "learningPath": [
      {
        "title": "Introduction to the Topic",
        "type": "text",
        "content": "This is an introductory text about the topic..."
      },
      {
        "title": "Quiz 1: Basic Concepts",
        "type": "quiz",
        "content": "Question 1: ...\nQuestion 2: ..."
      },
      // ... more learning materials ...
    ]
  }
  `,
});

const generateSuggestedLearningPathFlow = ai.defineFlow(
  {
    name: 'generateSuggestedLearningPathFlow',
    inputSchema: GenerateSuggestedLearningPathInputSchema,
    outputSchema: GenerateSuggestedLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
