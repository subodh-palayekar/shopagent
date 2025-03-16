'use client';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Home,
  Package,
  MessageSquare,
  Plug,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Store,
  MessageCircleHeart,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
// import {
//   Clover,
//   MessageCircle,
//   Home,
//   PackageSearch,
//   MessageCircleHeart,
//   Building2,
//   GitPullRequestCreate,
// } from 'lucide-react';

const AppSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  console.log(pathName);

  // Function to handle the click event
  const handleMenuItemClick = (url: string) => {
    router.push(url);
  };

  const items = [
    { title: 'Home', icon: <Home size={20} />, url: '/home' },
    { title: 'Products', icon: <Package size={20} />, url: '/product' },
    { title: 'Chat', icon: <MessageSquare size={20} />, url: '/chat' },
    { title: 'Integration', icon: <Plug size={20} />, url: '/integration' },
    { title: 'Business', icon: <Briefcase size={20} />, url: '/business' },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* Enhanced Sidebar Header */}
      <SidebarHeader className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex size-6 items-center justify-center m-1">
          <MessageCircleHeart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem className="px-2 py-1" key={item.title}>
              <SidebarMenuButton
                size={'default'}
                tooltip={item.title}
                isActive={pathName === item.url}
                asChild
              >
                <div
                  onClick={() => handleMenuItemClick(item.url)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {/* <item.icon className="w-5 h-5  text-blue-600 dark:text-gray-300" /> */}
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.title}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
