import Loader from '@/components/loader/Loader.component';
import { navigation } from '@/data/navigation';
import PageLayout from '@/layout/page/Page.layout';
import ReportDetails from '@/views/opportunity_hub/report/ReportDetails/ReportDetails.view';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dynamic Report Details | Opportunities Hub',
  description: 'This page will allow users to view detailed reports dynamically.',
  keywords: ['report details', 'dynamic report', 'opportunities hub'],
};

export default function Page() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.reports]} largeSideBar>
      <Suspense fallback={<Loader />}>
        <ReportDetails />
      </Suspense>
    </PageLayout>
  );
}
