import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Coin({ texture, position, animate, target, opacity = 0.97 }) {
  const ref = useRef();

  useFrame(() => {
    if (animate && ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...target), 0.005);
    }
  });

  const scaleFactor = 1.9 - position[2] * 0.3;

  return (
    <group>
      {/* Main coin face */}
      <mesh
        ref={ref}
        position={position}
        scale={[scaleFactor, scaleFactor, 1]}
        rotation={[-0.02, 0, 0.0999]}
      >
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
        />
      </mesh>


    </group>
  );
}


const CoinStack = ({ startAnimation }) => {
  const coinTexture = useTexture("/b-coin.svg");

  return (
    <>
      <Coin
        texture={coinTexture}
        position={[0.4, -0.4, -0.4]}
        animate={startAnimation}
        target={[0.63, -0.63, -0.63]}
        opacity={1.0}
      />
      <Coin
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
        opacity={1.0}
      />
      <Coin
        texture={coinTexture}
        position={[-0.3, 0.4, 0.4]}
        animate={startAnimation}
        target={[-0.6, 0.6, 0.6]}
        opacity={0.97}
      />
    </>
  );
};

const BInstantSection = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setStartCoinAnimation(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Removed background glow to avoid dark oval */}

      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(41.99% 33.2% at 50% 50%, #092646 0%, rgba(9, 38, 70, 0) 100%)",
          zIndex: 10,
          pointerEvents: "none"
        }}
      />

      {/* THREE.JS CANVAS */}
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        className="w-full h-full relative z-20"
        gl={{
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
      >
        <Suspense fallback={null}>
          {/* No ambient light */}
          <ambientLight intensity={0} color="#fff8dc" /> 

          {/* Key light with warm golden tint */}
          <directionalLight
            position={[-6, 7, 4]}
            intensity={0.45}      // reduced
            color="#ffd27f"       // warm yellow-gold
            castShadow
          />

          {/* Soft helper light for highlights */}
          <spotLight
            position={[-2, 8, 3]}
            angle={0.5}
            penumbra={0.5}
            intensity={0.12}      // reduced
            distance={40}
            color="#ffebc2"       // warm cream-white
          />
          {/* Environment reflections */}
          <Environment preset="studio" />
          <CoinStack startAnimation={startCoinAnimation} />
        </Suspense>
      </Canvas>

      {/* Transparent black film over coins */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 25,
          pointerEvents: "none"
        }}
      />

      {/* Dark transparent film (optional, can remove if too dark) */}
      {/* Removed dark film overlay to keep coins bright */}

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          className="flex flex-col items-start leading-tight text-center"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginTop: "clamp(2rem, 8vh, 6rem)" }}
        >
          <motion.span
            className="text-amber-50 italic bc-bcoin"
            style={{
              fontWeight: 200,
              fontSize: "clamp(26px, 5.2vw, 96px)",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
            initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            B-Coin
          </motion.span>
          <div className="flex items-baseline">
            <motion.span
              className="mr-2 text-amber-50 italic bc-instant"
              style={{
                fontWeight: 200,
                fontSize: "clamp(26px, 5.2vw, 96px)",
                textShadow: "0 0 20px rgba(255,215,0,0.5)",
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instant Value
            </motion.span>
            <motion.span
              className="text-white bc-dash"
              style={{ fontSize: "clamp(24px, 4.8vw, 90px)", fontWeight: 400 }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              —
            </motion.span>
            <motion.span
              className="ml-2 shared-word text-white uppercase bc-shared"
              style={{ fontSize: "clamp(28px, 5.8vw, 88px)", fontWeight: 500 }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              SHARED
            </motion.span>
          </div>
          <motion.span
            className="self-end text-amber-50 italic bc-instantly"
            style={{
              fontWeight: 200,
              fontSize: "clamp(26px, 5.2vw, 96px)",
              textShadow: "0 0 20px rgba(255,215,0,0.5)",
            }}
            initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Instantly
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default BInstantSection;
