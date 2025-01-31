// pages/stl-viewer.js
import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import DynamicGLTFViewer from '../components/DynamicGLTFViewer';

export default function STLViewerPage({ input, setInput, isLoading, handleSubmit, isLoggedIn, message, onSignOut, onChat, latestMessage }: any) {
    const stlFileUrl = '/GHOST.glb'; // Replace with the path to your STL file
    const [currentInput, setCurrentInput] = useState(latestMessage?.message)
    const [pastInput, setPastInput] = useState('');

    return (
        <div className='flex flex-col items-between justify-between h-full'>
            <DynamicGLTFViewer currentInputSubmit={pastInput} url={stlFileUrl} message={message?.message} onSignOut={onSignOut} onChat={onChat} isLoggedIn={isLoggedIn} isLoading={isLoading} />
            <div className="p-4">
                <form
                    onSubmit={(e) => { setPastInput(currentInput); handleSubmit(e) }}
                    className="max-w-3xl mx-auto relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => { setCurrentInput(e.target.value); setInput(e.target.value) }}
                        placeholder={isLoading ? "Waiting for response..." : "Type a message to Ghost buddy..."}
                        disabled={isLoading}
                        className="w-full p-4 pr-20 opacity-30 rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none text-md disabled:opacity-80"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => { if (!isLoggedIn) { window.location.href = '/login' } }}
                        className="bg-neutral-600 absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}