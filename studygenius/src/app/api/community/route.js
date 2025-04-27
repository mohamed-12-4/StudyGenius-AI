import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/appwrite';
import { createCommunity, getStudyGroupsFromDb } from '@/lib/azure-cosmos';

export async function GET(req) {
  const userId = await verifySession(req);
  if (!userId) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const groups = await getStudyGroupsFromDb();
  return NextResponse.json(groups);
}

export async function POST(req) {
  const userId = await verifySession(req);
  if (!userId) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { name, description } = await req.json();
  const community = await createCommunity({ name, description }, userId);
  return NextResponse.json(community);
}