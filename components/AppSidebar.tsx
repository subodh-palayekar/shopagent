'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getTitleFromChat } from '@/lib/utils';
import { Chat } from '@prisma/client';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
const AppSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [chathistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toggleSidebar } = useSidebar();

  // Function to handle the click event
  const handleMenuItemClick = (chat: Chat) => {
    router.push(`/chat/${chat.businessId}/${chat.id}`);
    toggleSidebar();
  };

  const getchatHistory = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/api/chat');
      setChatHistory(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getchatHistory();
  }, [pathName]);

  return (
    <Sidebar className="">
      {/* Enhanced Sidebar Header */}
      <SidebarHeader className=" p-1 pt-[5px]">
        <Link href={'/'}>
          <div className="flex items-center justify-start gap-2 m-1">
            <Image
              src={'/logo.png'}
              className="rounded-full "
              alt="logo"
              width={35}
              height={35}
            />
            <span className="tracking-wide  font-bold">Shop Agent</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem className="px-2 py-1 mt-3">
            <SidebarMenuButton size={'default'} className="border-2" asChild>
              <div
                onClick={() => router.push('/chat')}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <PlusCircle width={26} />
                <span className="text-sm">New Chat</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {loading
            ? // Render three skeleton items while loading
              Array.from({ length: 3 }).map((_, index) => (
                <SidebarMenuItem
                  className="px-2 py-1"
                  key={`skeleton-${index}`}
                >
                  <Skeleton className="h-6 w-full" />
                </SidebarMenuItem>
              ))
            : chathistory.map((item: Chat) => (
                <SidebarMenuItem className="px-2 py-1" key={item.id}>
                  <SidebarMenuButton
                    size={'default'}
                    tooltip={item.title || 'title'}
                    isActive={pathName.includes(item.id)}
                    asChild
                  >
                    <div
                      onClick={() => handleMenuItemClick(item)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.title || getTitleFromChat(item)}
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
