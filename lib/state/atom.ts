// state/atoms.ts
import { Message } from 'ai';
import { atom, selector } from 'recoil';

// Example interface for complex state
interface ChatState {
  chat_id: string;
  business_id: string;
  initialMessages: Message[] | [];
  get?: () => ChatState;
}

export const chatState = atom<ChatState | null>({
  key: 'chatState',
  default: { chat_id: '', business_id: '', initialMessages: [] },
});

export const chatStateSelector = selector<ChatState | null>({
  key: 'chatStateSelector',
  get: ({ get }) => {
    const chatData = get(chatState);
    return chatData;
  },
});
