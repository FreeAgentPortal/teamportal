import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import SearchPreferences from '@/views/opportunity_hub/search/SearchPreferences.view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dynamic Search Preferences',
  description: 'This page will allow users to set their search preferences dynamically.',
  keywords: ['search preferences', 'dynamic search', 'opportunities hub'],
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.search_preferences]} largeSideBar>
      <SearchPreferences />
    </PageLayout>
  );
}
