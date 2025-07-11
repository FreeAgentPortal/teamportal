import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Dashboard from '@/views/dashboard/Dashboard.view';
import { Suspense } from 'react';
import Loader from '@/components/loader/Loader.component';

export default function Home() {
  return (
    <PageLayout pages={[navigation().home.links.home]} largeSideBar>
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    </PageLayout>
  );
}
