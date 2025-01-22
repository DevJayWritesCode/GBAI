import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from "lucide-react";
import React, { useRef, useEffect } from 'react'
import { cn } from "@/lib/utils";

export default function ChatComponent({ messages = [], input, setInput, isLoading, handleSubmit }: any) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Scroll whenever messages change
    return (
        <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-8 p-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-foreground py-20">
                            <h2 className="text-2xl font-bold mb-2">
                                How can I help you today?
                            </h2>
                            <p>Start a conversation by typing a message below.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message: any, i: any) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-4 p-4 rounded-lg",
                                        message.role === "assistant" && "bg-background/50 backdrop-blur-sm"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            message.role === "assistant"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {message.role === "assistant" ? (
                                            <MessageSquare size={16} />
                                        ) : (
                                            "U"
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium mb-1 text-sm">
                                            {message.role === "assistant" ? "Ghost AI" : "You"}
                                        </div>
                                        <div className="text-sm leading-relaxed break-words">
                                            {message.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-background/50 backdrop-blur-sm">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl mx-auto relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "Waiting for response..." : "Type a message..."}
                        disabled={isLoading}
                        className="w-full p-4 pr-20 rounded-lg bg-background/50 backdrop-blur-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm md:text-base disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="absolute right-2 top-2"
                        disabled={!input.trim() || isLoading}
                    >
                        {isLoading ? "..." : "Send"}
                    </Button>
                </form>
            </div>
        </>
    )
}

