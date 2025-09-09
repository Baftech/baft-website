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
  const [textScale, setTextScale] = useState(1);

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

  // Prevent text from cutting off on small screens by scaling the fixed-size block
  useEffect(() => {
    const updateScale = () => {
      try {
        const vw = window.innerWidth || 375;
        const baseWidth = 380; // design width of the text block
        const scale = Math.min((vw * 0.94) / baseWidth, 1);
        setTextScale(scale);
      } catch (_) {}
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
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

      {/* Text overlay — robustly centered in viewport */}
      <div className="absolute inset-0" style={{ zIndex: 30, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(calc(-50% + 8px), -50%)",
            width: "380px",
            height: "120px",
          }}
        >
          <motion.div style={{ position: "relative", width: "100%", height: "100%", transform: `scale(${textScale})`, transformOrigin: "center center" }}>
          {/* Left Chunk - B-Coin + Instant Value */}
          <motion.div
            style={{ position: "relative" }}
            initial={{ y: 120, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          >
            {/* B-Coin */}
            <div
              style={{ 
                position: "absolute",
                width: "100px",
                height: "36px",
                left: "3.41px",
                top: "0px",
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
                fontWeight: 200,
                fontSize: "32px",
                lineHeight: "116.36%",
                color: "#FFFFFF"
              }}
            >
              B-Coin
            </div>
            
            {/* Instant Value */}
            <div
              style={{ 
                position: "absolute",
                width: "180px",
                height: "36px",
                left: "-1px",
                top: "30.04px",
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
                fontWeight: 200,
                fontSize: "32px",
                lineHeight: "116.36%",
                textAlign: "center",
                color: "#FFFFFF"
              }}
            >
              Instant Value
            </div>
            
            {/* Dash Separator */}
            <div
              style={{ 
                position: "absolute",
                width: "10.92257308959961px",
                height: "0px",
                top: "45.74px",
                left: "185px",
                border: "1.54px solid #FFFFFF",
                opacity: 1
              }}
            />
          </motion.div>
          
          {/* Right Chunk - SHARED + Instantly */}
          <motion.div
            style={{ position: "relative" }}
            initial={{ y: 120, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          >
            {/* Shared */}
            <div
              style={{ 
                position: "absolute",
                width: "140px",
                height: "40px",
                left: "200px",
                top: "28.33px",
                fontFamily: "EB Garamond, serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "36px",
                lineHeight: "116.36%",
                textAlign: "right",
                textTransform: "uppercase",
                color: "#FFFFFF",
                textShadow: "0px 0px 11.6052px rgba(255, 255, 255, 0.25)"
              }}
            >
              SHARED
            </div>
            
            {/* Instantly */}
            <div
              style={{ 
                position: "absolute",
                width: "120px",
                height: "36px",
                left: "220px",
                top: "61.78px",
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
                fontWeight: 200,
                fontSize: "32px",
                lineHeight: "116.36%",
                textAlign: "right",
                color: "#FFFFFF"
              }}
            >
              Instantly
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BInstantMobile;