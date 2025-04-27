import CommunityDetailClient from '@/components/dashboard/CommunityDetailClient';
import { getStudyGroupsFromDb } from '@/lib/azure-cosmos';

export default async function CommunityPage({ params }) {
  // Destructure communityId from params to ensure it's available
  const { communityId } = params;
  const all = await getStudyGroupsFromDb();
  const community = all.find(c => c.id === communityId);
  if (!community) return <div>Community not found.</div>;
  return <CommunityDetailClient community={community} />;
}