import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Coin({ texture, position, animate, target }) {
  const ref = useRef();
  const materialRef = useRef();
  // animate opacity separately
  const [opacity, setOpacity] = useState(0);
  
  useFrame(() => {
    if (animate && ref.current) {
      // Slower coin movement - reduced from 0.02 to 0.008
      ref.current.position.lerp(new THREE.Vector3(...target), 0.008);

      // Slower opacity fade - reduced from 0.02 to 0.008
      if (materialRef.current) {
        materialRef.current.opacity = THREE.MathUtils.lerp(
          materialRef.current.opacity,
          1,
          0.008
        );
      }
    }
  });

  // Compensation: farther coins scaled up, closer coins scaled down
  const scaleFactor = 1.5 - position[2] * 0.3;

  return (
    <mesh
      ref={ref}
      position={position}
      scale={[scaleFactor, scaleFactor, 1]}
      rotation={[-0.4, 0, 0]} // 🔹 tilt ~23°
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0} // start invisible
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
        texture={coinTexture}
        position={[0.3, -0.3, -0.3]}
        animate={startAnimation}
        target={[0.5, -0.5, -0.5]}
      />

      {/* Middle coin */}
      <Coin
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
      />

      {/* Top coin */}
      <Coin
        texture={coinTexture}
        position={[-0.3, 0.3, 0.3]}
        animate={startAnimation}
        target={[-0.5, 0.5, 0.5]}
      />
    </>
  );
};

const BInstantSection = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
            style={{
          background:
            "radial-gradient(41.99% 33.2% at 50% 50%, #092646 28.37%, rgba(9, 38, 70, 0) 100%)",
        }}
      />

      {/* THREE.JS CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="w-full h-full relative z-10"
      >
        <Suspense fallback={null}>
          <ambientLight />
          <CoinStack startAnimation={startCoinAnimation} />
        </Suspense>
      </Canvas>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          className="flex flex-col items-start leading-tight text-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 2.5, // Increased from 1.2 to 2.5 seconds
            ease: "easeOut",
            delay: 0.3 // Added small delay before text starts
          }}
          onAnimationComplete={() => setStartCoinAnimation(true)} // 👈 start coins when text finishes
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
                style={{
                fontSize: "84px",
                  fontWeight: 500,
                }}
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


