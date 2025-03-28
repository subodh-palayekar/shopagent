import { cn } from '@/lib/utils';
import { Message } from 'ai';
import { BotIcon, Check, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MapPin } from 'lucide-react';
import { ProductList } from './ProductCard';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Address } from '@prisma/client';
import { Button } from './ui/button';
import AddressCard, { AddAddress } from './AddressCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Skeleton } from './ui/skeleton';

const MessagePreview = ({
  msg,
  chat_id,
  business_id,
  initialMessages,
}: {
  msg: Message;
  chat_id: string;
  business_id: string;
  initialMessages: Message[];
}) => {
  const { role, content, id, parts } = msg;

  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  if (!isLoaded) {
    return null;
  }
  return (
    <div
      className={cn('flex flex-col items-start gap-2', {
        'flex-row-reverse justify-start': role === 'user',
      })}
    >
      <div className="rounded-full  border-2">
        {role === 'assistant' ? (
          <BotIcon width={30} />
        ) : user?.imageUrl ? (
          <Image
            className="rounded-full"
            src={user.imageUrl}
            alt="user profile img"
            width={26}
            height={26}
          />
        ) : (
          <UserIcon width={36} />
        )}
      </div>

      {parts?.map((ele) => {
        const type = ele.type;

        if (type === 'text') {
          return (
            <div
              className={cn({
                'max-w-[80%]': role === 'user',
              })}
            >
              {' '}
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          );
        } else if (type === 'tool-invocation') {
          const toolInvocation = ele.toolInvocation;

          const { toolName, toolCallId, state } = toolInvocation;

          if (state === 'result') {
            switch (toolName) {
              case 'getProducts':
                {
                  const { filteredResult } = toolInvocation.result;

                  return (
                    <div className="flex flex-col gap-2">
                      {filteredResult?.map((product: any) => (
                        <ProductList
                          key={product.id}
                          product={product}
                          chat_id={chat_id}
                          business_id={business_id}
                          initialMessages={initialMessages}
                        />
                      ))}
                    </div>
                  );
                }
                break;
              case 'getAddress':
                {
                  const { userAddress } = toolInvocation.result;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {userAddress?.map((address: Address) => (
                        <AddressCard
                          selectedAddress={selectedAddress}
                          setSelectedAddress={setSelectedAddress}
                          key={address.id}
                          address={address}
                          chat_id={chat_id}
                          business_id={business_id}
                          initialMessages={initialMessages}
                        />
                      ))}
                      <AddAddress
                        chat_id={chat_id}
                        business_id={business_id}
                        initialMessages={initialMessages}
                      />
                    </div>
                  );
                }
                break;
              case 'createAddress':
                break;
              case 'AvailblePaymentMethods':
                {
                  const paymentMethods = toolInvocation.result;
                  return (
                    <PaymentMethodSelector
                      chat_id={chat_id}
                      business_id={business_id}
                      initialMessages={initialMessages}
                      paymentMethods={paymentMethods}
                    />
                  );
                }
                break;
              default:
                break;
            }
          } else {
            return (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            );
          }

          return <></>;
        }
      })}
    </div>
  );
};

export default MessagePreview;
