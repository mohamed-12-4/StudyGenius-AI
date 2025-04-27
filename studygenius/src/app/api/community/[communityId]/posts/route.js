import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/appwrite';
import { getCommunityPosts, createPost } from '@/lib/azure-cosmos';

export async function GET(req, { params }) {
  try {
    const { communityId } = params;
    // Optionally verify session, but don't require it for public community viewing
    await verifySession(req);
    const posts = await getCommunityPosts(communityId);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req, { params }) {

  const userId = await verifySession(req);
  const { communityId } = params;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { content, attachments } = await req.json();
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }
    
    const post = await createPost(communityId, userId, content, attachments || []);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}