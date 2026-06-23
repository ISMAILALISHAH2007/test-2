'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface OrbProps {
  sentiment?: 'positive' | 'neutral' | 'negative'
  isListening?: boolean
}

function AnimatedOrb({ sentiment = 'neutral', isListening = false }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  // Sentiment-based colors
  const sentimentColors = {
    positive: '#4ade80', // green
    neutral: '#60a5fa', // blue
    negative: '#ef4444', // red
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.005

      if (isListening && materialRef.current) {
        materialRef.current.distort = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        ref={materialRef}
        color={sentimentColors[sentiment]}
        emissive={sentimentColors[sentiment]}
        emissiveIntensity={0.5}
        distort={0.3}
        speed={2}
        roughness={0.4}
        metalness={0.6}
      />
    </Sphere>
  )
}

export function OrbVisualization({ sentiment = 'neutral', isListening = false }: OrbProps) {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden glass-effect">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <AnimatedOrb sentiment={sentiment} isListening={isListening} />
        <Environment preset="night" />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color={sentimentColors[sentiment]} />
      </Canvas>
    </div>
  )
}

const sentimentColors: Record<string, string> = {
  positive: '#4ade80',
  neutral: '#60a5fa',
  negative: '#ef4444',
}
