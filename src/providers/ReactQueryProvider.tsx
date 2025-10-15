'use client';
import React, { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useInterfaceStore } from '@/state/interface';
import { default as themeOverride } from '@/styles/theme.json';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import fontColorContrast from 'font-color-contrast';

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const { addAlert } = useInterfaceStore.getState();
  const [theme, setTheme] = useState({ ...themeOverride });
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
          documentRoot.style.setProperty('--accent', alternateColor);
          documentRoot.style.setProperty('--font-primary', fontColorContrast(color));
          documentRoot.style.setProperty('--font-secondary', fontColorContrast(alternateColor));
          documentRoot.style.setProperty('--link', alternateColor);

          setTheme({
            ...themeOverride,
            token: {
              ...themeOverride.token,
              colorPrimary: color,
              colorLink: alternateColor,
              colorBorder: alternateColor,
              colorPrimaryActive: alternateColor,
              colorPrimaryHover: alternateColor,
              colorTextSecondary: alternateColor,
            },
          });
        } else {
          // Reset to default colors if no team colors are available
          documentRoot.style.removeProperty('--primary');
          documentRoot.style.removeProperty('--secondary');
          documentRoot.style.removeProperty('--accent');
          documentRoot.style.removeProperty('--text-primary');
          documentRoot.style.removeProperty('--text-secondary');
          documentRoot.style.removeProperty('--link');
        }
      }
    });

    // Set initial colors if profile data is already available

    const currentProfile = client.getQueryData(['profile', 'team']) as any;

    console.log('Current profile data:', currentProfile);

    if (currentProfile?.payload?.color && currentProfile?.payload?.alternateColor) {
      const { color, alternateColor } = currentProfile.payload;
      documentRoot.style.setProperty('--primary', color);
      documentRoot.style.setProperty('--secondary', alternateColor);
      documentRoot.style.setProperty('--accent', alternateColor);
      documentRoot.style.setProperty('--text-primary', fontColorContrast(color));
      documentRoot.style.setProperty('--text-secondary', fontColorContrast(alternateColor));

      console.log('Setting theme colors:', { color, alternateColor, fontColor: fontColorContrast(color) });
    }

    return () => {
      unsubscribe();
    };
  }, [client]);

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider
        theme={{
          ...theme,
          token: {
            ...theme.token,
            fontFamily: 'var(--font-roboto)',
          },
        }}
        locale={enUS}
      >
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
