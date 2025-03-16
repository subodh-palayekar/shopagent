import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { ModeToggle } from './ui/theme-toogle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const DashboardNavBar = () => {
  return (
    <div className="sticky top-0 z-50 bg-background">
      <div className="py-[8px] px-5 flex justify-between gap-6  border-b  items-center ">
        <SidebarTrigger size={'lg'} />
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
