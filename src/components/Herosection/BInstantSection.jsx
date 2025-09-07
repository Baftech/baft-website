import React, { Suspense, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ThreeJSErrorBoundary from "./ThreeJSErrorBoundary";
import BInstantMobile from "./BInstantMobile";

function Coin({ texture, position, animate, target, opacity = 0.97, animationDuration = 3.5 }) {
  const ref = useRef();
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useFrame((state) => {
    if (animate && ref.current && !hasReachedTarget) {
      if (!animationStartTime) {
        setAnimationStartTime(state.clock.elapsedTime);
      }

      const currentTime = state.clock.elapsedTime;
      const elapsed = currentTime - animationStartTime;

      if (elapsed < 0.4) {
        return;
      }

      if (elapsed >= 0.4 && !isVisible) {
        setIsVisible(true);
      }

      if (elapsed >= 0.4) {
        const currentPos = ref.current.position;
        const targetPos = new THREE.Vector3(...target);

        const distance = currentPos.distanceTo(targetPos);
        if (distance < 0.01) {
          setHasReachedTarget(true);
          return;
        }

        const progress = (elapsed - 0.4) / (animationDuration - 0.4);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        currentPos.lerp(targetPos, easedProgress * 0.02);
      }

      if (elapsed >= animationDuration) {
        setHasReachedTarget(true);
        return;
      }
    }
  });

  const scaleFactor = 2.2 - position[2] * 0.3;

  return (
    <group>
      {/* Main coin face */}
      <mesh
        ref={ref}
        position={position}
        scale={[scaleFactor, scaleFactor, 1]}
        rotation={[-0.02, 0, 0.0999]}
        visible={isVisible}
      >
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          depthWrite={false}
          depthTest
          brightness={0.5}
          color="#808080"
        />
      </mesh>
    </group>
  );
}

const CoinStack = ({ startAnimation, animationDuration = 3.5 }) => {
  const coinTexture = useTexture("/b-coin.svg");
  const curtainRef = useRef();
  // Vertical offset to position the entire coin stack below the navbar
  const stackYOffset = -0.5; // ~1cm below navbar

  // Add error handling for texture loading
  if (!coinTexture) {
    console.log("Coin texture not loaded yet");
    return null;
  }

  // Animate the curtain fade in and reveal
  useFrame((state) => {
    if (startAnimation && curtainRef.current) {
      const elapsed = state.clock.elapsedTime;

      if (elapsed < 0.2) {
        const progress = elapsed / 0.2;
        curtainRef.current.material.opacity = progress * 0.9;
      } else if (elapsed < 0.4) {
        const progress = (elapsed - 0.2) / 0.2;
        curtainRef.current.material.opacity = 0.9 - (progress * 0.9);
      } else {
        curtainRef.current.visible = false;
      }
    }
  });

  return (
    <>
      {/* Black curtain that reveals the coins */}
      <mesh
        ref={curtainRef}
        position={[0, 0, 5]}
        scale={[30, 3, 1]}
      >
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0}
        />
      </mesh>
      
      <Coin
        texture={coinTexture}
        position={[0.4, -0.4 + stackYOffset, -0.4]}
        animate={startAnimation}
        target={[0.68, -0.68 + stackYOffset, -0.68]}
        opacity={1.0}
        animationDuration={animationDuration}
      />
      <Coin
        texture={coinTexture}
        position={[0, 0 + stackYOffset, 0]}
        animate={startAnimation}
        target={[0, 0 + stackYOffset, 0]}
        opacity={1.0}
        animationDuration={animationDuration}
      />
      <Coin
        texture={coinTexture}
        position={[-0.3, 0.4 + stackYOffset, 0.4]}
        animate={startAnimation}
        target={[-0.7, 0.7 + stackYOffset, 0.7]}
        opacity={0.97}
        animationDuration={animationDuration}
      />
    </>
  );
};

// Custom hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const BInstantSection = () => {
  const [startCoinAnimation, setStartCoinAnimation] = useState(false);
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Defer slightly to allow canvas to mount to reduce context-loss risk
    const timer = setTimeout(() => setStartCoinAnimation(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Method to trigger exit animations (called by SlideContainer)
  const triggerExitAnimation = useCallback(() => {
    console.log('🎯 BInstant: triggerExitAnimation called!');
    if (!sectionRef.current) {
      console.log('❌ BInstant: Refs not ready for exit animation');
      return;
    }
    
    console.log('🎯 BInstant: Starting exit animations...');
    
    // Create exit animation timeline
    const exitTl = gsap.timeline({
      onComplete: () => {
        console.log('🎯 BInstant: Exit animations complete, dispatching event...');
        // Fire exit complete event when exit animations finish
        // This will trigger automatic transition to B_Fast section
        window.dispatchEvent(new CustomEvent('binstantExitComplete'));
      }
    });

    // Exit animations - fade out coins and text
    exitTl.to(canvasRef.current, { 
      opacity: 0, // Fade out the entire canvas (coins)
      duration: 1.5, 
      ease: "power2.in" 
    })
    .to([".bc-bcoin", ".bc-instant", ".bc-dash", ".bc-shared", ".bc-instantly"], { 
      opacity: 0, 
      y: -50, // Move up and fade together
      duration: 1.5, 
      ease: "power2.in" 
    }, "-=1.2");
  }, []);

  // Expose the method to SlideContainer
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__binstantExitHooked) {
      console.log('🎯 BInstant: Exposing triggerBinstantExit to window');
      window.triggerBinstantExit = triggerExitAnimation;
      window.__binstantExitHooked = true;
    }
    return () => {
      if (typeof window !== 'undefined') {
        console.log('🎯 BInstant: Cleaning up triggerBinstantExit from window');
        delete window.triggerBinstantExit;
        delete window.__binstantExitHooked;
      }
    };
  }, [triggerExitAnimation]);

  // Render mobile component on mobile devices
  if (isMobile) {
    return <BInstantMobile />;
  }

  return (
    <div 
      ref={sectionRef}
      className="relative w-full h-screen"
      style={{ backgroundColor: 'black' }}
    >
      {/* Radial gradient background - will animate with coins */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(41.99% 33.2% at 50% 50%, #092646 0%, rgba(9, 38, 70, 0) 100%)",
          zIndex: 10,
          pointerEvents: "none"
        }}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 2.0, 
          ease: "easeOut"
        }}
      />

      {/* THREE.JS CANVAS */}
      <ThreeJSErrorBoundary>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          className="w-full h-full relative z-20"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          frameloop="always"
          onCreated={({ gl }) => {
            try {
              const canvas = gl.domElement;
              const handleContextLost = (e) => {
                e.preventDefault();
                console.warn('WebGL context lost, preventing default to allow restoration.');
              };
              canvas.addEventListener('webglcontextlost', handleContextLost, { passive: false });
            } catch (_) {}
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <Suspense fallback={null}>
            {/* No ambient light */}
            <ambientLight intensity={0} color="#fff8dc" /> 

            {/* Key light with warm golden tint */}
            <directionalLight
              position={[-6, 7, 4]}
              intensity={0.45}
              color="#ffd27f"
              castShadow
            />

            {/* Soft helper light for highlights */}
            <spotLight
              position={[-2, 8, 3]}
              angle={0.5}
              penumbra={0.5}
              intensity={0.12}
              distance={40}
              color="#ffebc2"
            />
            
            {/* Environment reflections - using local preset instead of external HDR */}
            <Environment preset="city" />
            <CoinStack startAnimation={startCoinAnimation} animationDuration={3.0} />
          </Suspense>
        </Canvas>
      </ThreeJSErrorBoundary>

      {/* Transparent black film over coins */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 25,
          pointerEvents: "none"
        }}
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          className="flex flex-col items-start leading-tight text-center"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 3.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginTop: "clamp(2rem, 8vh, 6rem)" }}
        >
          <motion.span
            className="text-amber-50 italic bc-bcoin"
            style={{
              fontWeight: 200,
              fontSize: "clamp(28px, 5.5vw, 110px)",
              textShadow: "0 0 25px rgba(255,215,0,0.6)",
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
                fontSize: "clamp(28px, 5.5vw, 110px)",
                textShadow: "0 0 25px rgba(255,215,0,0.6)",
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Instant Value
            </motion.span>
            <motion.span
              className="text-white bc-dash"
              style={{ fontSize: "clamp(26px, 5vw, 90px)", fontWeight: 400 }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              —
            </motion.span>
            <motion.span
              className="ml-2 shared-word text-white uppercase bc-shared"
              style={{
                fontSize: "clamp(28px, 5.5vw, 100px)",
                fontWeight: 500
              }}
              initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              SHARED
            </motion.span>
          </div>
          <motion.span
            className="self-end text-amber-50 italic bc-instantly"
            style={{
              fontWeight: 200,
              fontSize: "clamp(28px, 5.5vw, 110px)",
              textShadow: "0 0 25px rgba(255,215,0,0.6)",
            }}
            initial={{ scaleX: 0.92, scaleY: 0.9, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Instantly
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default BInstantSection;