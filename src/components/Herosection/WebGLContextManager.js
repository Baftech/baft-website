import { useState, useCallback, useEffect } from 'react';

/**
 * Check if WebGL is supported and available
 */
export const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, reason: 'WebGL not supported' };
    }

    // Check for basic WebGL capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return {
        supported: true,
        vendor,
        renderer,
        gl
      };
    }

    return { supported: true, gl };
  } catch (error) {
    return { supported: false, reason: error.message };
  }
};

/**
 * Check browser compatibility for WebGL context loss handling
 */
export const checkBrowserCompatibility = () => {
  const compatibility = {
    webglContextLost: 'webglcontextlost' in document.createElement('canvas'),
    webglContextRestored: 'webglcontextrestored' in document.createElement('canvas'),
    visibilityChange: 'visibilityState' in document,
    pageVisibility: 'hidden' in document,
    requestAnimationFrame: 'requestAnimationFrame' in window,
    performance: 'performance' in window && 'now' in performance
  };

  return compatibility;
};

/**
 * Custom hook for managing WebGL context loss and recovery
 * Provides consistent WebGL context handling across all Three.js components
 */
export const useWebGLContextManager = (options = {}) => {
  const {
    maxRetries = 3,
    recoveryDelay = 1000,
    enableAutoRecovery = true,
    onContextLost = null,
    onContextRestored = null,
    onRecoveryFailed = null
  } = options;

  const [contextLost, setContextLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);
  const [browserCompatible, setBrowserCompatible] = useState(true);

  // Check browser compatibility on mount
  useEffect(() => {
    const compatibility = checkBrowserCompatibility();
    const webglSupport = checkWebGLSupport();
    
    if (!webglSupport.supported) {
      console.warn('WebGL not supported:', webglSupport.reason);
      setBrowserCompatible(false);
    } else if (!compatibility.webglContextLost || !compatibility.webglContextRestored) {
      console.warn('Browser does not support WebGL context loss events');
      setBrowserCompatible(false);
    }
  }, []);

  const handleContextLost = useCallback((event) => {
    event.preventDefault();
    console.warn('WebGL context lost, attempting to restore...');
    setContextLost(true);
    setIsRecovering(true);
    
    if (onContextLost) {
      onContextLost(event);
    }
  }, [onContextLost]);

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored successfully');
    setContextLost(false);
    setRetryCount(0);
    setIsRecovering(false);
    
    if (onContextRestored) {
      onContextRestored();
    }
  }, [onContextRestored]);

  const attemptRecovery = useCallback(() => {
    if (retryCount < maxRetries) {
      console.log(`Attempting WebGL recovery (${retryCount + 1}/${maxRetries})...`);
      setRetryCount(prev => prev + 1);
      
      // Force a re-render to attempt context restoration
      if (enableAutoRecovery) {
        window.location.reload();
      }
    } else {
      console.error('WebGL recovery failed after maximum attempts');
      setIsRecovering(false);
      
      if (onRecoveryFailed) {
        onRecoveryFailed();
      }
    }
  }, [retryCount, maxRetries, enableAutoRecovery, onRecoveryFailed]);

  const manualRetry = useCallback(() => {
    setRetryCount(0);
    setContextLost(false);
    setIsRecovering(false);
  }, []);

  const forceReload = useCallback(() => {
    window.location.reload();
  }, []);

  // Auto-recovery logic
  useEffect(() => {
    if (contextLost && enableAutoRecovery && retryCount < maxRetries) {
      const timer = setTimeout(attemptRecovery, recoveryDelay);
      return () => clearTimeout(timer);
    }
  }, [contextLost, enableAutoRecovery, retryCount, maxRetries, recoveryDelay, attemptRecovery]);

  return {
    contextLost,
    retryCount,
    isRecovering,
    maxRetries,
    browserCompatible,
    handleContextLost,
    handleContextRestored,
    manualRetry,
    forceReload,
    attemptRecovery
  };
};

/**
 * Enhanced WebGL context configuration for better performance and stability
 */
export const getWebGLConfig = (isMobile = false) => {
  const baseConfig = {
    physicallyCorrectLights: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    outputEncoding: THREE.sRGBEncoding,
    powerPreference: "high-performance",
    antialias: true,
    failIfMajorPerformanceCaveat: false,
    preserveDrawingBuffer: false,
    stencil: false,
    depth: true,
    alpha: false,
  };

  if (isMobile) {
    return {
      ...baseConfig,
      powerPreference: "low-power",
      antialias: false,
      alpha: true,
    };
  }

  return baseConfig;
};

/**
 * Setup WebGL context with enhanced error handling
 */
export const setupWebGLContext = (gl, options = {}) => {
  const {
    isMobile = false,
    onContextLost = null,
    onContextRestored = null
  } = options;

  // Basic setup
  gl.setClearColor(0x000000, 0);
  
  // Enhanced WebGL context settings
  gl.powerPreference = isMobile ? "low-power" : "high-performance";
  gl.failIfMajorPerformanceCaveat = false;
  gl.preserveDrawingBuffer = false;
  gl.antialias = !isMobile;
  gl.stencil = false;
  gl.depth = true;
  gl.alpha = isMobile;

  // Set up context loss/restore handlers
  if (gl.canvas) {
    if (onContextLost) {
      gl.canvas.addEventListener('webglcontextlost', onContextLost, false);
    }
    if (onContextRestored) {
      gl.canvas.addEventListener('webglcontextrestored', onContextRestored, false);
    }
  }

  // Optimize rendering
  const maxDPR = isMobile ? 1.5 : 2;
  gl.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
  
  // Enable depth testing and face culling for better performance
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  
  // Set up shadow mapping if supported
  if (gl.getExtension('WEBGL_depth_texture')) {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  // Mobile-specific optimizations
  if (isMobile && gl.domElement) {
    gl.domElement.style.touchAction = 'none';
  }

  return () => {
    // Cleanup function
    if (gl.canvas) {
      if (onContextLost) {
        gl.canvas.removeEventListener('webglcontextlost', onContextLost);
      }
      if (onContextRestored) {
        gl.canvas.removeEventListener('webglcontextrestored', onContextRestored);
      }
    }
  };
};

/**
 * Utility to detect and handle common WebGL issues
 */
export const detectWebGLIssues = () => {
  const issues = [];
  
  // Check for common mobile GPU issues
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // Check for known problematic mobile GPUs
        if (renderer.includes('Mali') || renderer.includes('PowerVR') || renderer.includes('Adreno')) {
          issues.push({
            type: 'mobile_gpu',
            severity: 'warning',
            message: `Mobile GPU detected: ${renderer}. May have limited WebGL support.`
          });
        }
      }
    }
  }

  // Check for memory constraints
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    issues.push({
      type: 'low_memory',
      severity: 'warning',
      message: `Low device memory detected: ${navigator.deviceMemory}GB. WebGL performance may be limited.`
    });
  }

  return issues;
};

export default useWebGLContextManager;
