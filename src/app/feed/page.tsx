import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Feed from '@/views/feed/Feed.view';
import { Suspense } from 'react';

export default function Page() {
  return (
    <PageLayout pages={[navigation().home.links.feed]} largeSideBar>
      <Suspense fallback={<div>Loading feed...</div>}>
        <Feed />
      </Suspense>
    </PageLayout>
  );
}
