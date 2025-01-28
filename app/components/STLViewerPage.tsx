// pages/stl-viewer.js
import React from 'react';
import { Button } from '@/components/ui/button'
import DynamicGLTFViewer from '../components/DynamicGLTFViewer';
import { redirect } from 'next/dist/server/api-utils';

export default function STLViewerPage({ input, setInput, isLoading, handleSubmit, isLoggedIn, message, onSignOut, onChat }: any) {
    const stlFileUrl = '/GHOST.glb'; // Replace with the path to your STL file

    return (
        <div className='flex flex-col items-between justify-between h-full'>
            <DynamicGLTFViewer url={stlFileUrl} message={message?.message} onSignOut={onSignOut} onChat={onChat} isLoggedIn={isLoggedIn} isLoading={isLoading} />
            <div className="border-t border-border p-4 backdrop-blur-sm">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl mx-auto relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "Waiting for response..." : "Type a message to Ghost buddy..."}
                        disabled={isLoading}
                        className="w-full p-4 pr-20 rounded-lg bg-background/50 backdrop-blur-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring text-md disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => { if (!isLoggedIn) { window.location.href = '/login' } }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}