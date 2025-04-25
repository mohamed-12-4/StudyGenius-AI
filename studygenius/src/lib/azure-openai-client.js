const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://studygenius-hackathon-ai-stg-01.openai.azure.com/";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
  const apiVersion = "2025-01-01-preview";
  const deployment = "studygenius-ai-study-group-chatbot"; // This must match your deployment name

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI assistant that helps people find information. The AI model will act as a chatbot for the AI Study Group, answering user questions and providing assistance on various topics. The app is an educational platform where students collaborate in study groups. The AI chatbot will assist users in the 'AI Study Group' by answering questions and providing resources. The AI model should act as a knowledgeable assistant, providing accurate and concise answers to user queries. It should also suggest resources and study techniques when appropriate. The AI should avoid providing medical, legal, or financial advice. It should also avoid generating harmful or inappropriate content. Prompt: \"What is machine learning?\" Response: \"Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\"\nPrompt: \"Can you suggest resources for learning Python?\" Response: \"Sure! Here are some resources: 1. Python.org (official documentation), 2. 'Automate the Boring Stuff with Python' (book), 3. Codecademy (online course).\"" }
    ],
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };