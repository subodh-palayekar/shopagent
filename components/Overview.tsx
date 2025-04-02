import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';
import { Info, User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Overview = ({
  id,
  business_id,
  initialMessages,
}: {
  id: string;
  business_id: string;
  initialMessages: Message[];
}) => {
  const { append } = useChat({
    id,
    body: { id, business_id },
    initialMessages,
    maxSteps: 10,
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${business_id}/${id}`);
    },
  });

  const overviewItems = [
    // {
    //   title: 'I want to buy',
    //   description: 'product under 300$',
    //   prompt: 'I want to buy product under 300$',
    //   icon: <PackageSearch size={24} />,
    // },
    {
      title: 'Show Addresses',
      description: 'View all saved addresses',
      prompt: 'Can you show me all my addresses',
      icon: <User size={24} />,
    },
    // {
    //   title: 'Current Deals',
    //   description: 'show ongoing discounts and offers',
    //   prompt: 'What are the current deals available?',
    //   icon: <Tag size={24} />,
    // },
    {
      title: 'Business Help',
      description: 'How you can help me with my shopping needs',
      prompt: 'How you can help me with my shopping needs',
      icon: <Info size={24} />,
    },
    // {
    //   title: 'Gift Ideas',
    //   description: 'suggest perfect gifts',
    //   prompt: 'Can you suggest gift ideas under $100?',
    //   icon: <Gift size={24} />,
    // },
  ];

  return (
    <div className="flex h-svh justify-between flex-col">
      <div>
        <div className="flex justify-center items-center flex-col">
          <Image
            src={'/logo.png'}
            alt="logo"
            width={100}
            height={100}
            className="w-[80px] sm:w-[100px]  lg:w-[120px]"
          />
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-semibold max-w-7xl mx-auto text-center  relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Shop Agent
            <br />
            Simplifying your shopping journey
          </h2>
        </div>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2  gap-2 p-4">
        {overviewItems?.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              append({
                role: 'user',
                content: item.prompt,
              });
            }}
            className=" bg-muted/50 cursor-pointer text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 h- text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors justify-center flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{item.title}</span>
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
