'use client';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { AuthProvider } from './components/providers/AuthProvider';
import Loading from './components/loading';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={'bg-[#F2F6FD] font-noto-san-jp text-primary'}
          suppressHydrationWarning={true}
        >
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<Loading />}>
                {children}
                <ToastContainer position="bottom-center" />
              </Suspense>
            </QueryClientProvider>
          </AuthProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
