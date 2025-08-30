import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import ThreeJSErrorBoundary from "./ThreeJSErrorBoundary";

function Coin({ texture, position, animate, target }) {
  const ref = useRef();

  useFrame(() => {
    if (animate && ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...target), 0.02); // increased from 0.005 for more prominent movement
    }
  });

  const scaleFactor = (0.1 - position[2] * 0.05) * 0.01; // Dramatically smaller scale for mobile

  return (
    <group>
      <mesh
        ref={ref}
        position={position}
        scale={[0.001, 0.001, 1]}
        rotation={[-0.02, 0, 0.1]}
      >
        <planeGeometry args={[0.001, 0.001]} />
        <meshStandardMaterial
          map={texture}
          color="#FFD700"          // classic yellow gold
          metalness={0.8}          // reduced metalness for mild appearance
          roughness={0.5}          // balanced roughness for mild shine
          envMapIntensity={0.3}    // moderate reflections
          emissive="#FFB347"       // warm yellow-gold warmth
          emissiveMap={texture}
          emissiveIntensity={0.02} // subtle glow
          transparent
          opacity={0.95}
          toneMapped
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
        position={[0.005, -0.005, -0.01]}
        animate={startAnimation}
        target={[0.008, -0.008, -0.008]}
      />
      <Coin
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
      />
      <Coin
        texture={coinTexture}
        position={[-0.005, 0.005, 0.005]}
        animate={startAnimation}
        target={[-0.008, 0.008, 0.008]}
      />
    </>
  );
};

const BInstantMobile = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStartCoinAnimation(true);
      setShowCoins(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute"
        style={{
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(41.99% 33.2% at 50% 50%, #092646 0%, rgba(9, 38, 70, 0) 100%)",
          zIndex: 0,
        }}
      />

      {/* Coins canvas container — extremely small for mobile */}
      <div
        className="absolute"
        style={{
          top: "307.63px",
          left: "318.71px",
          width: "40px",
          height: "30px",
          zIndex: 20,
        }}
      >
        <ThreeJSErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 50], fov: 15 }}
            className="w-full h-full"
            gl={{ 
              powerPreference: "low-power", 
              antialias: false, 
              alpha: true,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false
            }}
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.domElement.style.touchAction = 'none';
            }}
          >
            <Suspense fallback={null}>
              {/* Very soft global fill */}
              <ambientLight intensity={0.0056} color="#fff8dc" />

              {/* Dim warm key light */}
              <directionalLight
                position={[-6, 7, 4]}
                intensity={0.014}      // 30% lower
                color="#ffd27f"
              />

              {/* Dim helper highlight */}
              <spotLight
                position={[-2, 8, 3]}
                angle={0.5}
                penumbra={0.5}
                intensity={0.007}      // 30% lower
                distance={40}
                color="#ffebc2"
              />
              <CoinStack startAnimation={startCoinAnimation} />
            </Suspense>
          </Canvas>
        </ThreeJSErrorBoundary>
      </div>

      {/* Reveal film moving up (coins below) */}
      <motion.div
        className="absolute"
        style={{ inset: 0, background: "#000", zIndex: 15, pointerEvents: "none" }}
        initial={{ y: 0 }}
        animate={{ y: showCoins ? -100 : 0 }}
        transition={{ duration: 9.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.8 }}
      />

      {/* CSS overlay over coins — extremely small for mobile */}
      <div
        className="absolute"
        style={{
          width: "40px",
          height: "30px",
          left: "318.71px",
          top: "307.63px",
          opacity: 0,
          transform: "rotate(0deg)",
          zIndex: 25,
          pointerEvents: "none"
        }}
      />

      {/* Text overlay — positioned to match design */}
      <div className="absolute" style={{ 
        top: "clamp(280px, 25vh, 320px)", 
        left: "clamp(20px, 8vw, 60px)", 
        width: "clamp(200px, 60vw, 280px)", 
        zIndex: 30, 
        pointerEvents: "none" 
      }}>
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ lineHeight: 1.05 }}
        >
          <motion.div
            style={{ 
              color: "#FFEFD5", 
              fontSize: "clamp(24px, 5vw, 32px)", 
              fontWeight: 200, 
              fontStyle: "italic", 
              textShadow: "0 0 12px rgba(255,215,0,0.5)" 
            }}
            initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            B-Coin
          </motion.div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <motion.div
              style={{ 
                color: "#FFEFD5", 
                marginRight: 6, 
                fontSize: "clamp(24px, 5vw, 32px)", 
                fontWeight: 200, 
                fontStyle: "italic", 
                textShadow: "0 0 12px rgba(255,215,0,0.5)" 
              }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instant Value
            </motion.div>
            <motion.div
              style={{ 
                color: "#fff", 
                fontSize: "clamp(22px, 4.5vw, 30px)", 
                fontWeight: 400 
              }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              —
            </motion.div>
            <motion.div
              style={{ 
                color: "#fff", 
                marginLeft: 6, 
                fontSize: "clamp(26px, 5.5vw, 34px)", 
                fontWeight: 500, 
                textTransform: "uppercase" 
              }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              SHARED
            </motion.div>
          </div>
          <motion.div
            style={{ 
              color: "#FFEFD5", 
              fontSize: "clamp(24px, 5vw, 32px)", 
              fontWeight: 200, 
              alignSelf: "flex-end", 
              fontStyle: "italic", 
              textShadow: "0 0 12px rgba(255,215,0,0.5)" 
            }}
            initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Instantly
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BInstantMobile;


