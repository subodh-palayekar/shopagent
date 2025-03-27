import AppSidebar from '@/components/AppSidebar';
import DashboardNavBar from '@/components/DashboardNavBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import RecoilContextProvider from '@/lib/RecoilContextProvider';
import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <RecoilContextProvider>
        <AppSidebar />
        <main className="w-full min-h-full">{children}</main>
      </RecoilContextProvider>
    </SidebarProvider>
  );
}
