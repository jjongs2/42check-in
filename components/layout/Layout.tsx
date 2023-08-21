import { cls } from '@/styles/cls';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): ReactElement {
  const { asPath } = useRouter();
  const hasSidebar = asPath !== '/';
  return (
    <>
      <Header />
      {hasSidebar && <Sidebar />}
      <div className={cls(hasSidebar ? 'ml-28' : '', 'pt-20')}>{children}</div>
    </>
  );
}
