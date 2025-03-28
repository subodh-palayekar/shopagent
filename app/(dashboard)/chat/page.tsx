'use client';
import { Laptop, Shirt, Smartphone, Home } from 'lucide-react';
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
    business_id: '9967741463',
    icon: <Laptop className="w-8 h-8" />,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'mobiles',
    name: 'Smart Mobile Store',
    description: 'Latest smartphones and accessories at your fingertips',
    icon: <Smartphone className="w-8 h-8" />,
    business_id: '9967741463',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'clothing',
    name: 'Fashion Forward',
    description:
      'Curated collection of designer wear, casual outfits, and seasonal fashion.',
    icon: <Shirt className="w-8 h-8" />,
    business_id: '9967741463',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Essentials',
    description: 'Modern appliances for your culinary adventures',
    icon: <Home className="w-8 h-8" />,
    business_id: '9967741463',
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
      <p className="text-center  mb-12">
        Select a business to start chatting with their representative
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8 ">
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
    <div className="w-80 border-2 rounded-2xl">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg ">
          <Image
            src={business.image}
            alt="thumbnail"
            layout="fill"
            objectFit="cover"
            className={`transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl`}
          />
        </div>
        <div className="p-4">
          <h2 className=" text-lg font-bold text-zinc-700">{business.name}</h2>
          <h2 className=" text-sm font-normal text-zinc-500">
            {business.description}
          </h2>
          <div
            onClick={() => router.push(`/chat/${business.business_id}`)}
            className="mt-3 cursor-pointer flex flex-row items-center justify-between"
          >
            <div className="relative z-10 block rounded-xl bg-black px-6 py-2 text-xs font-bold text-white">
              Start Chat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
