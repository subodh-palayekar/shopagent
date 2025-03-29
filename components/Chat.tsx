'use client';
import { type Message } from 'ai';
import React, { useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput, ChatInputSubmit, ChatInputTextArea } from './Chat-input';
import MessagePreview from './MessagePreview';

import Overview from './Overview';

type ChatProps = {
  id: string;
  business_id: string;
  initialMessages: Message[];
};

const Chat = ({ id, business_id, initialMessages }: ChatProps) => {
  const { messages, handleSubmit, input, handleInputChange, stop, status } =
    useChat({
      id,
      body: { id, business_id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, '', `/chat/${business_id}/${id}`);
      },
    });

  // const [messagesContainerRef, messagesEndRef] =
  //   useRef<HTMLDivElement>();

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  return (
    <div className=" flex flex-row justify-center  pb-4 md:pb-8 bg-background h-[calc(100dvh-60px)] ">
      <div className="flex flex-col justify-between items-center gap-4 max-w-[720px] w-full">
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto w-full flex flex-col pt-4 gap-5"
        >
          {messages.length === 0 && (
            <Overview
              id={id}
              business_id={business_id}
              initialMessages={initialMessages}
            />
          )}

          {messages.map((msg) => {
            return (
              <div className="m-2" key={msg.id}>
                <MessagePreview
                  chat_id={id}
                  business_id={business_id}
                  initialMessages={initialMessages}
                  msg={msg}
                />
              </div>
            );
          })}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <div className="w-full ">
          <ChatInput
            variant="default"
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={
              status === 'submitted' || status === 'streaming' ? true : false
            }
            onStop={stop}
            className="max-h-[200px] h-full"
          >
            <ChatInputTextArea placeholder="Type a message..." />
            <ChatInputSubmit className="w-[40px] h-[40px] " />
          </ChatInput>
        </div>
      </div>
    </div>
  );
};

export default Chat;
