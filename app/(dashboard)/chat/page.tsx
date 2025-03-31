'use client';
import { Button } from '@/components/ui/button';
import { Laptop, Shirt, Smartphone, Home, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Business {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  business_id: string;
  image: string;
}

const businesses: Business[] = [
  {
    id: 'laptops',
    name: 'Tech Hub Laptops',
    description: 'Find the perfect laptop for work, gaming, or everyday use',
    business_id: 'f3339292-6506-46ad-8c71-adeab8f082a0',
    icon: <Laptop className="w-8 h-8" />,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'mobiles',
    name: 'Smart Mobile Store',
    description: 'Latest smartphones and accessories at your fingertips',
    icon: <Smartphone className="w-8 h-8" />,
    business_id: '62120ad1-05f0-428e-89e0-630060eaba9b',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'clothing',
    name: 'Fashion Forward',
    description:
      'Curated collection of designer wear, casual outfits, and seasonal fashion.',
    icon: <Shirt className="w-8 h-8" />,
    business_id: 'decd0dac-98d4-400c-be9f-1b5cc2d1ee89',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Essentials',
    description: 'Modern appliances for your culinary adventures',
    icon: <Home className="w-8 h-8" />,
    business_id: '33c00443-e266-4b44-8cd8-9dc0029288b4',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=1000',
  },
];

const page = () => {
  return (
    <div className="mx-auto max-w-[700px] my-10">
      <h1 className="text-4xl font-bold text-center  mb-4">
        Our Business Partners
      </h1>
      <p className="text-center text-2xl">
        Select a business to start chatting with AI
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8 sm:p-20 p-16 ">
        {businesses?.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default page;

const BusinessCard = ({ business }: { business: Business }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/chat/${business.business_id}`)}
      className="group cursor-pointer relative overflow-hidden rounded-3xl aspect-[2/2] "
    >
      <div className="absolute inset-0">
        <Image
          src={business.image}
          alt={business.name}
          layout="fill"
          className="transition-transform duration-700 group-hover:scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
      </div>

      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="self-end">
          <Button
            onClick={() => router.push(`/chat/${business.id}`)}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium 
                           transition-transform duration-300 transform group-hover:-translate-y-1
                           flex items-center gap-2"
          >
            Chat Now
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-white">
          <h2 className="text-2xl font-semibold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            {business.name}
          </h2>
          <p className="text-white/90 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            {business.description}
          </p>
        </div>
      </div>
    </div>
  );
};
