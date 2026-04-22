"use-client"
import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { BusinessPlan } from '@/lib/types';
import { DefaultChatTransport } from 'ai';
import {
    Conversation,
    ConversationContent,
    ConversationDownload,
    ConversationEmptyState,
    ConversationScrollButton,
} from "@branda/ui/components/ai-elements/conversation";
import {
    Message,
    MessageContent,
    MessageResponse,
} from "@branda/ui/components/ai-elements/message";
import {
    PromptInput,
    type PromptInputMessage,
    PromptInputTextarea,
    PromptInputSubmit,
} from "@branda/ui/components/ai-elements/prompt-input";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

interface BrainstormingViewProps {
    plan: BusinessPlan;
}

export const BrainstormingView: React.FC<BrainstormingViewProps> = ({ plan }) => {
    const [input, setInput] = useState("");
    const { messages, status, sendMessage, } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                workspaceContext: plan,
                // messages: [{ id: 'initial-1', role: 'assistant', content: `` }]
            }
        }),
    });

    const handleSubmit = (message: PromptInputMessage) => {
        if (message.text.trim()) {
            sendMessage({ text: message.text });
            setInput("");
        }
    };
    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
            <div className="flex flex-col h-full">
                <Conversation>
                    <ConversationContent>
                        {messages.length === 0 ? (
                            <ConversationEmptyState
                                icon={<MessageSquare className="size-12" />}
                                title="Start a conversation"
                                description={`Hi! I'm your AI co-founder for **${plan.brandIdentity.name}**. I have full context of your business plan. What should we brainstorm today?`}
                            />
                        ) : (
                            messages.map((message) => (
                                <Message from={message.role} key={message.id}>
                                    <MessageContent>
                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case "text": // we don't use any reasoning or tool calls in this example
                                                    return (
                                                        <MessageResponse key={`${message.id}-${i}`}>
                                                            {part.text}
                                                        </MessageResponse>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })}
                                    </MessageContent>
                                </Message>
                            ))
                        )}
                    </ConversationContent>
                    <ConversationDownload messages={messages} />
                    <ConversationScrollButton />
                </Conversation>
                <PromptInput
                    onSubmit={handleSubmit}
                    className="mt-4 w-full max-w-2xl mx-auto relative"
                >
                    <PromptInputTextarea
                        value={input}
                        placeholder="Say something..."
                        onChange={(e) => setInput(e.currentTarget.value)}
                        className="pr-12"
                    />
                    <PromptInputSubmit
                        status={status === "streaming" ? "streaming" : "ready"}
                        disabled={!input.trim()}
                        className="absolute bottom-1 right-1"
                    />
                </PromptInput>
            </div>
        </div>
    )
};