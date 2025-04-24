import { NextResponse } from 'next/server';
import { generateStudyPlan } from '@/lib/azure-openai';
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
    const { course, files } = body;

    // Validate request parameters
    if (!course) {
      return NextResponse.json({ error: 'Course information is required' }, { status: 400 });
    }
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'At least one file is required' }, { status: 400 });
    }

    // Generate the study plan
    const studyPlan = await generateStudyPlan(course, files);

    // Return the study plan
    return NextResponse.json({ 
      success: true, 
      studyPlan 
    });
  } catch (error) {
    console.error('Error generating study plan:', error);
    return NextResponse.json({ 
      error: 'Failed to generate study plan',
      details: error.message
    }, { status: 500 });
  }
}