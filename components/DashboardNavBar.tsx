'use client';
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { ModeToggle } from './ui/theme-toogle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardNavBar = () => {
  const pathName = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-transparent">
      <div className="py-[8px] px-5 flex justify-between gap-6    items-center ">
        <div className="flex justify-center items-center">
          <SidebarTrigger size={'lg'} className="mr-1" />
          {pathName !== '/chat' && (
            <Link className="flex gap-3 items-center" href={'/chat'}>
              <div className="text-gray-500">{'|'}</div>
              <div className="hover:underline underline-offset-4  text-sm">
                {'Business'}{' '}
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavBar;
