"use client";

import { useState, useLayoutEffect } from "react";
import { Menu, MessageSquare, Plus, PowerIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sentiment from "sentiment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getChatTitleSummary, getCurrentChat, getUserByEmail, logConversation, signOutUser, getSummary } from "./firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateResponse } from "@/lib/huggingface";
import ChatComponent from "./components/ChatComponent";
import DailyJournal from "./components/DailyJournal";
import { redirect } from 'next/navigation'
import ComingSoon from "./components/ComingSoon";

interface Message {
  role: "user" | "Ghost AI";
  date: Date;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<{}>({});
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBg, setCurrentBg] = useState(1)
  const [currentPage, setCurrentPage] = useState('Chat')
  const [user, loading, error] = useAuthState(auth);
  const [currentChatID, setCurrentChatID] = useState('')

  useLayoutEffect(() => {
    if (!loading) {
      if (!user) {
        redirect('/login')
      }
      else {
        getUserByEmail(user?.email).then((snapshot) => {
          const res = snapshot.val()
          getChatTitleSummary(Object.keys(res)[0]).then((data) => {
            const summary = data.val()

            setAllMessages(summary)
          })
        });
        const checkMobile = () => {
          setIsMobile(window.innerWidth < 768);
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        };


        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
      }
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", date: new Date(), content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    if (isMobile) setIsSidebarOpen(false);

    setIsLoading(true);
    try {
      const response = await generateResponse(input, user?.email);
      const assistantMessage: Message = {
        role: "Ghost AI",
        date: new Date(),
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);

      getUserByEmail(user?.email).then((snapshot) => {
        const res = snapshot.val()
        const data = {
          ID: Object.keys(res)[0],
          log: [userMessage, assistantMessage]
        }
        const newID = new Date().toString()
        logConversation(data, currentChatID.length > 0 ? currentChatID : newID).then(() => {
          setCurrentChatID(currentChatID.length > 0 ? currentChatID : newID)
          setCurrentChat(currentChatID.length > 0 ? currentChatID : newID);
        })
      })


    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "Ghost AI",
        date: new Date(),
        content: "I apologize, but I'm having trouble generating a response right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
      getUserByEmail(user?.email).then((snapshot) => {
        const res = snapshot.val()
        const data = {
          ID: Object.keys(res)[0],
          log: [userMessage, errorMessage]
        }
        const newID = new Date().toString()
        logConversation(data, currentChatID.length > 0 ? currentChatID : newID).then(() => {
          setCurrentChatID(currentChatID.length > 0 ? currentChatID : newID)
          setCurrentChat(currentChatID.length > 0 ? currentChatID : newID);
        })
      })
    } finally {
      setIsLoading(false);
    }
    getUserByEmail(user?.email).then((snapshot) => {
      const res = snapshot.val()
      getChatTitleSummary(Object.keys(res)[0]).then((data) => {
        const summary = data.val()
        setAllMessages(summary)
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
          setMessages(Object.values(summary).flat())
        } else
          setMessages([])
      })

    })
  }

  const initializeChat = () => {
    setMessages([]);
    setCurrentChatID('')
  }

  const signOut = () => {
    document.cookie = "isLoggedIn=false; path=/; max-age=3600; secure; samesite=strict";
    signOutUser()
    redirect('/login')
  }



  return (user && (<>
    <div className={`app-background fade-in-image bg-${currentBg}`} />
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
          "h-full w-80 flex flex-col p-4",
          !isSidebarOpen && "invisible"
        )}>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={
                initializeChat
              }
            >
              <Plus size={16} />
              New Chat
            </Button>
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

          <ScrollArea className="flex-1 -mx-4 px-4">
            {allMessages && Object.keys(allMessages).length > 0 && (
              <div className="space-y-2">
                {Object.keys(allMessages).map((m, index) => (
                  <Button
                    key={m}
                    variant="ghost"
                    onClick={() => {
                      setCurrentChatID(m);
                      setCurrentChat(m)
                    }}
                    className="w-full justify-start gap-2 text-sm"
                  >
                    <MessageSquare size={16} />
                    <span className="truncate">Chat # {index + 1}</span>
                  </Button>
                )
                )}
              </div>
            )}
          </ScrollArea>

          <Separator className="my-4" />
          <Button onClick={signOut} variant="ghost" className="justify-start gap-2">
            <PowerIcon size={16} />
            Log out <span className="text-xs text-gray-700"> ({user.email})</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          <Select onValueChange={(value: any) => setCurrentPage(value)} defaultValue="Chat">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chat History" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chat">Chat 💬</SelectItem>
              <SelectItem value="Journal">Daily Journal 📖</SelectItem>
              <SelectItem value="Dreamscape">Dreamscape ✨</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {
          currentPage === 'Chat' ?
            <ChatComponent messages={messages} input={input} setInput={(e: any) => { analyzeMood(e); setInput(e) }} isLoading={isLoading} handleSubmit={handleSubmit} />
            : currentPage === 'Journal' ? <DailyJournal /> : <ComingSoon />
        }
      </div>
    </div>
  </>))

    ;
}