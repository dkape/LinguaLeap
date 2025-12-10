'use server';

/**
 * @fileOverview A flow to generate reading comprehension quiz questions based on the text content of a level.
 *
 * - generateQuizQuestions - A function that generates quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  textContent: z.string().describe('The text content of the reading level.'),
  numberOfQuestions: z.number().describe('The number of quiz questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The multiple choice options for the question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an experienced teacher creating a quiz for your students to test their reading comprehension.

  Generate {{numberOfQuestions}} multiple-choice questions based on the following text content. Each question should have 4 answer options, and clearly indicate the correct answer.

  Text Content: {{{textContent}}}

  Ensure the questions assess the student's understanding of the text and are not simply recall questions. Focus on key concepts, inferences, and the overall meaning of the text.

  Format the output as a JSON object with a "questions" array. Each object in the array should have fields for "question", "options" and "answer". The answer field should be one of the options.
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateQuizQuestionsPrompt(input);
    return output!;
  }
);
