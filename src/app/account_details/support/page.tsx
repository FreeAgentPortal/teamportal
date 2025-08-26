import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Support from '@/views/support/Support.view';
import { Suspense } from 'react';

export default function Component() {
  return (
    <PageLayout pages={[navigation().account_details.links.support]} largeSideBar>
      <Suspense fallback={<div>Loading support...</div>}>
        <Support />
      </Suspense>
    </PageLayout>
  );
}
