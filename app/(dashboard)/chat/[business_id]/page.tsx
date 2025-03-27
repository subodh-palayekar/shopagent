import Chat from '../../../../components/Chat';

import { v4 } from 'uuid';

export default async function ChatPage({
  params,
}: {
  params: { business_id: string };
}) {
  const { business_id } = await params;

  const chat_id = v4();

  return (
    <Chat
      key={chat_id}
      business_id={business_id}
      id={chat_id}
      initialMessages={[]}
    />
  );
}
