import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  InfoIcon,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { capitalizeFirstLetter } from '@/lib/utils';
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
  'https://images.unsplash.com/photo-1635870723802-e88d76ae324e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60',
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

  const attributeEntries = Object.entries(product.attributes).filter(
    ([, value]) => Boolean(value) // filter out attributes with empty or null values
  );

  // You can decide how many "main" attributes to display:
  // e.g., the first 4 attributes only, or something else
  const mainAttributes = attributeEntries.slice(0, 4);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-6 bg-card p-2 rounded-lg hover:shadow-lg transition-shadow
                 sm:flex-row sm:items-center"
    >
      {/* Product Image with Navigation */}
      <div
        className="relative w-full h-48 items-center flex-shrink-0 group
                   sm:w-48 sm:h-48"
      >
        <Image
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain rounded-md"
          width={100}
          height={100}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2
                         opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2
                         opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <InfoIcon className="h-4 w-4" />
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
                            <div
                              key={key}
                              className="py-2 border-b last:border-0"
                            >
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
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {product.brand}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Stock: {product.stock} units
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold">${product.price}</div>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          {product.description}
        </p>

        <div className="grid  sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-1 mb-4">
          {mainAttributes.map(([key, value]) => (
            <div key={key} className="flex items-center text-sm gap-3">
              <span className="text-muted-foreground ">
                {capitalizeFirstLetter(key) || key}:
              </span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            onClick={() => {
              append({
                role: 'user',
                content: `I'd like to buy ${product.name}`,
              });
            }}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
