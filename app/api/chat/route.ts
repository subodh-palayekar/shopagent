import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  convertToCoreMessages,
  embed,
  generateObject,
  generateText,
  streamText,
  type Message,
} from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { getPaymentMethods } from '@/lib/utils';
import db, { connectToDB } from '@/db';
import { Address } from '@prisma/client';
import { v4 } from 'uuid';
import ProductModel from '@/db/model';
import { getChatHistoryByUserID, saveChat } from '@/db/chat.queries';

export async function POST(req: Request) {
  const { userId: clerkUserId } = await auth();

  await connectToDB();
  if (!clerkUserId) {
    return NextResponse.json(
      { error: 'Error: No signed in user' },
      { status: 401 }
    );
  }

  console.log({ clerkUserId });

  const user = await db.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  console.log({ user });

  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'Error: No signed in user' },
      { status: 401 }
    );
  }

  const {
    messages,
    id,
    business_id,
  }: { id: string; messages: Message[]; business_id: string } =
    await req.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  console.log({ id, business_id });

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `
    - you are shopping assistant ai agent,
    - you help customer to search for product and get information about business
    - keep your responses concise
    - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
    - DO NOT output lists.
    - ask follow up questions to nudge user into the optimal flow
    - This is business_id = ${business_id} & this is user_id = ${userId}
    - you will ask you question related to product specific to business or other business information 
    - please take order from user
    - for taking order please show them all the address that they have and then ask to select address
    - and then ask for payment method
    - and place order
    `,
    messages: coreMessages,
    tools: {
      getProducts: {
        description: 'find product based on business id and user query',
        parameters: z.object({
          query: z.string().describe('user query for product'),
          business_id: z
            .string()
            .describe('business id for which user is search product'),
        }),
        execute: async ({ query, business_id }) => {
          try {
            const { embedding } = await embed({
              model: google.textEmbeddingModel('text-embedding-004'),
              value: query,
            });
            const searchResults = await ProductModel.aggregate([
              {
                $vectorSearch: {
                  index: 'default',
                  path: 'embeddings',
                  queryVector: embedding,
                  numCandidates: 10, // Adjust as needed
                  limit: 5, // Adjust as needed
                },
              },
              {
                $match: { business_id: business_id },
              },
            ]);

            const filteredResult = searchResults.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ embeddings, ...rest }) => rest
            );

            const replyMessage = await generateText({
              model: google('gemini-1.5-flash'),
              system: `You are a shopping agent , which helps user to find product and answer customer queries
            - Analyze these product search results and response back to user by analyzing user query.
            - Answer the query in human tone
            ,`,
              messages: [
                {
                  role: 'user',
                  content: `User query: ${query}\nResults: ${JSON.stringify(
                    filteredResult
                  )}`,
                },
              ],
            });

            return {
              filteredResult,
              replyMessage: replyMessage,
            };
          } catch (error) {
            console.log('Error while getting product', error);
          }
        },
      },

      getAddress: {
        description: `find the user address based on user_id ${userId}`,
        parameters: z.object({
          userId: z.string().describe('user specific id'),
        }),
        execute: async ({ userId }) => {
          try {
            const result = await db.address.findMany({
              where: { userId },
            });

            return { userAddress: result };
          } catch (error) {
            console.error('Error fetching user address:', error);
            return { error: 'Failed to fetch user address' };
          }
        },
      },

      createAddress: {
        description: `create address for user`,
        parameters: z.object({
          AddressLineOne: z.string().min(1, 'Address line one is required'),
          AddressLineTwo: z.string(),
          city: z.string().min(1, 'City is required'),
          state: z.string().min(1, 'State is required'),
          country: z.string().min(1, 'Country is required'),
          pincode: z.string().min(1, 'Pincode is required'),
        }),
        execute: async ({
          AddressLineOne,
          AddressLineTwo,
          city,
          state,
          country,
          pincode,
        }) => {
          const address_body: Address = {
            userId: userId,
            id: v4(),
            createdAt: new Date(),
            AddressLineOne,
            AddressLineTwo,
            city,
            state,
            country,
            pincode,
            updatedAt: new Date(),
          };

          const result = await db.address.create({ data: address_body });
          return result;
        },
      },

      AvailblePaymentMethods: {
        description: `shows all the availble payment methods`,
        parameters: z.object({
          user_id: z.string(),
        }),
        execute: async ({ user_id }) => {
          console.log(user_id);
          const paymentMethods = await getPaymentMethods();
          return paymentMethods;
        },
      },
    },
    onFinish: async ({ response }) => {
      if (userId) {
        try {
          const userMessage = response?.messages;
          const titleResponse = await generateObject<{ title: string }>({
            model: google('gemini-1.5-flash'),
            schema: z.object({ title: z.string() }),
            system: `Please analyse the user message and generate title for this chat make sure you do not include any id it should simple title for chat`,
            messages: [
              {
                role: 'user',
                content: `User Message ${JSON.stringify(userMessage)}`,
              },
            ],
          });
          const title = titleResponse.object.title;
          await saveChat({
            id,
            messages: [...coreMessages, ...response?.messages],
            user_id: userId,
            business_id,
            title,
          });
        } catch (error) {
          console.error('Failed to save chat', error);
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({});
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Error: No signed in user' },
        { status: 401 }
      );
    }
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    console.log({ user });

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Error: No signed in user' },
        { status: 401 }
      );
    }

    await connectToDB();
    const userChatHistory = await getChatHistoryByUserID({ userId });

    if (!userChatHistory) {
      return NextResponse.json(
        { message: 'No chat history found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userChatHistory, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
