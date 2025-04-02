import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  InfoIcon,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import Image from 'next/image';

interface ProductListProps {
  product: {
    name: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
    images: string[];
  };
  chat_id: string;
  business_id: string;
  initialMessages: Message[];
}

const defaultImages = [
  'https://97zyk91lze.ufs.sh/f/pZbsqHhVCF9oBVJLwgYkmtkg1CB2XQr03l5nIcGfsNZD6pyU',
];

export function ProductList({
  product,
  chat_id,
  business_id,
  initialMessages,
}: ProductListProps) {
  const images = product.images.length > 0 ? product.images : defaultImages;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { append } = useChat({
    id: chat_id,
    body: { id: chat_id, business_id: business_id },
    initialMessages: initialMessages,
    maxSteps: 10,
  });
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-3xl hover:shadow-lg transition-shadow aspect-square w-2xs">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={images[currentImageIndex]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-10 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-10 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* <Badge className="bg-white/20 text-white hover:bg-white/30">
            {product.brand}
          </Badge> */}
          {/* <div className="flex gap-2"> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <InfoIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">
              <div className="grid gap-2">
                <h4 className="font-medium">Full Specifications</h4>
                <Separator />
                <div className="h-[300px] overflow-y-auto pr-4">
                  {Object.entries(product.attributes).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="py-2 border-b last:border-0">
                          <div className="text-sm capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-medium">{value}</div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() =>
              append({
                role: 'user',
                content: `I'd like to buy ${product.name}`,
              })
            }
            className="bg-white text-black hover:bg-white/90 rounded-full gap-2 px-4 shadow-lg transform transition-transform group-hover:-translate-y-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </Button>
          {/* </div> */}
        </div>

        {/* Product Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start flex-col">
            <h2 className="text-xl font-bold tracking-tight transform transition-transform group-hover:translate-y-[-4px]">
              {product.name}
            </h2>
            <div className="text-xl font-bold">${product.price}</div>
          </div>

          <p className="text-white/90 text-sm transform transition-transform group-hover:translate-y-[-4px]">
            {product.description}
          </p>

          {/* <div className="grid grid-cols-2 gap-2 text-sm">
            {mainAttributes.map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-white/70">
                  {capitalizeFirstLetter(key)}:
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="col-span-2">
              <span className="text-white/70">Stock:</span>
              <span className="font-medium ml-2">{product.stock} units</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
