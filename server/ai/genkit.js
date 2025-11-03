const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');

// Configure Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});

module.exports = { ai };
