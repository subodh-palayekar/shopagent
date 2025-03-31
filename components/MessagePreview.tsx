import { cn } from '@/lib/utils';
import { Message } from 'ai';
import { UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ProductList } from './ProductCard';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Address } from '@prisma/client';
import AddressCard, { AddAddress } from './AddressCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Skeleton } from './ui/skeleton';
import { ProductType } from '@/db/model';
import { OrderConfirmation } from './OrderConfirmation';

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
  const { role, content, parts, id } = msg;

  const { user, isLoaded } = useUser();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [isToolCall, setIsToolCall] = useState(false);

  useEffect(() => {
    if (parts) {
      const hasToolInvocation = parts.some(
        (part) => part.type === 'tool-invocation'
      );
      setIsToolCall(hasToolInvocation);
    }
  }, [parts]);

  if (!isLoaded) {
    return null;
  }
  return (
    <div
      className={cn('flex flex-row items-center gap-2', {
        'flex-row-reverse justify-start': role === 'user',
        'flex-col items-start': isToolCall,
      })}
    >
      <div className="rounded-full  border-2">
        {role === 'assistant' ? (
          <Image
            className="rounded-full"
            src={'/logo.png'}
            alt="bot profile img border-2 "
            width={28}
            height={28}
          />
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

      {parts?.map((ele, index) => {
        const type = ele.type;

        if (type === 'text') {
          return (
            <div
              key={`${index + id}`}
              className={cn({
                'max-w-[80%]':
                  role === 'user' || (!isToolCall && role === 'assistant'),
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
                    <div
                      key={toolCallId}
                      className="flex flex-row flex-wrap gap-3"
                    >
                      {filteredResult?.map((product: ProductType) => (
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
              case 'orderConfirmation':
                {
                  const { orderDetails } = toolInvocation.result;
                  return <OrderConfirmation orderDetails={orderDetails} />;
                }
                break;
              default:
                break;
            }
          } else {
            return (
              <div key={'skeleton'} className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            );
          }

          return null;
        }
      })}
    </div>
  );
};

export default MessagePreview;
