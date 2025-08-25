import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Coin({ texture, position, animate, target }) {
  const ref = useRef();
  
  useFrame(() => {
    if (animate && ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...target), 0.005); // Further reduced for slower, subtler movement
    }
    
  });

  // Compensation: farther coins scaled up, closer coins scaled down
  const scaleFactor = 1.9 - position[2] * 0.3;

  return (
    <mesh
      ref={ref}
      position={position}
      scale={[scaleFactor, scaleFactor, 1]}
      rotation={[0, 0, 0]} // 🔹 tilt ~23°
    >
      <planeGeometry args={[2, 2]} />

        <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

const CoinStack = ({ startAnimation }) => {
  const coinTexture = useTexture("/b-coin.svg");

  return (
    <>
      {/* Bottom coin */}
      <Coin
        opacity={1}
        texture={coinTexture}
        position={[0.4, -0.4, -0.4]}
        animate={startAnimation}
        target={[0.65, -0.65, -0.65]}
      />



      {/* Middle coin */}
      <Coin
        opacity={1}
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
        
      />

      {/* Top coin */}
      <Coin
        opacity={1}
        texture={coinTexture}
        position={[-0.4, 0.4, 0.4]}
        animate={startAnimation}
        target={[-0.65, 0.65, 0.65]}
      />
    </>
  );
};

const BInstantSection = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false); // Changed to false initially
  const [showCoins, setShowCoins] = useState(false); // New state to control coin visibility

  // Start coin animation after 800ms delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStartCoinAnimation(true);
      setShowCoins(true); // Show coins after 800ms
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(41.99% 33.2% at 50% 50%, #092646 0%, rgba(9, 38, 70, 0) 100%)",
        }}
      />

      {/* THREE.JS CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        className="w-full h-full relative z-20"
      >
        <Suspense fallback={null}>
          <ambientLight />
          <CoinStack startAnimation={startCoinAnimation} />
        </Suspense>
      </Canvas>

      {/* 🔹 Black film that covers coins initially and moves up to reveal them */}
      <motion.div
        className="absolute inset-0 z-15 pointer-events-none bg-black"
        initial={{ y: 0 }}
        animate={{ y: showCoins ? -100 : 0 }}
        transition={{ 
          duration: 9.5, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.8 // Start moving after 800ms
        }}
      />

      {/* 🔹 Dark transparent film (above coins, below text) */}
      <div
        className="absolute inset-0 z-25 pointer-events-none"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          className="flex flex-col items-start leading-tight text-center"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 3.5, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        >
          <span
            className="text-amber-50 italic"
            style={{
              fontWeight: 200,
              fontSize: "75px",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
          >
            B-Coin
          </span>
          <div className="flex items-baseline">
            <span
              className="mr-2 text-amber-50 italic"
              style={{
                fontWeight: 200,
                fontSize: "75px",
                textShadow: "0 0 20px rgba(255,215,0,0.5)",
              }}
            >
              Instant Value
            </span>
            <span
              className="text-white"
              style={{ fontSize: "75px", fontWeight: 400 }}
            >
              —
            </span>
            <span
              className="ml-2 shared-word text-white uppercase"
              style={{ fontSize: "84px", fontWeight: 500 }}
            >
              SHARED
            </span>
          </div>
          <span
            className="self-end text-amber-50 italic"
            style={{
              fontWeight: 200,
              fontSize: "75px",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
          >
            Instantly
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default BInstantSection;


