import { Hero } from '@/components/ui/animated-hero';
import { Button } from '@/components/ui/button';
import { LinkPreview } from '@/components/ui/link-preview';
import { ModeToggle } from '@/components/ui/theme-toogle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className=" absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] ">
      <div className="max-w-7xl mx-auto">
        {/* navbar */}
        <aside className="w-full  mx-auto  mt-1 p-3 rounded-xl ">
          <nav className="flex justify-between items-center">
            <div className="ml-2 flex items-center gap-2  ">
              <Image
                src={'/logo.png'}
                className="rounded-full "
                alt="logo"
                width={33}
                height={33}
              />
              <span className="tracking-wide text-white font-bold">
                Shop Agent
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <SignedOut>
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-4 p-4 rounded-xl"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </nav>
        </aside>

        {/* hero section */}
        <section>
          <Hero />
        </section>
        {/* credits */}
        <section>
          <div className="flex justify-center flex-col  items-center">
            <span>Designed & Developed By</span>
            <LinkPreview
              height={70}
              width={70}
              url="https://in.linkedin.com/in/subodhpalayekar"
              imageSrc="/subodh.jpg"
              isStatic
              className="font-bold bg-clip-text text-transparent  bg-gradient-to-br from-purple-500 to-pink-500"
            >
              Subodh Palayekar ❤️
            </LinkPreview>{' '}
          </div>
        </section>
      </div>
    </main>
  );
}
