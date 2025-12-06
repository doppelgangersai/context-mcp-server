"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface BinaryDigitProps {
  position: [number, number, number];
  digit: string;
  delay: number;
  animationProgress: number;
  angle: number;
}

function BinaryDigit({ position, digit, delay, animationProgress, angle }: BinaryDigitProps) {
  const textRef = useRef<THREE.Object3D>(null);

  // Calculate glow based on animation progress and position
  const glowIntensity = useMemo(() => {
    const normalizedDelay = delay / 8;
    const progress = Math.max(0, animationProgress - normalizedDelay);
    return Math.min(1, progress * 2);
  }, [animationProgress, delay]);

  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.elapsedTime;
      // More dramatic floating animation
      textRef.current.position.y = position[1] + Math.sin(time * 0.8 + delay) * 0.08;

      // Pulse effect
      const scale = 1 + Math.sin(time * 2 + delay) * 0.15 * glowIntensity;
      textRef.current.scale.set(scale, scale, scale);
    }
  });

  // Vibrant color gradient based on position and digit
  const color = useMemo(() => {
    const hue = digit === "1"
      ? (angle * 360 + delay * 60) % 360  // Rotating rainbow for 1s
      : (angle * 360 + delay * 60 + 180) % 360; // Complementary colors for 0s

    const saturation = 0.7 + glowIntensity * 0.3;
    const lightness = 0.3 + glowIntensity * 0.5;

    return new THREE.Color().setHSL(hue / 360, saturation, lightness);
  }, [glowIntensity, digit, angle, delay]);

  const emissiveIntensity = 1 + glowIntensity * 4;

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.25}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#000000"
    >
      {digit}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </Text>
  );
}

function RotatingSphere({ animationProgress }: { animationProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);

  // Generate binary digits in latitude-like circles
  const digits = useMemo(() => {
    // Simple seeded pseudo-random number generator
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    const digitsArray: Array<{
      position: [number, number, number];
      digit: string;
      delay: number;
      angle: number;
    }> = [];

    const radius = 5; // Much larger radius
    const latitudes = 24; // More latitude lines for density
    let seedIndex = 0;

    for (let lat = 0; lat < latitudes; lat++) {
      const theta = (lat / (latitudes - 1)) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      // Dense ring of digits
      const digitsInLat = Math.max(12, Math.floor(48 * sinTheta));

      for (let lon = 0; lon < digitsInLat; lon++) {
        const phi = (lon / digitsInLat) * Math.PI * 2;

        const x = radius * sinTheta * Math.cos(phi);
        const y = radius * cosTheta;
        const z = radius * sinTheta * Math.sin(phi);

        // Wave pattern delay - spiraling effect
        const normalizedLat = lat / latitudes;
        const normalizedLon = lon / digitsInLat;
        const delay = (normalizedLat * 5 + normalizedLon * 3) % 8;

        digitsArray.push({
          position: [x, y, z],
          digit: seededRandom(seedIndex++) > 0.5 ? "1" : "0",
          delay,
          angle: normalizedLon,
        });
      }
    }

    return digitsArray;
  }, []);

  // Dynamic rotation with multiple axes
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }

    // Pulsing inner sphere
    if (innerSphereRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      innerSphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      {/* Inner glowing core */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#5800C3"
          emissive="#5800C3"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glowing aura */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#C2C4F9"
          emissive="#C2C4F9"
          emissiveIntensity={0.4}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <group ref={groupRef}>
        {digits.map((digit, index) => (
          <BinaryDigit
            key={index}
            position={digit.position}
            digit={digit.digit}
            delay={digit.delay}
            angle={digit.angle}
            animationProgress={animationProgress}
          />
        ))}
      </group>

      {/* Sparkle particles for extra magic */}
      <Sparkles
        count={100}
        scale={8}
        size={3}
        speed={0.3}
        opacity={0.6}
        color="#C2C4F9"
      />
      <Sparkles
        count={50}
        scale={10}
        size={4}
        speed={0.2}
        opacity={0.4}
        color="#00ffff"
      />
    </>
  );
}

export function BinarySphere() {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds for dramatic illumination

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 7],  // Closer camera
          fov: 75,  // Wider field of view
          near: 0.1,
          far: 1000
        }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#000000"]} />

        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />

        {/* Key lights with colors */}
        <pointLight position={[10, 10, 5]} intensity={2} color="#00ffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#5800C3" />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[10, -5, 10]} intensity={1.5} color="#00ff88" />

        {/* Directional light for drama */}
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

        {/* The rotating binary sphere */}
        <RotatingSphere animationProgress={animationProgress} />

        {/* Atmospheric fog */}
        <fog attach="fog" args={["#000000", 8, 25]} />
      </Canvas>

      {/* Glow overlay effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
    </div>
  );
}

