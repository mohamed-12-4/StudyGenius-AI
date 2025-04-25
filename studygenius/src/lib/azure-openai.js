'use server';

import { OpenAI } from "openai";

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "o3-mini"; 

// Initialize Azure OpenAI client using the OpenAI SDK with Azure configuration
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
  defaultQuery: { "api-version": "2024-12-01-preview" },
  defaultHeaders: { "api-key": apiKey }
});

/**
 * Cleans and parses a JSON string, handling common issues like comments
 * @param {string} jsonString - The JSON string to clean and parse
 * @returns {Object} - The parsed JSON object
 */
function cleanAndParseJSON(jsonString) {
  try {
    // First attempt: Try direct parsing
    return JSON.parse(jsonString);
  } catch (e) {
    // If direct parsing fails, try to clean the string
    
    // Remove single-line comments
    let cleaned = jsonString.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Handle trailing commas in arrays and objects
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    
    // Try parsing the cleaned string
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      // If still failing, use a more aggressive approach:
      // Try to extract just the JSON object part using regex
      const jsonPattern = /{[\s\S]*}/;
      const match = cleaned.match(jsonPattern);
      
      if (match && match[0]) {
        try {
          return JSON.parse(match[0]);
        } catch (e3) {
          throw new Error(`Failed to parse JSON after cleaning: ${e3.message}`);
        }
      } else {
        throw new Error(`Could not find valid JSON in the response: ${e2.message}`);
      }
    }
  }
}

/**
 * Analyze file contents and create a study plan
 * @param {Array} fileContents - Array of file content objects {name, content, type}
 * @param {Object} courseInfo - Course metadata (name, description, etc.)
 * @param {boolean} isSyllabus - Whether we're analyzing a syllabus specifically
 * @returns {Promise<Object>} - The generated study plan
 */
export async function analyzeContent(fileContents, courseInfo, isSyllabus = false) {
  try {
    // Combine all file contents into a single context
    const context = fileContents.map(file => 
      `File: ${file.name}\n${file.content.substring(0, 10000)}\n\n`
    ).join('');

    // Define the study plan schema structure for use in the instructions
    const studyPlanSchema = {
      "overview": "A paragraph summarizing the study plan",
      "topics": [
        { 
          "title": "Topic name", 
          "description": "Topic description", 
          "priority": "High/Medium/Low" 
        }
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
        { 
          "name": "Technique name", 
          "description": "Description of the technique" 
        }
      ],
      "resources": [
        { 
          "title": "Resource name", 
          "description": "Resource description", 
          "url": "URL if available" 
        }
      ]
    };
    
    // Create a function that tells the AI how to prepare a study plan
    // This leverages function calling capabilities while ensuring structured output
    const functions = [
      {
        "name": "create_study_plan",
        "description": "Create a comprehensive study plan based on course materials",
        "parameters": {
          "type": "object",
          "properties": {
            "overview": {
              "type": "string", 
              "description": "A paragraph summarizing the study plan"
            },
            "topics": {
              "type": "array",
              "description": "Key topics to study",
              "items": {
                "type": "object",
                "properties": {
                  "title": { 
                    "type": "string", 
                    "description": "Topic name" 
                  },
                  "description": { 
                    "type": "string", 
                    "description": "Topic description"
                  },
                  "priority": { 
                    "type": "string", 
                    "description": "Priority level (High, Medium, or Low)" 
                  }
                },
                "required": ["title", "description", "priority"]
              }
            },
            "schedule": {
              "type": "object",
              "description": "Weekly study schedule",
              "properties": {
                "weeks": {
                  "type": "array",
                  "description": "Array of study weeks",
                  "items": {
                    "type": "object",
                    "properties": {
                      "days": {
                        "type": "array",
                        "description": "Study activities for each day of the week",
                        "items": {
                          "type": "object",
                          "properties": {
                            "day": { 
                              "type": "string", 
                              "description": "Day of the week" 
                            },
                            "duration": { 
                              "type": "string", 
                              "description": "Study duration for this day" 
                            },
                            "activities": { 
                              "type": "array", 
                              "description": "List of study activities for this day",
                              "items": { "type": "string" }
                            }
                          },
                          "required": ["day", "duration", "activities"]
                        }
                      }
                    },
                    "required": ["days"]
                  }
                }
              },
              "required": ["weeks"]
            },
            "techniques": {
              "type": "array",
              "description": "Recommended study techniques",
              "items": {
                "type": "object",
                "properties": {
                  "name": { 
                    "type": "string", 
                    "description": "Name of the study technique" 
                  },
                  "description": { 
                    "type": "string", 
                    "description": "Description of how to apply the technique" 
                  }
                },
                "required": ["name", "description"]
              }
            },
            "resources": {
              "type": "array",
              "description": "Recommended study resources",
              "items": {
                "type": "object",
                "properties": {
                  "title": { 
                    "type": "string", 
                    "description": "Title of the resource" 
                  },
                  "description": { 
                    "type": "string", 
                    "description": "Description of the resource" 
                  },
                  "url": { 
                    "type": "string", 
                    "description": "URL of the resource if available, otherwise empty string" 
                  }
                },
                "required": ["title", "description"]
              }
            }
          },
          "required": ["overview", "topics", "schedule", "techniques", "resources"]
        }
      }
    ];

    // Create a system message that instructs the AI how to generate a study plan
    let systemMessage = `You are an expert educational planner and tutor specialized in creating optimized study plans.`;
    
    if (isSyllabus) {
      systemMessage += `
You're analyzing a course syllabus. Pay special attention to:
1. Course structure and timeline
2. Key topics and learning objectives
3. Required readings and assignments
4. Assessment methods and their weights
5. Important dates and deadlines

Extract as much actionable information as possible from the syllabus to create an effective study plan.`;
    }

    systemMessage += `
Your task is to analyze the provided course materials and create a comprehensive study plan.
The study plan should include:
1. A weekly schedule for studying the material that matches the course timeline
2. Key topics to focus on and their priority
3. Recommended study techniques for each topic
4. Practice exercises or questions
5. Milestones and learning goals
6. If the course start date and end date are provided, ensure the plan fits within this timeline.

Use the create_study_plan function to structure your response.`;

    // Create a user message with course details and content from files
    let userMessage = `I need a detailed study plan for my course "${courseInfo.name}". make sure to make the plan according to the course timeline and end date and start date.`;
    
    if (isSyllabus) {
      userMessage += ` I've uploaded my course syllabus, and I need you to analyze it and create a structured study plan.`;
    }
    
    userMessage += `
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

    // Generate the study plan using OpenAI - use function calling as a structured way to get output
    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      functions: functions,
      function_call: { name: "create_study_plan" }
    });

    // Extract the structured data from the function call arguments
    try {
      const functionCall = result.choices[0].message.function_call;
      
      if (functionCall && functionCall.name === "create_study_plan") {
        // Parse the JSON arguments returned from the function call
        const studyPlan = JSON.parse(functionCall.arguments);
        return studyPlan;
      } else {
        // Fallback to normal content parsing if function call isn't returned for some reason
        const studyPlanText = result.choices[0].message.content || "{}";
        
        try {
          return cleanAndParseJSON(studyPlanText);
        } catch (parseError) {
          console.error("Error parsing non-function study plan JSON:", parseError);
          
          return {
            overview: "We encountered an issue formatting your study plan. Here's the raw plan:",
            rawPlan: studyPlanText,
            topics: [],
            schedule: { weeks: [] },
            techniques: [],
            resources: []
          };
        }
      }
    } catch (error) {
      console.error("Error extracting function call results:", error);
      
      // If all parsing methods fail, return a structured object with the raw text
      return {
        overview: "We encountered an issue formatting your study plan.",
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
 * Detect if a file is a syllabus based on its name and content
 * @param {string} fileName - The name of the file
 * @param {string} content - The content of the file
 * @returns {boolean} - Whether the file is likely a syllabus
 */
function detectSyllabus(fileName, content) {
  const syllabusKeywords = [
    'syllabus', 'course outline', 'course schedule', 'class schedule', 
    'learning outcomes', 'course objectives', 'required readings',
    'grading policy', 'assessment criteria', 'office hours'
  ];
  
  // Check filename
  const fileNameLower = fileName.toLowerCase();
  if (fileNameLower.includes('syllabus') || fileNameLower.includes('outline')) {
    return true;
  }
  
  // Check content (using a scoring system)
  const contentLower = content.toLowerCase();
  let score = 0;
  syllabusKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      score += 1;
    }
  });
  
  // If we found at least 3 syllabus-related keywords, consider it a syllabus
  return score >= 3;
}

/**
 * Extract text content from a file
 * @param {string} fileUrl - URL of the file to extract text from (with SAS token)
 * @param {string} contentType - The content type of the file
 * @returns {Promise<string>} - The extracted text
 */
async function extractTextFromFile(fileUrl, contentType) {
  try {
    // Validate URL before attempting to fetch
    if (!fileUrl || fileUrl.includes('undefined.blob.core.windows.net') || fileUrl.includes('storage-account-not-configured')) {
      console.error('Invalid storage URL, configuration issue detected:', fileUrl?.substring(0, 50));
      return '[Error: Storage configuration is incomplete. Please check your Azure Storage settings in the environment variables.]';
    }

    // Add a timeout and credentials to fetch request
    const fetchOptions = {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-cache'
    };

    // Log a safe version of the URL (without SAS token)
    const logUrl = fileUrl.indexOf('?') > 0 
      ? fileUrl.substring(0, fileUrl.indexOf('?')) 
      : fileUrl;
    
    console.log(`Fetching file from URL: ${logUrl.substring(0, Math.min(50, logUrl.length))}...`);

    // Handle different file types accordingly
    if (contentType && contentType.includes('pdf')) {
      try {
        // For PDF files, we would typically use a PDF parsing library
        const response = await fetch(fileUrl, fetchOptions);
        
        if (!response.ok) {
          console.warn(`PDF fetch error ${response.status}: ${response.statusText}`);
          return `[Unable to extract PDF content (status: ${response.status}). The file may not be accessible with the current permissions.]`;
        }
        
        // In a production app, you would use a proper PDF parser
        const text = await response.text();
        console.log(`Successfully extracted ${text.length} characters from PDF`);
        return text;
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        return `[PDF content extraction failed: ${pdfError.message}. The file may require special processing.]`;
      }
    } else if (contentType && (contentType.includes('word') || contentType.includes('docx') || contentType.includes('doc'))) {
      try {
        // For Word documents (simplified)
        const response = await fetch(fileUrl, fetchOptions);
        
        if (!response.ok) {
          console.warn(`DOCX fetch error ${response.status}: ${response.statusText}`);
          return `[Unable to extract Word document content (status: ${response.status}). The document may not be accessible with the current permissions.]`;
        }
        
        // In production you would use a library for docx parsing
        const text = await response.text();
        console.log(`Successfully extracted ${text.length} characters from Word document`);
        return text;
      } catch (docxError) {
        console.error('Word document extraction error:', docxError);
        return `[Word document content extraction failed: ${docxError.message}. The file may require special processing.]`;
      }
    } else {
      // For text files or unknown types, try plain text
      try {
        const response = await fetch(fileUrl, fetchOptions);
        
        if (!response.ok) {
          console.warn(`Text fetch error ${response.status}: ${response.statusText}`);
          return `[Unable to extract file content (status: ${response.status}). The file may not be accessible with the current permissions.]`;
        }
        
        const text = await response.text();
        console.log(`Successfully extracted ${text.length} characters from text file`);
        return text;
      } catch (textError) {
        console.error('Text extraction error:', textError);
        return `[File content extraction failed: ${textError.message}. The file may be inaccessible or in an unsupported format.]`;
      }
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `[Error extracting file content: ${error.message}. Please ensure the file is accessible and in a supported format.]`;
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
        const text = await extractTextFromFile(file.url, file.contentType);
        return {
          name: file.name,
          content: text.substring(0, 10000), // Limit text size to avoid token limits
          contentType: file.contentType
        };
      })
    );

    // Check if any of the files is a syllabus
    let hasSyllabus = false;
    const syllabusFiles = fileContents.filter(file => {
      const isSyllabus = detectSyllabus(file.name, file.content);
      if (isSyllabus) hasSyllabus = true;
      return isSyllabus;
    });

    // If we have a syllabus, use it as the primary source of information
    // Otherwise, use all files
    const filesToAnalyze = hasSyllabus ? syllabusFiles : fileContents;
    
    // Analyze content and generate study plan
    const analysisResult = await analyzeContent(filesToAnalyze, course, hasSyllabus);
    
    // Return the generated study plan
    return {
      text: JSON.stringify(analysisResult),
      plan: analysisResult,
      generated: new Date().toISOString(),
      courseId: course.id || course.$id,
      fromSyllabus: hasSyllabus
    };
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
}

/**
 * Generate a quick study plan from a syllabus
 * This is a specialized version that only needs one file (the syllabus)
 * @param {Object} course - The course object
 * @param {Object} file - The syllabus file
 * @returns {Promise<Object>} - The generated study plan
 */
export async function generatePlanFromSyllabus(course, file) {
  try {
    // Extract text from the syllabus
    const text = await extractTextFromFile(file.url, file.contentType);
    
    const fileContent = {
      name: file.name,
      content: text.substring(0, 10000),
      contentType: file.contentType
    };
    
    // Analyze the syllabus specifically
    const analysisResult = await analyzeContent([fileContent], course, true);
    
    // Return the generated study plan
    return {
      text: JSON.stringify(analysisResult),
      plan: analysisResult,
      generated: new Date().toISOString(),
      courseId: course.id || course.$id,
      fromSyllabus: true
    };
  } catch (error) {
    console.error("Error generating study plan from syllabus:", error);
    throw error;
  }
}

/**
 * Generate a learning roadmap for a specific topic
 * @param {string} topic - The topic to create a roadmap for
 * @param {number} duration - The duration in weeks for the roadmap
 * @returns {Promise<Object>} - The generated learning roadmap
 */
export async function generateLearningRoadmap(topic, duration) {
  try {
    // Create a function that tells the AI how to prepare a learning roadmap
    // This leverages function calling capabilities while ensuring structured output
    const functions = [
      {
        "name": "create_learning_roadmap",
        "description": "Create a comprehensive learning roadmap for a specific topic",
        "parameters": {
          "type": "object",
          "properties": {
            "overview": {
              "type": "string", 
              "description": "A paragraph summarizing the learning roadmap and the topic"
            },
            "topics": {
              "type": "array",
              "description": "Key topics to learn in this subject",
              "items": {
                "type": "object",
                "properties": {
                  "title": { 
                    "type": "string", 
                    "description": "Topic name" 
                  },
                  "description": { 
                    "type": "string", 
                    "description": "Topic description"
                  },
                  "priority": { 
                    "type": "string", 
                    "description": "Priority level (High, Medium, or Low)" 
                  }
                },
                "required": ["title", "description", "priority"]
              }
            },
            "schedule": {
              "type": "object",
              "description": "Weekly learning schedule",
              "properties": {
                "weeks": {
                  "type": "array",
                  "description": "Array of learning weeks",
                  "items": {
                    "type": "object",
                    "properties": {
                      "days": {
                        "type": "array",
                        "description": "Learning activities for each day of the week",
                        "items": {
                          "type": "object",
                          "properties": {
                            "day": { 
                              "type": "string", 
                              "description": "Day of the week" 
                            },
                            "duration": { 
                              "type": "string", 
                              "description": "Learning duration for this day" 
                            },
                            "activities": { 
                              "type": "array", 
                              "description": "List of learning activities for this day",
                              "items": { "type": "string" }
                            }
                          },
                          "required": ["day", "duration", "activities"]
                        }
                      }
                    },
                    "required": ["days"]
                  }
                }
              },
              "required": ["weeks"]
            },
            "techniques": {
              "type": "array",
              "description": "Recommended learning techniques",
              "items": {
                "type": "object",
                "properties": {
                  "name": { 
                    "type": "string", 
                    "description": "Name of the learning technique" 
                  },
                  "description": { 
                    "type": "string", 
                    "description": "Description of how to apply the technique" 
                  }
                },
                "required": ["name", "description"]
              }
            },
            "mainTopics": {
              "type": "array",
              "description": "Main subtopics of this topic to use for resource search",
              "items": { "type": "string" }
            }
          },
          "required": ["overview", "topics", "schedule", "techniques", "mainTopics"]
        }
      }
    ];

    // Create a system message that instructs the AI how to generate a learning roadmap
    const systemMessage = `You are an expert educational consultant specialized in creating personalized learning roadmaps.
    
Your task is to create a comprehensive learning roadmap for the specified topic, with a schedule spanning the exact number of weeks provided.

The learning roadmap should include:
1. An overview of the learning journey for this topic
2. Key subtopics to focus on, with clear priority levels (High, Medium, Low)
3. A detailed weekly schedule with specific daily activities
4. Recommended learning techniques specific to this subject
5. In the mainTopics field, include 3-5 main subtopics that would be useful for searching for learning resources

Use the create_learning_roadmap function to provide a structured response.`;

    // Create a user message with roadmap request details
    const userMessage = `I need a detailed learning roadmap for "${topic}". 
The roadmap should cover exactly ${duration} week${duration > 1 ? 's' : ''}.
Please create a comprehensive plan that would help someone go from beginner to proficient in this topic within the given timeframe.
Include a list of the main subtopics to learn about. These will be used to find relevant resources.`;

    // Generate the learning roadmap using OpenAI 
    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      functions: functions,
      function_call: { name: "create_learning_roadmap" }
    });

    // Extract the structured data from the function call arguments
    let roadmap;
    try {
      const functionCall = result.choices[0].message.function_call;
      
      if (functionCall && functionCall.name === "create_learning_roadmap") {
        // Parse the JSON arguments returned from the function call
        roadmap = JSON.parse(functionCall.arguments);
      } else {
        // Fallback to normal content parsing if function call isn't returned
        const roadmapText = result.choices[0].message.content || "{}";
        
        try {
          roadmap = cleanAndParseJSON(roadmapText);
        } catch (parseError) {
          console.error("Error parsing non-function roadmap JSON:", parseError);
          
          roadmap = {
            overview: "We encountered an issue formatting your learning roadmap. Here's the raw plan:",
            rawPlan: roadmapText,
            topics: [],
            schedule: { weeks: [] },
            techniques: [],
            mainTopics: []
          };
        }
      }
    } catch (error) {
      console.error("Error extracting function call results for roadmap:", error);
      
      // If all parsing methods fail, return a structured object with an error message
      roadmap = {
        overview: "We encountered an issue formatting your learning roadmap.",
        topics: [],
        schedule: { weeks: [] },
        techniques: [],
        mainTopics: []
      };
    }

    // Search for resources based on the topic and main subtopics
    console.log(`Searching for resources for topic: ${topic} and subtopics:`, roadmap.mainTopics || []);
    const resources = await searchInternetForResources(topic, roadmap.mainTopics || []);
    
    // Add resources to the roadmap
    roadmap.resources = resources;
    
    return roadmap;
  } catch (error) {
    console.error("Error generating learning roadmap with Azure OpenAI:", error);
    throw error;
  }
}

/**
 * Search the internet for learning resources related to a specific topic
 * @param {string} topic - The topic to search resources for
 * @param {Array<string>} subtopics - Optional subtopics to refine the search
 * @returns {Promise<Array>} - Array of resources with title, description, and URL
 */
export async function searchInternetForResources(topic, subtopics = []) {
  try {
    // Using SERP API instead of Bing Search API
    const serpApiEndpoint = process.env.SERP_API_ENDPOINT || 'https://serpapi.com/search';
    const serpApiKey = process.env.SERP_API_KEY;
    
    // Create search queries for the main topic and subtopics
    const queries = [
      `learn ${topic} tutorial course`,
      `best resources to learn ${topic}`,
      `${topic} documentation guide`,
      `${topic} beginner to advanced`,
    ];
    
    // Add subtopic queries if provided
    if (subtopics && subtopics.length > 0) {
      subtopics.slice(0, 3).forEach(subtopic => {
        queries.push(`learn ${subtopic} ${topic} tutorial`);
      });
    }
    
    // If SERP API key is available, use it for actual web search
    if (serpApiKey) {
      console.log("Using SERP API to find resources");
      
      // Perform searches
      const searchResults = await Promise.all(
        queries.map(async (query) => {
          try {
            const response = await fetch(`${serpApiEndpoint}?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&engine=google&num=5`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              console.warn(`Search failed with status ${response.status}: ${response.statusText}`);
              return [];
            }
            
            const data = await response.json();
            // SERP API returns organic results in a different format than Bing
            return data.organic_results || [];
          } catch (err) {
            console.error(`Error searching for '${query}':`, err);
            return [];
          }
        })
      );
      
      // Flatten and deduplicate results
      const allResults = searchResults.flat();
      const uniqueUrls = new Set();
      const uniqueResults = [];
      
      allResults.forEach(result => {
        if (!uniqueUrls.has(result.link)) {
          uniqueUrls.add(result.link);
          uniqueResults.push({
            title: result.title,
            description: result.snippet,
            url: result.link,
            type: "website",
            subtopic: result.subtopic || "General"
          });
        }
      });
      
      if (uniqueResults.length >= 5) {
        return uniqueResults.slice(0, 10); // Limit to 10 resources
      }
      
      // If we didn't get enough results from SERP API, supplement with web search using GPT-4
      console.log("Not enough results from SERP API, supplementing with web search via GPT-4");
    }
    
    // The rest of the function remains the same - using Azure OpenAI to generate resources when web search isn't sufficient
    // Use Azure OpenAI to search the web using generated URLs
    const { client, deploymentName } = await getOpenAIClient();
    
    if (!client) {
      console.error("Failed to initialize Azure OpenAI client for web search");
      return [];
    }
    
    // Create queries combining the main topic and subtopics
    const resources = [];
    
    for (const query of queries.slice(0, 3)) { // Limit to 3 queries to save on API calls
      try {
        console.log(`Searching for resources with query: ${query}`);
        
        // Create a system message for searching web resources
        const systemMessage = `You are a helpful AI assistant that can find high-quality learning resources from across the web.
        For the given query about ${topic}, provide a list of 3-5 relevant, high-quality learning resources.
        These should include a mix of:
        - Official documentation or guides
        - High-quality tutorials from trusted websites
        - Free online courses or educational content
        - GitHub repositories with educational content
        - Video tutorials from platforms like YouTube
        
        For each resource, provide:
        1. An accurate title
        2. A brief but informative description
        3. A plausible and correctly formatted URL
        4. The type of resource (website, video, course, github, etc.)
        5. The subtopic it covers (if applicable)`;
        
        const userMessage = `Find the best learning resources for: ${query}`;
        
        // Define function for structured response
        const functions = [
          {
            "name": "return_web_resources",
            "description": "Return structured information about web resources found for the learning topic",
            "parameters": {
              "type": "object",
              "properties": {
                "resources": {
                  "type": "array",
                  "description": "List of resources found on the web",
                  "items": {
                    "type": "object",
                    "properties": {
                      "title": { 
                        "type": "string", 
                        "description": "Title of the resource" 
                      },
                      "url": { 
                        "type": "string", 
                        "description": "URL of the resource" 
                      },
                      "description": { 
                        "type": "string", 
                        "description": "Brief description of the resource" 
                      },
                      "type": { 
                        "type": "string", 
                        "description": "Type of resource (website, video, course, github, etc.)" 
                      },
                      "subtopic": { 
                        "type": "string", 
                        "description": "The specific subtopic this resource covers (if applicable)" 
                      }
                    },
                    "required": ["title", "url", "description", "type"]
                  }
                }
              },
              "required": ["resources"]
            }
          }
        ];

        // Make a call to Azure OpenAI to generate realistic web search results
        const result = await client.chat.completions.create({
          model: deploymentName,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage }
          ],
          functions: functions,
          function_call: { name: "return_web_resources" },
          temperature: 0.7
        });
        
        // Extract the structured data from the function call arguments
        let queryResources = [];
        try {
          const functionCall = result.choices[0].message.function_call;
          
          if (functionCall && functionCall.name === "return_web_resources") {
            // Parse the JSON arguments returned from the function call
            const parsedResult = JSON.parse(functionCall.arguments);
            queryResources = parsedResult.resources || [];
            
            // Add source information to help users understand these are AI-found resources
            queryResources.forEach(resource => {
              resource.foundVia = "AI web search";
            });
          }
        } catch (error) {
          console.error(`Error extracting resources for query "${query}":`, error);
          queryResources = [];
        }
        
        // Add current subtopic to the resources
        const currentSubtopic = query.includes(topic) && query !== topic ? 
          query.replace(`learn ${topic}`, "").replace(topic, "").replace("tutorial", "").trim() : 
          "General";
        
        queryResources.forEach(resource => {
          resource.subtopic = resource.subtopic || currentSubtopic;
        });
        
        // Add resources to the main array, avoiding duplicates by URL
        queryResources.forEach(newResource => {
          if (!resources.some(existingResource => existingResource.url === newResource.url)) {
            resources.push(newResource);
          }
        });
        
      } catch (searchError) {
        console.error(`Error searching for resources with query "${query}":`, searchError);
      }
    }
    
    // Filter and limit resources to avoid overwhelming the user
    return resources
      .sort((a, b) => {
        // Prioritize official documentation and courses
        if (a.type === "documentation" && b.type !== "documentation") return -1;
        if (b.type === "documentation" && a.type !== "documentation") return 1;
        if (a.type === "course" && b.type !== "course") return -1;
        if (b.type === "course" && a.type !== "course") return 1;
        return 0;
      })
      .slice(0, 10); // Limit to 10 resources
      
  } catch (error) {
    console.error("Error searching internet for resources:", error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Generate AI-based resource suggestions when internet search is not available
 * @param {string} topic - The topic to generate resource suggestions for
 * @param {Array<string>} subtopics - Optional subtopics to refine suggestions
 * @returns {Promise<Array>} - Array of AI-suggested resources
 */
export async function generateResourceSuggestions(topic, subtopics = []) {
  try {
    // Create a function for generating resource suggestions
    const functions = [{
      "name": "suggest_learning_resources",
      "description": "Suggest learning resources for a specific topic",
      "parameters": {
        "type": "object",
        "properties": {
          "resources": {
            "type": "array",
            "description": "Array of suggested learning resources",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the resource"
                },
                "description": {
                  "type": "string",
                  "description": "Brief description of what this resource offers"
                },
                "url": {
                  "type": "string",
                  "description": "URL of the resource, use most common/official URL if known"
                }
              },
              "required": ["title", "description", "url"]
            }
          }
        },
        "required": ["resources"]
      }
    }];

    // System message to guide the AI
    const systemMessage = `You are an expert educational consultant with extensive knowledge of learning resources.
    
Your task is to suggest specific, high-quality learning resources for the given topic.
Include a diverse mix of:
1. Official documentation and guides
2. Popular online courses (free and paid)
3. Books (with authors)
4. Interactive tutorials and platforms
5. YouTube channels or specific videos
6. Practice projects or exercises
7. Communities for learning support

For each resource, provide a specific URL (the main site or a direct link to the specific resource).
Do not make up fictional resources. Use only resources that you're confident actually exist.`;

    // User message with the topic
    let userMessage = `Please suggest high-quality learning resources for the topic "${topic}".`;
    
    if (subtopics && subtopics.length > 0) {
      userMessage += ` I'm particularly interested in these specific aspects: ${subtopics.join(', ')}.`;
    }
    
    userMessage += ` For each resource, include a title, brief description of what it offers, and a URL.`;

    // Generate resource suggestions
    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      functions: functions,
      function_call: { name: "suggest_learning_resources" }
    });

    try {
      const functionCall = result.choices[0].message.function_call;
      
      if (functionCall && functionCall.name === "suggest_learning_resources") {
        const suggestions = JSON.parse(functionCall.arguments);
        return suggestions.resources;
      } else {
        // Fallback to parsing from content
        return [{
          title: "Official Documentation",
          description: `The official documentation for ${topic}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(`${topic} official documentation`)}`
        }];
      }
    } catch (error) {
      console.error("Error extracting resource suggestions:", error);
      return [];
    }
  } catch (error) {
    console.error("Error generating resource suggestions:", error);
    return [];
  }
}