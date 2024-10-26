'use client';

import HeaderManual from '@/app/components/header-logged';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const isLoginExtension = searchParams.get('loginExtensions');
  const { data: session } = useSession();

  useEffect(() => {
    const storageLoginExtensions = localStorage.getItem('isLoginExtension');

    const accessToken = session?.user.accessToken;
    if ((isLoginExtension || storageLoginExtensions) && accessToken) {
      const message = { type: 'send-token', token: accessToken };
      window.postMessage(message, '*');
      toast.success('login extension success');
      const urlWithoutParam = window.location.origin + window.location.pathname;
      replace(urlWithoutParam);
      localStorage.removeItem('isLoginExtension');
    }
  }, [isLoginExtension, replace, session?.user.accessToken]);
  return (
    <>
      <HeaderManual />
      <section className="min-h-tablet bg-[#F2F6FD]">{children}</section>
    </>
  );
}
