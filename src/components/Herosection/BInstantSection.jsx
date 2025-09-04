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
  const hasReachedTargetRef = useRef(false);
  const animationStartTimeRef = useRef(null);
  const isVisibleRef = useRef(false);
  const targetVector = useMemo(() => new THREE.Vector3(...target), [target]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!animate || !mesh || hasReachedTargetRef.current) {
      return;
    }

    if (animationStartTimeRef.current == null) {
      animationStartTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - animationStartTimeRef.current;

    // Wait for curtain to fade out before showing coins
    if (elapsed < 0.4) {
      if (mesh.material) {
        mesh.material.opacity = 0;
      }
      return;
    }

    // Make coins visible when curtain fades out
    if (!isVisibleRef.current) {
      isVisibleRef.current = true;
      if (mesh.material) {
        mesh.material.opacity = opacity;
      }
    }

    // Start expanding immediately after becoming visible
    if (elapsed >= 0.4) {
      const currentPos = mesh.position;

      // Check if we're close enough to target to consider it reached
      const distance = currentPos.distanceTo(targetVector);
      if (distance < 0.01) {
        hasReachedTargetRef.current = true;
        return;
      }

      // Smooth expansion with easing
      const progress = (elapsed - 0.4) / (animationDuration - 0.4);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      currentPos.lerp(targetVector, easedProgress * 0.02);
    }

    // Stop animation after duration
    if (elapsed >= animationDuration) {
      hasReachedTargetRef.current = true;
      return;
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
          color="#b0b0b0"
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

const CoinStack = ({ startAnimation, animationDuration = 3.5 }) => {
  const coinTexture = useTexture("/b-coin.svg");
  const curtainRef = useRef();

  // Add error handling for texture loading
  if (!coinTexture) {
    console.log("Coin texture not loaded yet");
    return null;
  }

  // Animate the curtain fade in and reveal anchored to start time
  const curtainStartTimeRef = useRef(null);
  useFrame((state) => {
    if (startAnimation && curtainRef.current) {
      if (curtainStartTimeRef.current == null) {
        curtainStartTimeRef.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - curtainStartTimeRef.current;

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
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0}
        />
      </mesh>
      
      <Coin
        texture={coinTexture}
        position={[0.4, -0.4, -0.4]}
        animate={startAnimation}
        target={[0.6 , -0.6, -0.6]}
        opacity={1.0}
        animationDuration={animationDuration}
      />
      <Coin
        texture={coinTexture}
        position={[0, 0, 0]}
        animate={startAnimation}
        target={[0, 0, 0]}
        opacity={1.0}
        animationDuration={animationDuration}
      />
      <Coin
        texture={coinTexture}
        position={[-0.3, 0.4, 0.4]}
        animate={startAnimation}
        target={[-0.6, 0.6, 0.6]}
        opacity={1}
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