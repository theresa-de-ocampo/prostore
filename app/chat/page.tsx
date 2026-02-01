"use client";

import { isTextUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, type SyntheticEvent } from "react";

// * Components
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputMessage
} from "@/components/ai-elements/prompt-input";

export default function ChatPage() {
  const [text, setText] = useState<string>("");
  const { messages, sendMessage, status } = useChat();

  function handleSubmit(
    _: PromptInputMessage,
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    sendMessage({ text });
    setText("");
  }

  return (
    <section>
      <Conversation className="pt-28 pb-56 max-w-5xl mx-auto">
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse>
                  {message.parts
                    .filter(isTextUIPart)
                    .map((part) => part.text)
                    .join("")}
                </MessageResponse>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="fixed left-0 bottom-16 w-full bg-background py-6 px-4">
        <div className="max-w-6xl mx-auto border-t pt-6">
          <PromptInput onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="How can I help you?"
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit
                disabled={!(text.trim() || status) || status === "streaming"}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </section>
  );
}
