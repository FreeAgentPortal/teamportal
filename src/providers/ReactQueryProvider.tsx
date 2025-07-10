'use client';
import React, { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useInterfaceStore } from '@/state/interface';
import { default as themeOverride } from '@/styles/theme.json';
import { ConfigProvider } from 'antd';

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const { addAlert } = useInterfaceStore.getState();
  const [client] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          console.log(error);
          addAlert({
            type: 'info',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            duration: 5000,
          });
        },
      }),
    })
  );

  // Dynamic branding: Set CSS custom properties based on team colors
  React.useEffect(() => {
    const documentRoot = document.documentElement;

    // Subscribe to profile changes to update branding dynamically
    const unsubscribe = client.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === 'profile' && event.query.queryKey[1] === 'team') {
        const profileData = event.query.state.data as any;

        if (profileData?.payload?.color && profileData?.payload?.alternateColor) {
          const { color, alternateColor } = profileData.payload;
          documentRoot.style.setProperty('--primary', color);
          documentRoot.style.setProperty('--secondary', alternateColor);
        } else {
          // Reset to default colors if no team colors are available
          documentRoot.style.removeProperty('--primary');
          documentRoot.style.removeProperty('--secondary');
        }
      }
    });

    // Set initial colors if profile data is already available
    const currentProfile = client.getQueryData(['profile', 'team']) as any;
    if (currentProfile?.payload?.color && currentProfile?.payload?.alternateColor) {
      const { color, alternateColor } = currentProfile.payload;
      documentRoot.style.setProperty('--primary', color);
      documentRoot.style.setProperty('--secondary', alternateColor);
    }

    return () => {
      unsubscribe();
    };
  }, [client]);

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider theme={{ ...themeOverride }}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
