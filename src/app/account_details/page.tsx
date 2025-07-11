import AccountDetails from '@/views/account_details/AccountDetails.screen';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Suspense } from 'react';

export default function Home() {
  return (
    <PageLayout pages={[navigation().account_details.links.account_details]}>
      <Suspense fallback={<div>Loading account details...</div>}>
        <AccountDetails />
      </Suspense>
    </PageLayout>
  );
}
