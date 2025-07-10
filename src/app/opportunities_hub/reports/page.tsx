import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import Report from '@/views/opportunity_hub/report/Report.view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dynamic Reports',
  description: 'This page will allow users to view and manage their reports dynamically.',
  keywords: ['reports', 'dynamic reports', 'opportunities hub'],
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.reports]} largeSideBar>
      <Report />
    </PageLayout>
  );
}
