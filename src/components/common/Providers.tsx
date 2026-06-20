'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

const defaultColors = {
  '--color-primary': '#0F1DDB',
  '--color-primary-dark': '#0B1488',
  '--color-primary-light': '#2A3AE8',
  '--color-accent': '#C9A227',
  '--color-accent-light': '#D4AF37',
  '--color-text-muted': '#6B7280',
  '--color-border': '#E5E7EB',
  '--color-bg-cream': '#F5F7FC',
  '--color-bg-section': '#F9FAFB',
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  }));

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', data.primaryColor || defaultColors['--color-primary']);
        root.style.setProperty('--color-primary-dark', data.primaryDark || defaultColors['--color-primary-dark']);
        root.style.setProperty('--color-primary-light', data.primaryLight || defaultColors['--color-primary-light']);
        root.style.setProperty('--color-accent', data.accentColor || defaultColors['--color-accent']);
        root.style.setProperty('--color-accent-light', data.accentColor ? data.accentColor : defaultColors['--color-accent-light']);
        root.style.setProperty('--color-text-muted', '#6B7280');
        root.style.setProperty('--color-border', '#E5E7EB');
        root.style.setProperty('--color-bg-cream', '#F5F7FC');
        root.style.setProperty('--color-bg-section', '#F9FAFB');
      })
      .catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
