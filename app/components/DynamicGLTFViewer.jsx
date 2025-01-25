'use client'
import dynamic from 'next/dynamic'

const GLTFViewer = dynamic(() => import('./GLTFViewer'), {
  ssr: false,
  loading: () => <div style={{ padding: 20 }}>Loading viewer...</div>
})

export default function DynamicGLTFViewer({ url }) {
  return <GLTFViewer url={url} />
}