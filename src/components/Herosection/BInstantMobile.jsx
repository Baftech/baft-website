import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Coin({ texture, position, animate, target }) {
  const ref = useRef();

  useFrame(() => {
    if (animate && ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...target), 0.02); // increased from 0.005 for more prominent movement
    }
  });

  const scaleFactor = 1.6 - position[2] * 0.25;

  return (
    <group>
      <mesh
        ref={ref}
        position={position}
        scale={[scaleFactor, scaleFactor, 1]}
        rotation={[-0.02, 0, 0.1]}
      >
        <planeGeometry args={[2, 2]} />
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
        position={[0.35, -0.35, -0.4]}
        animate={startAnimation}
        target={[0.55, -0.55, -0.55]}
      />
      <Coin
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
      />
      <Coin
        texture={coinTexture}
        position={[-0.28, 0.35, 0.35]}
        animate={startAnimation}
        target={[-0.5, 0.55, 0.55]}
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

      {/* Coins canvas container — sized/positioned to iPhone 13 mini specs */}
      <div
        className="absolute"
        style={{
          top: 308,
          left: 30,
          width: 316.5,
          height: 239.35,
          zIndex: 20,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          className="w-full h-full"
          gl={{ powerPreference: "low-power", antialias: false, alpha: true }}
          dpr={[1, 1.5]}
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
      </div>

      {/* Reveal film moving up (coins below) */}
      <motion.div
        className="absolute"
        style={{ inset: 0, background: "#000", zIndex: 15, pointerEvents: "none" }}
        initial={{ y: 0 }}
        animate={{ y: showCoins ? -100 : 0 }}
        transition={{ duration: 9.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.8 }}
      />

      {/* CSS overlay over coins */}
      <div
        className="absolute"
        style={{
          width: "328.7px",
          height: "225.01px",
          left: "594px",
          top: "424px",
          opacity: 0.27,
          transform: "rotate(-5.05deg)",
          zIndex: 25,
          pointerEvents: "none"
        }}
      />

      {/* Text overlay — positioned as per provided specs */}
      <div className="absolute" style={{ top: 355, left: 32, width: 313, zIndex: 30, pointerEvents: "none" }}>
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ lineHeight: 1.05 }}
        >
          <motion.div
            style={{ color: "#FFEFD5", fontSize: 28, fontWeight: 200, fontStyle: "italic", textShadow: "0 0 12px rgba(255,215,0,0.5)" }}
            initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            B-Coin
          </motion.div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <motion.div
              style={{ color: "#FFEFD5", marginRight: 6, fontSize: 28, fontWeight: 200, fontStyle: "italic", textShadow: "0 0 12px rgba(255,215,0,0.5)" }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instant Value
            </motion.div>
            <motion.div
              style={{ color: "#fff", fontSize: 26, fontWeight: 400 }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              —
            </motion.div>
            <motion.div
              style={{ color: "#fff", marginLeft: 6, fontSize: 30, fontWeight: 500, textTransform: "uppercase" }}
              initial={{ scaleX: 0.94, scaleY: 0.92, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
            >
              SHARED
            </motion.div>
          </div>
          <motion.div
            style={{ color: "#FFEFD5", fontSize: 28, fontWeight: 200, alignSelf: "flex-end", fontStyle: "italic", textShadow: "0 0 12px rgba(255,215,0,0.5)" }}
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


