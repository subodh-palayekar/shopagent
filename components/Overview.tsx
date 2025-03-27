import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';
import {
  PackageSearch,
  User,
  Scale,
  Tag,
  Clock,
  Headphones,
  Gift,
  Box,
  Info,
  ShoppingCart,
} from 'lucide-react';
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
    {
      title: 'I want to buy',
      description: 'best selling product from shop',
      prompt: 'I want to buy best selling product from shop',
      icon: <PackageSearch size={24} />,
    },
    {
      title: 'Product Recommendations',
      description: 'based on my preferences',
      prompt: 'Can you recommend products based on my interests?',
      icon: <User size={24} />,
    },

    // {
    //   title: 'Current Deals',
    //   description: 'show ongoing discounts and offers',
    //   prompt: 'What are the current deals available?',
    //   icon: <Tag size={24} />,
    // },
    {
      title: 'Business Information',
      description: 'Get to know about our business',
      prompt: 'Tell me more about your business',
      icon: <Info size={24} />,
    },
    // {
    //   title: 'New Arrivals',
    //   description: 'show latest products',
    //   prompt: 'What new products have arrived recently?',
    //   icon: <Box size={24} />,
    // },
    {
      title: 'Gift Ideas',
      description: 'suggest perfect gifts',
      prompt: 'Can you suggest gift ideas under $100?',
      icon: <Gift size={24} />,
    },
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
            className="w-[100px] sm:w-[120px]  lg:w-[150px]"
          />
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-semibold max-w-7xl mx-auto text-center  relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Orbit
            <br />
            Simplifying your shopping journey
          </h2>
        </div>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2  gap-2 p-4">
        {overviewItems?.map((item, index) => (
          <div
            key={index}
            onClick={async () => {
              append({
                role: 'user',
                content: item.prompt,
              });
            }}
            className=" bg-muted/50 text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 h- text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors justify-center flex flex-col gap-2"
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
