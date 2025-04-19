const axios = require('axios');
const OPENAI_API_KEY = '{{OPENAI_API_KEY}}' // Removed for privacy reasons; 

const openAiRequest = async (messages) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error making request to OpenAI:', error.message);
    throw new Error('Failed to get response from OpenAI.');
  }
};

async function groqChatCompletion(messages) {
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model : "mixtral-8x7b-32768",
      messages
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

const openAiRequestWithFunctionCalling = async (messages) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        functions: [
          {
            name: "generate_questions",
            description: "Generate multiple choice questions",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      a: { type: "string" },
                      b: { type: "string" },
                      c: { type: "string" },
                      d: { type: "string" },
                      answer: { type: "string", enum: ["a", "b", "c", "d"] },
                      difficulty: { type: "string", enum: ["low", "medium", "high"] },
                      mark: { type: "number", enum: [1, 1.5, 2] }
                    },
                    required: ["question", "a", "b", "c", "d", "answer", "difficulty", "mark"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        ],
        function_call: { name: "generate_questions" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const functionCall = response.data.choices[0].message.function_call;
    if (functionCall && functionCall.name === "generate_questions") {
      const questionsData = JSON.parse(functionCall.arguments);
      return questionsData.questions;
    } else {
      throw new Error('Unexpected response format from OpenAI');
    }
  } catch (error) {
    console.error('Error making request to OpenAI:', error.message);
    throw new Error('Failed to get response from OpenAI.');
  }
};

// Function to call OpenAI API with function calling capabilities
const openAiRequestWithFunctionCallingForQuickQuestion = async (messages) => {
  try {
    console.log("Preparing request to OpenAI with messages:", JSON.stringify(messages, null, 2));
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        functions: [
          {
            name: "generate_questions",
            description: "Generate multiple choice questions with unique IDs",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "Unique UUID for the question" },
                      text: { type: "string", description: "The full text of the question" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", description: "Unique UUID for the option" },
                            text: { type: "string", description: "Option text" }
                          },
                          required: ["id", "text"]
                        },
                        description: "List of options for the question"
                      },
                      answer: { type: "string", description: "The UUID of the correct option" },
                      difficulty: { type: "string", enum: ["low", "medium", "high"], description: "Difficulty level of the question" },
                      marks: { type: "number", enum: [1, 1.5, 2], description: "Marks awarded for the question based on difficulty" }
                    },
                    required: ["id", "text", "options", "answer", "difficulty", "marks"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        ],
        function_call: { name: "generate_questions" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    console.log("OpenAI response status:", response.status);
    console.log("OpenAI response data:", JSON.stringify(response.data, null, 2));

    const functionCall = response.data.choices[0].message.function_call;
    if (functionCall && functionCall.name === "generate_questions") {
      const questionsData = JSON.parse(functionCall.arguments);
      console.log("Parsed questions data:", questionsData);

      return questionsData.questions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options.map((opt) => ({
          id: opt.id,
          text: opt.text
        })),
        answer: question.answer,
        marks: question.marks,
        difficulty: question.difficulty
      }));
    } else {
      console.error("Unexpected response format from OpenAI:", response.data);
      throw new Error('Unexpected response format from OpenAI');
    }
  } catch (error) {
    console.error('Error making request to OpenAI:', error.message);
    throw new Error('Failed to get response from OpenAI.');
  }
};



module.exports = {
  openAiRequest,
  groqChatCompletion,
  openAiRequestWithFunctionCalling,
  openAiRequestWithFunctionCallingForQuickQuestion
}
