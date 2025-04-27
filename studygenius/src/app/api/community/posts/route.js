import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/appwrite';
import { getCommunityPosts, createPost } from '@/lib/azure-cosmos';

export async function GET(req, { params }) {
  const posts = await getCommunityPosts(params.communityId);
  return NextResponse.json(posts);
}

export async function POST(req, { params }) {
  const userId = await verifySession(req);
  if (!userId) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { content, attachments } = await req.json();
  const post = await createPost(params.communityId, userId, content, attachments);
  return NextResponse.json(post);
}