import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential } from '@azure/identity';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = '2025-01-01-preview';
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

const credential = new DefaultAzureCredential();
const client = new AzureOpenAI({ endpoint, credential, apiVersion, deployment });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an AI assistant for the AI Study Group.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseText = result.choices[0]?.message?.content || 'No response';
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}