import { NextResponse } from 'next/server';
import { getRecommendedResources } from '@/lib/dashboard-service';
import { verifySession } from '@/lib/appwrite';

export async function GET(request) {
  try {
    // Verify authentication using Appwrite
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recommended resources for the user
    const resources = await getRecommendedResources(userId);

    // Return the resources
    return NextResponse.json({ 
      success: true, 
      resources 
    });
  } catch (error) {
    console.error('Error getting recommended resources:', error);
    return NextResponse.json({ 
      error: 'Failed to get recommended resources',
      details: error.message
    }, { status: 500 });
  }
}