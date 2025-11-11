import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import EventDetail from '@/views/opportunity_hub/event_dashboard/event_detail/EventDetail.view';

export const metadata: Metadata = {
  title: 'FAP | Event Dashboard',
  description: 'Manage and view events in the FAP system',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.event_dashboard]} largeSideBar>
      <EventDetail id={id} />
    </PageLayout>
  );
}
