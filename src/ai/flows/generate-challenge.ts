'use server';
/**
 * @fileOverview Generates reading challenges with content from public sources like Project Gutenberg
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateChallengeInputSchema = z.object({
    topic: z.string().describe('The topic for the challenge.'),
    language: z.enum(['en', 'de']).describe('The language of the challenge content.'),
    age_range: z.string().describe('The age range of the students (e.g., "7-8", "9-10").'),
    reading_level: z.enum(['beginner', 'intermediate', 'advanced']).describe('The reading level.'),
    class_description: z.string().describe('Description of the student class.'),
    preferred_sources: z.array(z.string()).optional().describe('Preferred book sources or authors.'),
});

export type GenerateChallengeInput = z.infer<typeof GenerateChallengeInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string().describe('The quiz question.'),
    option_a: z.string().describe('Option A.'),
    option_b: z.string().describe('Option B.'),
    option_c: z.string().describe('Option C.'),
    option_d: z.string().describe('Option D.'),
    correct_answer: z.enum(['a', 'b', 'c', 'd']).describe('The correct answer.'),
    points_value: z.number().default(5).describe('Points for this question.'),
});

const ChallengeItemSchema = z.object({
    type: z.enum(['text', 'quiz']).describe('The type of challenge item.'),
    title: z.string().describe('The title of the item.'),
    content: z.string().describe('The content (text passage or quiz instructions).'),
    source_reference: z.string().optional().describe('Reference to the source book/author.'),
    word_count: z.number().optional().describe('Word count for text items.'),
    estimated_reading_time: z.number().optional().describe('Estimated reading time in seconds.'),
    points_value: z.number().default(10).describe('Points for completing this item.'),
    questions: z.array(QuizQuestionSchema).optional().describe('Quiz questions if type is quiz.'),
});

const GenerateChallengeOutputSchema = z.object({
    title: z.string().describe('The challenge title.'),
    description: z.string().describe('The challenge description.'),
    total_points: z.number().describe('Total points available.'),
    estimated_time_minutes: z.number().describe('Estimated completion time in minutes.'),
    time_limit_minutes: z.number().optional().describe('Optional time limit for the challenge.'),
    source_references: z.array(z.string()).describe('List of source books/authors used.'),
    items: z.array(ChallengeItemSchema).describe('The challenge items.'),
});

export type GenerateChallengeOutput = z.infer<typeof GenerateChallengeOutputSchema>;

export async function generateChallenge(
    input: GenerateChallengeInput
): Promise<GenerateChallengeOutput> {
    return generateChallengeFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateChallengePrompt',
    input: { schema: GenerateChallengeInputSchema },
    output: { schema: GenerateChallengeOutputSchema },
    prompt: `You are an expert teacher creating reading challenges for children using content from public domain books and child-safe sources.

Create a reading challenge with the following requirements:

Topic: {{{topic}}}
Language: {{{language}}}
Age Range: {{{age_range}}}
Reading Level: {{{reading_level}}}
Class Description: {{{class_description}}}

IMPORTANT GUIDELINES:

1. **Source Selection**: Use content from public domain sources like:
   - Project Gutenberg classics adapted for children
   - Classic fairy tales and folk stories
   - Educational texts appropriate for the age group
   - Well-known children's literature in the public domain

2. **Content Structure**: Create 3-5 items alternating between text passages and quizzes:
   - Start with an engaging text passage (150-400 words depending on age)
   - Follow with comprehension quiz (3-5 questions)
   - Add another text passage building on the topic
   - End with a final quiz testing overall understanding

3. **Age Appropriateness**:
   - Ages 5-6: Very simple sentences, basic vocabulary, 100-150 words per passage
   - Ages 7-8: Simple sentences, familiar words, 150-250 words per passage
   - Ages 9-10: More complex sentences, expanded vocabulary, 250-350 words per passage
   - Ages 11-12: Advanced sentences, challenging vocabulary, 350-500 words per passage

4. **Language Considerations**:
   - For German: Use age-appropriate German vocabulary and sentence structure
   - For English: Use clear, engaging English appropriate for the reading level

5. **Quiz Design**:
   - Multiple choice questions with 4 options
   - Mix of literal comprehension and inference questions
   - Include vocabulary questions when appropriate
   - Make incorrect options plausible but clearly wrong

6. **Safety**: Ensure all content is:
   - Age-appropriate and child-safe
   - Free from violence, scary themes, or inappropriate content
   - Positive and educational
   - Culturally sensitive

7. **Engagement**: Make the content:
   - Interesting and relevant to the topic
   - Connected to children's experiences
   - Progressive in difficulty
   - Rewarding to complete

Example structure:
- Text Passage 1: Introduction to topic with story/example
- Quiz 1: Basic comprehension (3-4 questions)
- Text Passage 2: Deeper exploration of topic
- Quiz 2: Advanced comprehension and application (4-5 questions)
- Optional Text Passage 3: Conclusion or extension
- Final Quiz: Overall understanding (3-4 questions)

Calculate appropriate points (10-20 per text, 5 per quiz question) and time estimates (1-2 minutes per 100 words for reading, 30-60 seconds per quiz question).

Always include source references for any adapted content.`,
});

const generateChallengeFlow = ai.defineFlow(
    {
        name: 'generateChallengeFlow',
        inputSchema: GenerateChallengeInputSchema,
        outputSchema: GenerateChallengeOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);