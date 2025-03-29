import { convertToUIMessages } from '@/lib/utils';
import PreviewChat from '../../../../../components/Chat';
import { getChatById } from '@/db/chat.queries';
import { type Chat } from '@prisma/client';
import { CoreMessage, Message } from 'ai';
import { notFound } from 'next/navigation';
import React from 'react';

type ChatWithMessages = Omit<Chat, 'messages'> & {
  messages: Array<Message>;
};

const page = async ({
  params,
}: {
  params: { chat_id: string; business_id: string };
}) => {
  const { chat_id, business_id } = await params;

  const chatFromDb = await getChatById({ id: chat_id });

  if (!chatFromDb) {
    notFound();
  }

  const previousChat: ChatWithMessages = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  return (
    <PreviewChat
      key={chat_id}
      business_id={business_id}
      id={chat_id}
      initialMessages={previousChat.messages}
    />
  );
};

export default page;
