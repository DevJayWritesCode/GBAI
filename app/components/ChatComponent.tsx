import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from "lucide-react";
import React, { useRef, useEffect, useState } from 'react'
import { cn } from "@/lib/utils";

export default function ChatComponent({ messages = [], input, setInput, isLoading, handleSubmit, onLoadMore, hasMore }: any) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadedMessageIds, setLoadedMessageIds] = useState<Set<string>>(new Set());
    const [isScrollLocked, setIsScrollLocked] = useState(isLoading);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    const scrollToBottom = () => {
        if (!isScrollLocked) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScroll = async (e: any) => {
        if (isScrollLocked) { return }
        else {
            const container = e.target;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // Only trigger load more when explicitly scrolling up at the top
            if (!hasMore || isLoadingMore || scrollTop > 10) return;

            setIsScrollLocked(true);
            setLastScrollPosition(scrollHeight - clientHeight);
            setIsLoadingMore(true);

            try {
                await onLoadMore();
                // Use RAF to ensure DOM has updated
                requestAnimationFrame(() => {
                    if (container) {
                        container.scrollTop = container.scrollHeight - lastScrollPosition;
                    }
                    setIsScrollLocked(false);
                });
            } catch (error) {
                console.error('Error loading more messages:', error);
                setIsScrollLocked(false);
            } finally {
                setIsLoadingMore(false);
            }
        }


    };

    useEffect(() => {
        // Initialize loadedMessageIds with current messages
        const initialMessageIds = messages.map((msg: any) =>
            msg.id || `${msg.role}-${msg.message}`
        );
        setLoadedMessageIds(new Set(initialMessageIds));
    }, []);

    useEffect(() => {
        if (messages.length > 0 && !isLoadingMore) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "Ghost Buddy") {
                // Use requestAnimationFrame to ensure smooth scrolling
                requestAnimationFrame(() => {
                    scrollToBottom();
                });
            }
        }
    }, [messages, isLoadingMore]);

    return (
        <>
            <div className="flex-1 overflow-y-auto" ref={scrollAreaRef} onScroll={handleScroll}>
                <div className="max-w-3xl mx-auto space-y-8 p-4">
                    {messages.length === 0 ? (
                        <div className={cn(
                            "flex gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
                        )}>
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground"
                                )}
                            >
                                <MessageSquare size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium mb-1 text-sm">
                                    Ghost Buddy
                                </div>
                                <div className="text-sm leading-relaxed break-words">
                                    Hello there, bright soul ✨! How can I help you today!
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {hasMore && (
                                <div className="text-center text-sm text-muted-foreground">
                                    {isLoadingMore ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span>Loading messages...</span>
                                        </div>
                                    ) : (
                                        "Scroll up to load more messages"
                                    )}
                                </div>
                            )}
                            {messages.map((message: any, i: any) => {
                                const messageId = message.id || `${message.role}-${message.message}-${i}`;
                                return (
                                    <div
                                        key={messageId}
                                        className={cn(
                                            "flex gap-4 p-4 rounded-lg",
                                            message.role === "Ghost Buddy" && "bg-background/50 backdrop-blur-sm"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                message.role === "Ghost Buddy"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            {message.role === "Ghost AI" ? (
                                                <MessageSquare size={16} />
                                            ) : (
                                                "U"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium mb-1 text-sm">
                                                {message.role == 'assistant' ? 'Ghost Buddy' : 'You'}
                                            </div>
                                            <div className="text-sm leading-relaxed break-words">
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

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
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        Send
                    </Button>
                </form>
            </div>
        </>
    )
}

