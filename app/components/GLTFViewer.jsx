'use client'
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useLoader, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Grid, Html, useProgress, useGLTF, Environment } from '@react-three/drei'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

extend({ GLTFLoader })

function KhronosViewer({ url, message = "Hello there, bright soul ✨! How can I help you today!", onSignOut, onChat, isLoggedIn, isLoading, currentInputSubmit }) {
  const [modelUrl, setModelUrl] = useState(url)
  const [envMap, setEnvMap] = useState(null)
  const [validationReport, setValidationReport] = useState(null)
  const controlsRef = useRef()
  const [settings, setSettings] = useState({
    wireframe: false,
    transparency: false,
    iblIntensity: 1,
    exposure: 1
  })

  const [messagePosition, setMessagePosition] = useState([0, 3.5, 0])
  const [isMobile, setIsMobile] = useState(false)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setCameraPosition([0, 0, 7])

      // Adjust message position vertically
      setMessagePosition([0, 3.2, 0])
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="m-auto w-full h-[82vh]">

      {isLoggedIn == true && (
        <div className="m-auto w-full flex flex-row items-between justify-between px-5">
          <div onClick={onSignOut} className="bg-gray-600/50 text-white p-2 rounded-full rotate-180">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div onClick={onChat} className="bg-gray-600/50 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      )}
      <Canvas
        shadows
        camera={{
          position: cameraPosition,
          near: 0.5,
          far: 1000
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: settings.exposure
        }}
      >
        {/* Lighting setup from Khronos reference :cite[7] */}
        {/* Replace the existing lighting setup with this */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.3}
        />
        <ambientLight intensity={0.2 * settings.iblIntensity} />
        <Environment
          preset="warehouse"
          background={false}
          intensity={settings.iblIntensity}
        />


        <Suspense fallback={<Loader />}>
          <GLTFModel
            url={modelUrl}
            wireframe={settings.wireframe}
            transparent={settings.transparent}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan enableZoom enableRotate
          dampingFactor={0.05}
          minDistance={isMobile ? 8 : 6}
          maxDistance={10}
        />

        {/* Validation HUD :cite[3] */}
        {validationReport && (
          <Html position={[-0.5, 0.5, 0]}>
            <div className="hud">
              <h3>Validation Report</h3>
              <p>Errors: {validationReport.issues.numErrors}</p>
              <p>Warnings: {validationReport.issues.numWarnings}</p>
              <p>Infos: {validationReport.issues.numInfos}</p>
            </div>
          </Html>
        )}

        {/* Settings Panel :cite[1]:cite[9] */}
        {/* Message HUD positioned above model */}
        <Html
          position={messagePosition}
          center
          distanceFactor={isMobile ? 1.6 : 2} // Increased mobile distance factor
          style={{
            width: '350vw',
            maxWidth: '1300px',
            fontSize: '35pt',
            pointerEvents: 'none'
          }}
          transform
          sprite
        >
          {currentInputSubmit.trim().length > 0 && (
            <span className='text-white  italic block mb-1 md:mb-2'>
              You: {currentInputSubmit}
            </span>
          )}
          <div style={{ padding: '50px', borderRadius: '35px' }} className={`bg-gray-800/50 text-white rounded-lg m-auto backdrop-blur-sm`}>
            {isLoading || !message ? (
              <div className="animate-spin rounded-full m-auto h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 border-b-2 border-primary" />
            ) : (
              <ReactMarkdown
                components={{

                  code({ node, className, children, ...props }) {
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
                {message}
              </ReactMarkdown>
            )}
          </div>
        </Html>
      </Canvas>
    </div>
  )
}

// Enhanced GLTF Model Component with PBR features and animation :cite[7]:cite[9]
function GLTFModel({ url, wireframe, transparent }) {
  const gltf = useLoader(GLTFLoader, url)
  const { scene } = useThree()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Model centering and scaling logic
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    gltf.scene.position.sub(center)
    const scaleFactor = window.innerWidth < 768 ? 4 : 3
    setScale(scaleFactor / Math.max(size.x, size.y, size.z))

    // Apply PBR material settings
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          ...child.material,
          wireframe,
          transparent,
          side: THREE.DoubleSide,
          depthWrite: true,
          depthTest: true
        })
      }
    })

    // Play all animations if available
    if (gltf.animations && gltf.animations.length) {
      const mixer = new THREE.AnimationMixer(gltf.scene)

      // Create and play all animation actions
      gltf.animations.forEach((animation) => {
        const action = mixer.clipAction(animation)
        action.play()
      })

      // Animation update loop
      const animate = () => {
        mixer.update(0.016) // Update at ~60fps
        requestAnimationFrame(animate)
      }
      animate()
    }
  }, [gltf])

  return <primitive object={gltf.scene} scale={scale} />
}

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress}% loaded</Html>
}

export default KhronosViewer