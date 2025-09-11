import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import ThreeJSErrorBoundary from "./ThreeJSErrorBoundary";
import { B_COIN_SVG } from "../../assets/assets";

function Coin({ texture, position, animate, target, opacity = 0.97 }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      // Initialize base scale
      const base = (1.6 - position[2] * 0.2);
      ref.current.scale.set(base, base, 1);
      ref.current.userData.extraScale = 1;
    }
  }, [position]);

  useFrame(() => {
    if (!ref.current) return;
    if (animate) {
      // Move toward target even more slowly for a longer expansion
      ref.current.position.lerp(new THREE.Vector3(...target), 0.014);
      // Add a gentle scale-up effect on expand
      const base = (1.6 - position[2] * 0.2);
      const current = ref.current.userData.extraScale ?? 1;
      const targetScale = 1.12; // up to +12%
      const next = current + (targetScale - current) * 0.014;
      ref.current.userData.extraScale = next;
      const s = base * next;
      ref.current.scale.set(s, s, 1);
    }
  });

  const scaleFactor = (1.6 - position[2] * 0.2); // Slightly smaller base scale

  return (
    <group>
      {/* Main coin face */}
      <mesh
        ref={ref}
        position={position}
        rotation={[-0.02, 0, 0.0999]}
      >
        <planeGeometry args={[1.6, 1.6]} />
        <meshStandardMaterial
          map={texture}
          color="#E5E5E5"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1.0}
          transparent
          opacity={opacity * 1}
        />
      </mesh>
    </group>
  );
}

const CoinStack = ({ startAnimation }) => {
  const coinTexture = useTexture(B_COIN_SVG);

  // Add error handling for texture loading
  if (!coinTexture) {
    console.log("Coin texture not loaded yet");
    return null;
  }

  return (
    <>
      <Coin
        texture={coinTexture}
        position={[0.3, -0.4, -0.3]}
        animate={startAnimation}
        target={[0.46, -0.46, -0.46]}
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
        position={[-0.3, 0.4, 0.3]}
        animate={startAnimation}
        target={[-0.46, 0.46, 0.46]}
        opacity={0.95}
      />
    </>
  );
};

const BInstantMobile = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartCoinAnimation(true);
      setShowCoins(true);
    }, 100); // small defer to ensure WebGL context is ready
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    if (!window.__loggedBInstantMobile) {
      window.__loggedBInstantMobile = true;
      console.log("startCoinAnimation:", startCoinAnimation);
      console.log("showCoins:", showCoins);
    }
  }, [startCoinAnimation, showCoins]);

  

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
      {/* Glow overlay removed - clean black background */}

      {/* Coins canvas — no container constraints */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
        }}
      >
        <ThreeJSErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 45 }}
            style={{ width: "800px", height: "600px" }}
            gl={{ 
              powerPreference: "low-power",
              antialias: false,
              alpha: false,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
              stencil: false,
              depth: true
            }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              {/* Brighter lighting for better visibility */}
              <ambientLight intensity={0.8} color="#ffffff" />
              <directionalLight position={[1, 2, 1]} intensity={0.7} color="#ffffff" />
              
              <CoinStack startAnimation={startCoinAnimation} />
            </Suspense>
          </Canvas>
        </ThreeJSErrorBoundary>
      </div>

      {/* Black overlay removed - no more container structure */}

      {/* CSS overlay removed - no more box constraints */}

      {/* Text overlay — same as desktop section */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 30, pointerEvents: "none" }}>
        <motion.div
          className="flex flex-col items-start leading-tight text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ 
            marginTop: "clamp(2rem, 8vh, 6rem)",
            width: "100%",
            maxWidth: "min(92vw, 420px)",
            paddingLeft: "12px",
            paddingRight: "12px"
          }}
        >
          <motion.span
            className="text-amber-50 italic bc-bcoin"
            style={{
              fontWeight: 200,
              fontSize: "clamp(26px, 7.5vw, 48px)",
              textShadow: "0 0 25px rgba(255,215,0,0.6)",
              letterSpacing: "-0.01em",
              lineHeight: 1
            }}
            initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            B-Coin
          </motion.span>
          <div className="flex items-baseline">
            <motion.span
              className="mr-2 text-amber-50 italic bc-instant"
              style={{
                fontWeight: 200,
                fontSize: "clamp(26px, 7.5vw, 48px)",
                textShadow: "0 0 25px rgba(255,215,0,0.6)",
                letterSpacing: "-0.01em",
                lineHeight: 1
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instant Value
            </motion.span>
            <motion.span
              className="text-white bc-dash"
              style={{ fontSize: "clamp(24px, 7vw, 44px)", fontWeight: 400, lineHeight: 1 }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              —
            </motion.span>
            <motion.span
              className="ml-2 shared-word text-white uppercase bc-shared"
              style={{
                fontSize: "clamp(26px, 7.5vw, 48px)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                lineHeight: 1
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              SHARED
            </motion.span>
          </div>
          <div className="w-full text-right" style={{ marginTop: "4px", transform: "translateX(-0.5cm)" }}>
            <motion.span
              className="text-amber-50 italic bc-instantly"
              style={{
                fontWeight: 200,
                fontSize: "clamp(26px, 7.5vw, 48px)",
                textShadow: "0 0 25px rgba(255,215,0,0.6)",
                letterSpacing: "-0.01em",
                lineHeight: 1
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instantly
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BInstantMobile;