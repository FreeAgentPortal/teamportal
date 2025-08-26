import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import Details from '@/views/opportunity_hub/search/details/Details.view';

export const metadata: Metadata = {
  title: 'FAP | Search Preference Details',
};

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.search_preferences]} largeSideBar>
      <Details />
    </PageLayout>
  );
}
