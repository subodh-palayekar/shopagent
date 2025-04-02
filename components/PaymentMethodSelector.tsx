'use client';
import * as React from 'react';
import { Card } from './ui/card';
import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  chat_id: string;
  business_id: string;
  initialMessages: Message[];
}

export function PaymentMethodSelector({
  paymentMethods,
  chat_id,
  business_id,
  initialMessages,
}: PaymentMethodSelectorProps) {
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>('');

  const { append } = useChat({
    id: chat_id,
    body: { id: chat_id, business_id: business_id },
    initialMessages: initialMessages,
    maxSteps: 10,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Payment Method</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method, index) => (
          <Card
            key={`${method.id + index}`}
            className={`p-4 cursor-pointer transition-all ${
              selectedMethodId === method.id
                ? 'border-2 border-primary bg-primary/10'
                : 'hover:border-primary/30'
            } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();

              if (!method.enabled) {
                return;
              }
              setSelectedMethodId(method.id);

              append({
                role: 'user',
                content: `I'd like to select ${method.name} as payment method`,
              });
            }}
          >
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedMethodId === method.id}
                onChange={() => {}}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                disabled={!method.enabled}
              />
              <div className="flex-1">
                <label
                  htmlFor={method.id}
                  className="block text-sm font-medium leading-none"
                >
                  {method.name}
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
