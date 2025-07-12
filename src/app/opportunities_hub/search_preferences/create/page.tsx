import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import Details from '@/views/opportunity_hub/search/details/Details.view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `FAP | Create Preference`,
  description: 'Create a new search preference in the FAP system',
  keywords: ['search preference', 'create search', 'opportunities hub'],
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.search_preferences]} largeSideBar>
      <Details />
    </PageLayout>
  );
}
