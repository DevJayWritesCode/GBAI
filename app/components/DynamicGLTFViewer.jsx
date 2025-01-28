'use client'
import dynamic from 'next/dynamic'

const GLTFViewer = dynamic(() => import('./GLTFViewer'), {
  ssr: false,
  loading: () => <div style={{ padding: 20 }}>Loading viewer...</div>
})

export default function DynamicGLTFViewer({ url, message, onSignOut, onChat, isLoggedIn, isLoading }) {
  return <GLTFViewer url={url} message={message} onSignOut={onSignOut} onChat={onChat} isLoggedIn={isLoggedIn} isLoading={isLoading} />
}