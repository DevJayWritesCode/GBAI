'use client'
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useLoader, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Grid, Html, useProgress, useGLTF, Environment } from '@react-three/drei'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

extend({ GLTFLoader })

function KhronosViewer() {
  const [modelUrl, setModelUrl] = useState('/GHOST.glb')
  const [envMap, setEnvMap] = useState(null)
  const [validationReport, setValidationReport] = useState(null)
  const controlsRef = useRef()
  const [settings, setSettings] = useState({
    wireframe: false,
    transparency: false,
    iblIntensity: 1,
    exposure: 1
  })

  // Model validation handler :cite[3]:cite[10]
  const validateModel = async (url) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
  }

  // Drag & drop handling :cite[1]:cite[9]
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file.name.endsWith('.hdr')) {
      const reader = new FileReader()
      reader.onload = () => setEnvMap(reader.result)
      reader.readAsDataURL(file)
    } else if (file.name.match(/\.(gltf|glb)$/)) {
      const url = URL.createObjectURL(file)
      validateModel(url)
      setModelUrl(url)
    }
  }

  return (
    <div 
      style={{ height: '100vh', width: '100%' }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Canvas
        shadows
        camera={{ near: 0.1, far: 1000 }}
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
        setScale(5 / Math.max(size.x, size.y, size.z))

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

        // Play animation if available
        if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[0])
            action.play()

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