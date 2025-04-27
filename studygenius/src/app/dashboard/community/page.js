import CommunityList from '@/components/dashboard/CommunityList';
import { getStudyGroupsFromDb } from '@/lib/azure-cosmos';

export const metadata = {
  title: 'Communities - StudyGenius',
  description: 'Join or create learning communities',
};

export default async function CommunitiesPage() {
  const initialCommunities = await getStudyGroupsFromDb();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <CommunityList initialCommunities={initialCommunities} />
    </div>
  );
}