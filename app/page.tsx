"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { Menu, MessageSquare, Plus, PowerIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sentiment from "sentiment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getCurrentChat, getUserByEmail, logConversation, signOutUser, getSummary } from "./firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateResponse, getMessages } from "@/lib/huggingface";
import ChatComponent from "./components/ChatComponent";
import DailyJournal from "./components/DailyJournal";
import { redirect } from 'next/navigation'
import ComingSoon from "./components/ComingSoon";

interface Message {
  role: string;
  timestamp: number;
  message: string;
  mood: string;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<{}>({});
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(1)
  const [currentPage, setCurrentPage] = useState('Chat')
  const [user, loading, error] = useAuthState(auth);
  const [currentChatID, setCurrentChatID] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!loading && user) {
      getUserByEmail(user?.email).then((snapshot) => {
        const res = snapshot.val();
        loadInitialMessages();
      });
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [user, loading]);

  const loadInitialMessages = async () => {
    if (!user?.email) return;
    const data = await getMessages(user.email, 10);
    if (data && data.length > 0) {
      setMessages(data.reverse());
      setOldestMessageTimestamp(data[data.length - 1].timestamp);
      setHasMore(data.length >= 10);
    } else {
      setMessages([]);
      setHasMore(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!user?.email || !hasMore || !oldestMessageTimestamp) return;
    const olderMessages = await getMessages(user.email, 10, oldestMessageTimestamp);
    if (olderMessages && olderMessages.length > 0) {
      setMessages(prevMessages => {
        const newMessages = olderMessages.reverse();
        const uniqueMessages = newMessages.filter(newMsg =>
          !prevMessages.some(prevMsg => prevMsg.timestamp === newMsg.timestamp)
        );
        return [...uniqueMessages, ...prevMessages];
      });
      setOldestMessageTimestamp(olderMessages[olderMessages.length - 1].timestamp);
      setHasMore(olderMessages.length >= 10);
    } else {
      setHasMore(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const userMessage: Message = { role: "user", timestamp: Date.now(), mood: "", message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    if (isMobile) setIsSidebarOpen(false);

    setIsLoading(true);
    try {
      const response = await generateResponse(input, user?.email);
      const assistantMessage: Message = {
        role: "Ghost AI",
        timestamp: Date.now(),
        mood: "",
        message: response,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error("Error:", error?.message || error);
      const errorMessage: Message = {
        role: "Ghost AI",
        timestamp: Date.now(),
        mood: "",
        message: "I apologize, but I'm having trouble generating a response right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    getUserByEmail(user?.email).then((snapshot) => {
      const res = snapshot.val()
      getMessages(user?.email, 10).then((data) => {
        const summary: Message[] = data
        if (summary) {
          setMessages(summary)
        } else
          setMessages([])
      })
    });
  };

  function analyzeMood(inputText: string) {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(inputText);

    if (result.score <= 5 && result.score >= -6) {
      setCurrentBg(result.score)
    } else if (result.score > 5) {
      setCurrentBg(5)
    } else if (result.score < -6) {
      setCurrentBg(-6)
    }

  }

  const setCurrentChat = (input: string) => {
    console.log(input)
    getUserByEmail(user?.email).then((snapshot) => {
      const res = snapshot.val()
      getCurrentChat(Object.keys(res)[0], input).then((data) => {
        const summary: Message[] = data.val()
        console.log(summary)
        if (summary) {
          setMessages(Object.values(summary).flat().reverse())
        } else
          setMessages([])
      })

    })
  }

  const initializeChat = () => {
    setMessages([]);
    setCurrentChatID('')
  }

  const signOut = async () => {
    document.cookie = "isLoggedIn=false; path=/; max-age=3600; secure; samesite=strict";
    await signOutUser();
    window.location.href = '/';
  }


  return (<>
    <SplashScreen onLoadingComplete={() => setShowSplash(false)} />
    <div className="app-background">
      {selectedImage && <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out" style={{ backgroundImage: `url(${selectedImage})` }} />}
      <div className={`absolute inset-0 ${`bg-${currentBg}`} opacity-60 transition-all duration-500 ease-in-out`} />
    </div>
    <div className="flex h-screen bg-background/30 backdrop-blur-sm relative">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 bg-background/50 backdrop-blur-md border-r border-border transition-all duration-300 overflow-hidden",
          isMobile ? "fixed inset-y-0 left-0 z-50" : "relative",
          isSidebarOpen ? "w-80" : "w-0"
        )}
      >
        <div className={cn(
          "h-full w-80 flex flex-col items-between justify-between p-4",
          !isSidebarOpen && "invisible"
        )}>
          <div>
            <div className="flex items-center justify-start mb-4 text-sm mx-2 space-x-2">
              {user ? (
                <>
                  <span>Hello</span> <span className="font-bold">{user.email}</span>
                </>
              ) : (
                <span>Welcome Guest</span>
              )}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={20} />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2"
                onClick={
                  () => setCurrentPage('Chat')
                }
              >
                Chat 💬
              </Button>

            </div>

            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2"
                onClick={
                  () => user ? setCurrentPage('Journal') : window.location.href = '/login'
                }
              >
                Daily Journal 📖
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2"
                onClick={
                  () => user ? setCurrentPage('Dreamscape') : window.location.href = '/login'
                }
              >
                Dreamscape ✨
              </Button>
            </div>
          </div>

          <Separator className="my-4" />
          {user ? (
            <Button onClick={signOut} variant="ghost" className="justify-start gap-2">
              <PowerIcon size={16} />
              Log out <span className="text-xs text-gray-700"> ({user.email})</span>
            </Button>
          ) : (
            <Button onClick={() => redirect('/login')} variant="ghost" className="justify-start gap-2">
              <PowerIcon size={16} />
              Log in
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col relative"
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollTop <= 0 && hasMore && !isLoading) {
            loadMoreMessages();
          }
        }}
        style={{ overflowY: 'auto', overscrollBehavior: 'none' }}
      >
        {isLoading && hasMore && (
          <div className="absolute top-0 left-0 right-0 flex justify-center py-2 bg-background/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background/50 backdrop-blur-sm sticky top-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          <h2 className="text-center font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
            Ghost Buddy AI ✨
          </h2>
        </header>

        {
          currentPage === 'Chat' ?
            <ChatComponent
              messages={messages}
              input={input}
              setInput={(e: any) => { analyzeMood(e); setInput(e) }}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              onLoadMore={loadMoreMessages}
              hasMore={hasMore}
            />
            : currentPage === 'Journal' ? <DailyJournal /> : <ComingSoon setSelectedImage={setSelectedImage} />
        }
      </div>
    </div>
  </>)

    ;
}