const utils = require('../helper/openAI');
const errorMessages = require('../config/errorMessages.json');

const generateQuestionsHandler = async (category) => {
  try {
    const prompt = `You are an expert question generator, specialized in creating educational multiple-choice questions. Your task is to generate a set of 15 multiple-choice questions for the category: ${category}.

  Follow these guidelines:

  1. Create questions that cover a range of difficulty levels, from easy to challenging.
  2. Ensure that the questions are factual, clear, and unambiguous.
  3. Provide four distinct options for each question, labeled a, b, c, and d.
  4. Make sure that only one option is correct, and the others are plausible but incorrect.
  5. The correct answer should not follow any obvious pattern across questions.
  6. Assign a difficulty level to each question: "low", "medium", or "high".
  7. Assign marks to each question based on its difficulty: 1 for low, 1.5 for medium, 2 for high.

  For each question, provide the following information in this exact format:

  \`\`\`json
  {
    "question": "The full text of the question goes here?",
    "a": "First option",
    "b": "Second option",
    "c": "Third option",
    "d": "Fourth option",
    "answer": "a",
    "difficulty": "medium",
    "mark": 1.5
  }
  \`\`\`

  Remember:
  - The "answer" field should contain only the letter (a, b, c, or d) corresponding to the correct option.
  - The "difficulty" field should be one of "low", "medium", or "high".
  - The "mark" field should be 1 for low difficulty, 1.5 for medium difficulty, and 2 for high difficulty.
  - Ensure that each question and its options are factually accurate and appropriate for the given category.
  - Avoid repetitive or overly similar questions.
  - Double-check that the correct answer is indeed correct and unambiguous.
  - Provide a mix of difficulty levels across the 50 questions.
  - Must be provided a 50 questions.

  Now, please generate 15 multiple-choice questions for the category: ${category}. Provide your response as a valid JSON array of question objects.`;
    const messages = [
      {
        role: "system",
        content: "You are an AI assistant specialized in generating multiple-choice questions."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await utils.openAiRequestWithFunctionCalling(messages);
    return response;
  } catch (error) {
    console.error('Error in generating questions handler:', error.message);
    throw new Error(errorMessages.failedToGenerateQuestions);
  }
};

const generateQuickQuestionsHandler = async (category = [], difficulty = null, totalQuestion = 15) => {
  try {
    // Build the prompt based on the provided category and difficulty
    console.log("Building the prompt for categories:", category, "and difficulty:", difficulty);
    
    let prompt = `You are an expert question generator, specialized in creating educational multiple-choice questions.`;

    if (category.length > 0) {
      prompt += ` Your task is to generate a set of ${totalQuestion} multiple-choice questions specifically for the categories: ${category.join(', ')}.`;
    } else {
      prompt += ` Your task is to generate a set of ${totalQuestion} general multiple-choice questions.`;
    }

    if (difficulty) {
      prompt += ` The questions should only be of ${difficulty} difficulty level.`;
    } else {
      prompt += ` Create questions that cover a range of difficulty levels, from easy to challenging.`;
    }

    prompt += `
    Follow these guidelines:

    1. **Generate a unique UUID for each question's "id" field, and each option's "id" field.** Ensure UUIDs are standard, like "550e8400-e29b-41d4-a716-446655440000".
    2. Ensure that the questions are factual, clear, and unambiguous.
    3. Provide four distinct options for each question, labeled a, b, c, and d.
    4. Make sure that only one option is correct, and the others are plausible but incorrect.
    5. Assign a difficulty level to each question: "low", "medium", or "high".
    6. Assign marks to each question based on its difficulty: 1 for low, 1.5 for medium, 2 for high.

    For each question, provide the following information in this exact format:

    \`\`\`json
    {
      "id": "UUID for question", // Ensure this is a unique UUID in the format "550e8400-e29b-41d4-a716-446655440000"
      "text": "The full text of the question goes here?",
      "options": [
        { "id": "UUID for option 1", "text": "First option" }, // Unique UUID for each option
        { "id": "UUID for option 2", "text": "Second option" }, 
        { "id": "UUID for option 3", "text": "Third option" }, 
        { "id": "UUID for option 4", "text": "Fourth option" } 
      ],
      "answer": "UUID for the correct option", // Corresponding to the UUID of the correct option
      "marks": 1.5,
      "difficulty": "medium"
    }
    \`\`\`

    Remember:
    - **Ensure each "id" field is filled with a proper unique UUID for questions and options.**
    - Provide a mix of difficulty levels across the questions if no specific difficulty is mentioned.
    - Double-check that the correct answer is accurate and unambiguous.

    Now, please generate ${totalQuestion} multiple-choice questions as per the criteria above. Provide your response as a valid JSON array of question objects.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an AI assistant specialized in generating multiple-choice questions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    console.log("Sending request to OpenAI with messages:", JSON.stringify(messages, null, 2));
    
    const response = await utils.openAiRequestWithFunctionCallingForQuickQuestion(messages);
    const totalMarks = response.reduce((sum, question) => sum + (parseFloat(question.marks) || 0), 0);

    console.log("Received response from OpenAI:", response);
    console.log("Total marks:", totalMarks);

    
    return {response, totalMarks};
  } catch (error) {
    console.error('Error in generating questions handler:', error.message);
    throw new Error(errorMessages.failedToGenerateQuestions);
  }
};


module.exports = { generateQuestionsHandler, generateQuickQuestionsHandler};

