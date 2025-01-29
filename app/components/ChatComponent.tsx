import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from "lucide-react";
import React, { useRef, useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

export default function ChatComponent({ messages = [], input, setInput, isLoading, handleSubmit, onLoadMore, hasMore, loggedIn }: any) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [fromPastFetch, setFromPastFetch] = useState(false);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setIsLoadingMore(false);
    };

    const handleLoadMore = async () => {
        if (!hasMore || isLoadingMore) return;

        setIsLoadingMore(true);
        setFromPastFetch(true);
        try {
            await onLoadMore();
        } catch (error) {
            console.error('Error loading more messages:', error);
        }
        setIsLoadingMore(false)
    };

    useEffect(() => {
        if (messages.length > 0 && !fromPastFetch) {
            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [messages, isLoadingMore]);


    return (
        <>
            <div
                className="flex-1 overflow-y-auto"
                ref={scrollAreaRef}
                style={{ overscrollBehavior: "contain" }}
                onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollTop === 0 && hasMore && !isLoadingMore) {
                        handleLoadMore();
                    }
                }}
            >
                <div className="max-w-3xl mx-auto space-y-8 p-4">
                    {!loggedIn && messages.length == 0 ? (
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
                    ) : loggedIn && messages.length == 0 ? (
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
                                    Loading...
                                </div>
                                <div className="text-sm leading-relaxed break-words">
                                    Messages are loading...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {hasMore && (
                                <div className="text-center mb-4">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {isLoadingMore ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                <span>Loading messages...</span>
                                            </div>
                                        ) : (
                                            "Load More Messages"
                                        )}
                                    </Button>
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
                                                    ? "bg-primary  text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            {message.role === "Ghost AI" || message.role == 'assistant' ? (
                                                <Image
                                                    src="/ghost_pfp.jpg"
                                                    alt="Ghost Buddy"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                "👤"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium mb-1 text-sm">
                                                {message.role == 'assistant' || message.role == 'Ghost AI' ? 'Ghost Buddy' : 'You'}
                                            </div>
                                            <div className="text-sm leading-relaxed break-words prose prose-invert max-w-none">
                                                {message.role == 'assistant' || message.role == 'Ghost AI' ? (
                                                    <ReactMarkdown
                                                        components={{
                                                            code({ node, className, children, ...props }: any) {
                                                                return (
                                                                    <SyntaxHighlighter
                                                                        {...props}
                                                                        style={vscDarkPlus}
                                                                        PreTag="div"
                                                                    >
                                                                        {String(children).replace(/\n$/, '')}
                                                                    </SyntaxHighlighter>
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        {message.message}
                                                    </ReactMarkdown>
                                                ) : (
                                                    message.message
                                                )}
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

            {/* <div className="border-t border-border p-4 bg-background/50 backdrop-blur-sm">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl mx-auto relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "Waiting for response..." : isLoadingMore ? "Loading previous messages..." : "Type a message..."}
                        disabled={isLoading || isLoadingMore}
                        className="w-full p-4 pr-20 rounded-lg bg-background/50 backdrop-blur-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring text-md disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        onClick={() => setFromPastFetch(false)}
                        disabled={isLoading || isLoadingMore}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        Send
                    </Button>
                </form>
            </div> */}
        </>
    )
}

