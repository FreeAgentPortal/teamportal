'use client';
import React, { Suspense } from 'react';
import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import Error from '@/layout/ErrorLayout/Error.layout';

const NotFound: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading not found page...</div>}>
      <PageLayout pages={[navigation().home.links.home]}>
        <Error code={404} title="Page Not Found" description="The page you're looking for doesn't exist or may have been moved." />
      </PageLayout>
    </Suspense>
  );
};

export default NotFound;
