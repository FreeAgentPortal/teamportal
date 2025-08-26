import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import ApiKeys from '@/views/apikeys/ApiKeys.view';
import { Suspense } from 'react';

export default function Component() {
  return (
    <Suspense fallback={<div>Loading API keys....</div>}>
      <PageLayout pages={[navigation().account_details.links.keys]} largeSideBar>
        <ApiKeys />
      </PageLayout>
    </Suspense>
  );
}
