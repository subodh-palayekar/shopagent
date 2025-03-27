'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MessageCircleHeart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getTitleFromChat } from '@/lib/utils';
import { Chat } from '@prisma/client';
const AppSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [chathistory, setChatHistory] = useState([]);

  // Function to handle the click event
  const handleMenuItemClick = (chat: Chat) => {
    router.push(`/chat/${chat.businessId}/${chat.id}`);
  };

  const getchatHistory = async () => {
    const result = await axios.get('/api/chat');
    setChatHistory(result.data);
  };

  useEffect(() => {
    getchatHistory();
  }, [pathName]);

  return (
    <Sidebar>
      {/* Enhanced Sidebar Header */}
      <SidebarHeader className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex size-6 items-center justify-center m-1">
          <MessageCircleHeart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {chathistory.map((item: Chat) => (
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
                  {/* <item.icon className="w-5 h-5  text-blue-600 dark:text-gray-300" /> */}
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
