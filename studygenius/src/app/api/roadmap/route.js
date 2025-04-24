import { NextResponse } from 'next/server';
import { generateLearningRoadmap } from '@/lib/azure-openai';
import { verifySession } from '@/lib/appwrite';

export async function POST(request) {
  try {
    // Verify authentication using Appwrite
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { topic, duration } = body;

    // Validate request parameters
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    
    const durationWeeks = duration || 4; // Default to 4 weeks if not specified

    // Generate the learning roadmap
    const roadmap = await generateLearningRoadmap(topic, durationWeeks);

    // Return the roadmap
    return NextResponse.json({ 
      success: true, 
      roadmap 
    });
  } catch (error) {
    console.error('Error generating learning roadmap:', error);
    return NextResponse.json({ 
      error: 'Failed to generate learning roadmap',
      details: error.message
    }, { status: 500 });
  }
}