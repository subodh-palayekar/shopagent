import { Message } from 'ai';
import db from '.';

export async function saveChat({
  id,
  messages,
  user_id,
  business_id,
  title,
}: {
  id: string;
  messages: any;
  user_id: string;
  business_id: string;
  title: string;
}) {
  try {
    const result = await db.chat.findUnique({
      where: { id: id },
      select: { messages: true },
    });
    const selectedChat: Array<Message> =
      (result?.messages as unknown as Array<Message>) ?? [];

    if (selectedChat && selectedChat.length > 0) {
      return await db.chat.update({
        where: { id: id },
        data: {
          messages,
        },
      });
    } else {
      return await db.chat.create({
        data: {
          id,
          messages,
          userId: user_id,
          businessId: business_id,
          title,
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    throw new Error('failed to save chat in database');
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = await db.chat.findUnique({ where: { id } });

    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function getChatHistoryByUserID({ userId }: { userId: string }) {
  console.log({ userId });
  try {
    const userChatHistroy = await db.chat.findMany({ where: { userId } });

    return userChatHistroy;
  } catch (error) {
    console.error('Failed to get chat by userId from database');
    throw error;
  }
}
