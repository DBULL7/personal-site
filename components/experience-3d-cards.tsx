'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { Text, RoundedBox, Float } from '@react-three/drei'
import { experiences, Experience } from '@/config/experience'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

interface CardProps {
  experience: Experience
  position: [number, number, number]
  index: number
  isSelected: boolean
  onSelect: () => void
  isDark: boolean
}

function ExperienceCard({
  experience,
  position,
  index,
  isSelected,
  onSelect,
  isDark
}: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const dateRange = experience.endDate
    ? `${experience.startDate} - ${experience.endDate}`
    : `${experience.startDate} - Present`

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      // Add subtle rotation on hover
      const targetRotationY = hovered ? 0.1 : 0
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.1
      )

      // Scale on selection
      const targetScale = isSelected ? 1.1 : hovered ? 1.05 : 1
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        targetScale,
        0.1
      )
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        targetScale,
        0.1
      )
    }
  })

  const cardColor = isDark ? '#1e293b' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#1e293b'
  const subtextColor = isDark ? '#94a3b8' : '#64748b'
  const accentColor = '#3b82f6'

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onSelect}
        >
          <RoundedBox args={[3.5, 2, 0.1]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color={cardColor}
              transparent
              opacity={0.95}
              roughness={0.5}
              metalness={0.1}
            />
          </RoundedBox>

          {/* Company name */}
          <Text
            position={[-1.4, 0.6, 0.06]}
            fontSize={0.25}
            color={textColor}
            anchorX="left"
            anchorY="middle"
            fontWeight="bold"
          >
            {experience.company}
          </Text>

          {/* Role */}
          <Text
            position={[-1.4, 0.25, 0.06]}
            fontSize={0.14}
            color={subtextColor}
            anchorX="left"
            anchorY="middle"
          >
            {experience.role}
          </Text>

          {/* Date range */}
          <Text
            position={[-1.4, -0.05, 0.06]}
            fontSize={0.11}
            color={accentColor}
            anchorX="left"
            anchorY="middle"
          >
            {experience.type.toUpperCase()} · {dateRange}
          </Text>

          {/* Tech badges */}
          {experience.technologies.slice(0, 4).map((tech, i) => (
            <group key={tech} position={[-1.4 + i * 0.75, -0.5, 0.06]}>
              <RoundedBox args={[0.7, 0.22, 0.02]} radius={0.05}>
                <meshStandardMaterial color={accentColor} opacity={0.2} transparent />
              </RoundedBox>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.08}
                color={accentColor}
                anchorX="center"
                anchorY="middle"
              >
                {tech}
              </Text>
            </group>
          ))}

          {/* Current indicator */}
          {!experience.endDate && (
            <group position={[1.4, 0.7, 0.06]}>
              <mesh>
                <circleGeometry args={[0.06, 32]} />
                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
              </mesh>
              <Text
                position={[0.15, 0, 0]}
                fontSize={0.09}
                color="#22c55e"
                anchorX="left"
                anchorY="middle"
              >
                CURRENT
              </Text>
            </group>
          )}

          {/* Glow effect on hover/selection */}
          {(hovered || isSelected) && (
            <mesh position={[0, 0, -0.05]}>
              <RoundedBox args={[3.6, 2.1, 0.05]} radius={0.1}>
                <meshStandardMaterial
                  color={accentColor}
                  transparent
                  opacity={0.3}
                  emissive={accentColor}
                  emissiveIntensity={0.5}
                />
              </RoundedBox>
            </mesh>
          )}
        </mesh>
      </group>
    </Float>
  )
}

function Scene({
  selectedIndex,
  onSelect,
  isDark
}: {
  selectedIndex: number | null
  onSelect: (index: number) => void
  isDark: boolean
}) {
  // Position cards in a staggered 3D layout
  const positions: [number, number, number][] = [
    [0, 1.2, 0], // Current role - top center
    [-2, -0.8, -0.5], // Previous role - bottom left, slightly back
    [2, -0.8, -0.5] // Oldest role - bottom right, slightly back
  ]

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Cards */}
      {experiences.map((exp, index) => (
        <ExperienceCard
          key={`${exp.company}-${exp.startDate}`}
          experience={exp}
          position={positions[index]}
          index={index}
          isSelected={selectedIndex === index}
          onSelect={() => onSelect(index)}
          isDark={isDark}
        />
      ))}
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading 3D Experience...</div>
    </div>
  )
}

export function Experience3DCards() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const selectedExperience = selectedIndex !== null ? experiences[selectedIndex] : null

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Experience
      </h2>

      {/* 3D Canvas */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-800 dark:from-slate-900 dark:to-slate-800">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Scene
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              isDark={isDark}
            />
          </Canvas>
        </Suspense>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
          Click a card to select • Hover to highlight
        </div>
      </div>

      {/* Selected experience details */}
      {selectedExperience && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {selectedExperience.company} - {selectedExperience.role}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedExperience.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedExperience.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
