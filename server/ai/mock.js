async function generateLearningPathWithAI(input) {
  console.log('Using mock AI to generate learning path with input:', input);

  // Return a hardcoded, realistic-looking learning path
  return {
    learningPath: [
      {
        title: `Introduction to ${input.topic}`,
        type: 'text',
        content: `This is a mock introductory text about ${input.topic} for ${input.ageRange} year olds. The content is generated to be at a ${input.readingLevel} level in ${input.language}.`
      },
      {
        title: `Quiz 1: Basic Concepts of ${input.topic}`,
        type: 'quiz',
        content: `Question 1: What is the main idea of ${input.topic}?\nA) Mock Answer 1\nB) Mock Answer 2\nC) Mock Answer 3\nD) Mock Answer 4`
      },
      {
        title: `Deep Dive into ${input.topic}`,
        type: 'text',
        content: `This is a more detailed text about ${input.topic}. It explores more complex ideas suitable for the specified student group.`
      },
      {
        title: `Quiz 2: Advanced Concepts of ${input.topic}`,
        type: 'quiz',
        content: `Question 1: What is a key detail about ${input.topic}?\nA) Detail A\nB) Detail B\nC) Detail C\nD) Detail D`
      }
    ]
  };
}

module.exports = { generateLearningPathWithAI };
