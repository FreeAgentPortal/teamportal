import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import EventDashboard from '@/views/opportunity_hub/event_dashboard/EventDashboard.view';

export const metadata: Metadata = {
  title: 'FAP | Event Dashboard',
  description: 'Manage and view events in the FAP system',
};

export default function Home() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.event_dashboard]} largeSideBar>
      <EventDashboard />
    </PageLayout>
  );
}
