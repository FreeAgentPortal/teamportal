'use client';

import { navigation } from '@/data/navigation';
import Error from '@/layout/ErrorLayout/Error.layout';
import PageLayout from '@/layout/page/Page.layout';
import { Suspense } from 'react';

export default function GlobalError({ error }: { error: Error }) {
  console.error(error);

  return (
    <PageLayout pages={[navigation().home.links.home]}>
      <Suspense fallback={<div>Loading error page...</div>}>
        <Error code={500} title="Internal Server Error" description="Oops! Something broke on our end. Please try again if the issue persists please reach out to support!" />;
      </Suspense>
    </PageLayout>
  );
}
