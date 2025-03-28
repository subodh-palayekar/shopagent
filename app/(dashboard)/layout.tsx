import AppSidebar from '@/components/AppSidebar';
import DashboardNavBar from '@/components/DashboardNavBar';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <AppSidebar />
      <main className="w-full min-h-full">
        <DashboardNavBar />
        {children}
      </main>
    </SidebarProvider>
  );
}
