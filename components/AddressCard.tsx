'use client';
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Check, MapPin, PlusCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Address } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Message } from 'ai';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { useChat } from '@ai-sdk/react';

const AddressCard = ({
  address,
  setSelectedAddress,
  selectedAddress,
  chat_id,
  business_id,
  initialMessages,
}: {
  address: Address;
  setSelectedAddress: (value: string | null) => void;
  selectedAddress: string | null;
  chat_id: string;
  business_id: string;
  initialMessages: Message[];
}) => {
  const { append } = useChat({
    id: chat_id,
    body: { id: chat_id, business_id: business_id },
    initialMessages: initialMessages,
    maxSteps: 10,
  });

  const handleSelectAddress = (id: string) => {
    setSelectedAddress(id);
    const formattedAddress = `
    Address Line 1: ${address.AddressLineOne}
    ${address.AddressLineTwo ? `Address Line 2: ${address.AddressLineTwo}` : ''}
    City: ${address.city}
    State: ${address.state}
    Country: ${address.country}
    Postal Code: ${address.pincode}
  `.replace(/^\s+/gm, '');

    append({
      role: 'user',
      content: `I'd like to select this address ${formattedAddress}`,
    });
  };
  return (
    <Card
      key={address.id}
      className="hover:shadow-lg transition-shadow p-4 flex  justify-center items-center"
    >
      <CardContent className="flex flex-col justify-between h-full gap-3 px-0">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {address.city}
              </h2>
            </div>
            <Badge variant="secondary">{address.country}</Badge>
          </div>
          <div className="mt-4 space-y-2 text-gray-600 dark:text-white">
            <p>{address.AddressLineOne}</p>
            {address.AddressLineTwo && <p>{address.AddressLineTwo}</p>}
            <p>
              {address.city}, {address.state} {address.pincode}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant={selectedAddress === address.id ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleSelectAddress(address.id)}
          >
            {selectedAddress === address.id ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Selected
              </>
            ) : (
              'Select'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;

const formSchema = z.object({
  AddressLineOne: z.string().min(1, 'Address line one is required'),
  AddressLineTwo: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.string().min(1, 'Pincode is required'),
});

export const AddAddress = ({
  chat_id,
  business_id,
  initialMessages,
}: {
  chat_id: string;
  business_id: string;
  initialMessages: Message[];
}) => {
  const { append } = useChat({
    id: chat_id,
    body: { id: chat_id, business_id: business_id },
    initialMessages: initialMessages,
    maxSteps: 10,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedAddress = `
    Address Line 1: ${values.AddressLineOne}
    ${values.AddressLineTwo ? `Address Line 2: ${values.AddressLineTwo}` : ''}
    City: ${values.city}
    State: ${values.state}
    Country: ${values.country}
    Postal Code: ${values.pincode}
  `.replace(/^\s+/gm, '');

    append({
      role: 'user',
      content: `I'd like to create a new address with the following details:
${formattedAddress}`,
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      AddressLineOne: '',
      AddressLineTwo: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
  });
  return (
    <Dialog>
      <Card>
        <DialogTrigger asChild>
          <CardContent className="flex hover:cursor-pointer justify-between flex-col items-center gap-3">
            <PlusCircle size={26} />
            <Badge>Add Address</Badge>
          </CardContent>
        </DialogTrigger>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="AddressLineOne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, P.O. box" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="AddressLineTwo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apartment, suite, unit, building, floor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province/Region</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
