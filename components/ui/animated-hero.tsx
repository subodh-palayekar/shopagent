'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MoveRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      'Intelligent',
      'Personalized',
      'Effortless',
      'Seamless',
      'Revolutionary',
    ],

    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className=" mx-auto">
        <div className="flex gap-8 py-20 items-center justify-center flex-col">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-4 p-3 rounded-xl"
            >
              ✨ AI-Powered Shopping Assistant
            </Button>
            {/* <StarBorder speed="2" className="p-2">
              ✨ AI-Powered Shopping Assistant
            </StarBorder> */}
          </div>
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">
                Your Next Business Breakthrough is
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-2">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-regular"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-sm md:text-lg tracking-tight  text-muted-foreground max-w-xl text-center">
              While customers enjoy frictionless chat-to-checkout journeys,
              businesses gain real-time analytics, reduced overhead, and a
              system that learns to sell better every day.
            </p>
          </div>

          <div className="flex flex-row gap-3">
            <Button asChild size="lg" className="gap-4" variant="outline">
              <Link
                href="https://in.linkedin.com/in/subodhpalayekar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jump on a call <PhoneCall className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" className="gap-4">
              <Link href={'/sign-up'}>
                Create Account <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
