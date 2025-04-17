'use server';

import { OpenAI } from "openai";

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"; 

// Initialize Azure OpenAI client using the OpenAI SDK with Azure configuration
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
  defaultQuery: { "api-version": "2023-12-01-preview" },
  defaultHeaders: { "api-key": apiKey }
});

/**
 * Analyze file contents and create a study plan
 * @param {Array} fileContents - Array of file content objects {name, content, type}
 * @param {Object} courseInfo - Course metadata (name, description, etc.)
 * @returns {Promise<Object>} - The generated study plan
 */
export async function analyzeContent(fileContents, courseInfo) {
  try {
    // Combine all file contents into a single context
    const context = fileContents.map(file => 
      `File: ${file.name}\n${file.content.substring(0, 10000)}\n\n`
    ).join('');

    // Create a system message that instructs the AI how to generate a study plan
    const systemMessage = `You are an expert educational planner and tutor specialized in creating optimized study plans.
Your task is to analyze the provided course materials and create a comprehensive study plan.
The study plan should include:
1. A weekly schedule for studying the material
2. Key topics to focus on and their priority
3. Recommended study techniques for each topic
4. Practice exercises or questions
5. Milestones and learning goals

Format the study plan in a structured JSON object with the following structure:
{
  "overview": "A paragraph summarizing the study plan",
  "topics": [
    { "title": "Topic name", "description": "Topic description", "priority": "High/Medium/Low" }
  ],
  "schedule": {
    "weeks": [
      { 
        "days": [
          {
            "day": "Monday",
            "duration": "2 hours",
            "activities": ["Activity 1", "Activity 2"]
          }
        ]
      }
    ]
  },
  "techniques": [
    { "name": "Technique name", "description": "Technique description" }
  ],
  "resources": [
    { "title": "Resource name", "description": "Resource description", "url": "URL if available" }
  ]
}`;

    // Create a user message with course details and content from files
    const userMessage = `I need a detailed study plan for my course "${courseInfo.name}". 
Course Description: ${courseInfo.description || 'Not specified'}
Duration: ${courseInfo.estimatedHours ? `${courseInfo.estimatedHours} hours` : 'Not specified'}
Difficulty Level: ${
  courseInfo.difficultyLevel === 'beginner' ? 'Beginner' : 
  courseInfo.difficultyLevel === 'medium' ? 'Intermediate' : 
  courseInfo.difficultyLevel === 'advanced' ? 'Advanced' : 'Not specified'
}
Start Date: ${courseInfo.startDate || 'Not specified'}
End Date: ${courseInfo.endDate || 'Not specified'}
Subject: ${courseInfo.subject || 'Not specified'}

Here are the course materials:
${context}

Based on these materials, please create a comprehensive study plan that will help me master this subject efficiently.`;

    // Generate the study plan using OpenAI
    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Extract and parse the generated study plan
    const studyPlanText = result.choices[0].message.content;
    
    try {
      // Try to parse JSON from the response
      const jsonMatch = studyPlanText.match(/```json\n([\s\S]*?)\n```/) || 
                        studyPlanText.match(/```\n([\s\S]*?)\n```/) ||
                        studyPlanText.match(/{[\s\S]*}/);
                        
      const jsonString = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : studyPlanText;
      const studyPlan = JSON.parse(jsonString);
      
      return studyPlan;
    } catch (parseError) {
      console.error("Error parsing study plan JSON:", parseError);
      
      // If parsing fails, return a structured object with the raw text
      return {
        overview: "We encountered an issue formatting your study plan. Here's the raw plan:",
        rawPlan: studyPlanText,
        topics: [],
        schedule: { weeks: [] },
        techniques: [],
        resources: []
      };
    }
  } catch (error) {
    console.error("Error analyzing content with Azure OpenAI:", error);
    throw error;
  }
}

/**
 * Extract text content from a PDF file
 * @param {string} fileUrl - URL of the file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
async function extractTextFromFile(fileUrl) {
  try {
    // For now, we'll use a simple fetch and assume text files
    // In a production app, you would use appropriate libraries for different file types
    const response = await fetch(fileUrl);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return '';
  }
}

/**
 * Generate a study plan based on course material
 * @param {Object} course - The course object
 * @param {Array} files - Array of files associated with the course
 * @returns {Promise<Object>} - The generated study plan
 */
export async function generateStudyPlan(course, files) {
  try {
    // Extract text from all files
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const text = await extractTextFromFile(file.url);
        return {
          name: file.name,
          content: text.substring(0, 10000) // Limit text size to avoid token limits
        };
      })
    );

    // Analyze content and generate study plan
    const analysisResult = await analyzeContent(fileContents, course);
    
    // Return the generated study plan
    return {
      text: JSON.stringify(analysisResult),
      plan: analysisResult,
      generated: new Date().toISOString(),
      courseId: course.$id,
    };
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
}