import NotificationsView from '@/views/notifications/NotificationsView.view';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'FAP | Notifications',
  description: 'Notifications for FAP',
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading notifications...</div>}>
      <PageLayout pages={[navigation().home.links.notifications]}>
        <NotificationsView />
      </PageLayout>
    </Suspense>
  );
}
