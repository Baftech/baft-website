// WebGL Context Manager to prevent context loss issues
export class WebGLContextManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = null;
    this.contextLost = false;
    this.setupContextLossHandling();
  }

  setupContextLossHandling() {
    if (!this.canvas) return;

    // Handle context lost
    this.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.contextLost = true;
      console.warn('WebGL context lost, attempting to restore...');
    }, false);

    // Handle context restored
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      console.log('WebGL context restored successfully');
    }, false);

    // Handle visibility change to prevent context loss on tab switch
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab is hidden, reduce WebGL activity
        this.pauseWebGL();
      } else {
        // Tab is visible, resume WebGL activity
        this.resumeWebGL();
      }
    });
  }

  pauseWebGL() {
    // Reduce WebGL activity when tab is not visible
    if (this.gl) {
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }

  resumeWebGL() {
    // Resume WebGL activity when tab becomes visible
    if (this.gl && this.contextLost) {
      this.gl.getExtension('WEBGL_lose_context')?.restoreContext();
    }
  }

  // Get WebGL context with error handling
  getContext() {
    try {
      this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
      if (this.gl) {
        this.setupContextLossHandling();
        return this.gl;
      }
    } catch (error) {
      console.warn('Failed to get WebGL context:', error);
    }
    return null;
  }

  // Check if WebGL is supported
  isSupported() {
    return !!this.gl;
  }

  // Cleanup
  dispose() {
    if (this.gl) {
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.gl = null;
    }
  }
}

// Utility function to create optimized WebGL context
export function createOptimizedWebGLContext(canvas, options = {}) {
  const defaultOptions = {
    powerPreference: 'high-performance',
    antialias: true,
    alpha: false,
    depth: true,
    stencil: false,
    failIfMajorPerformanceCaveat: false,
    preserveDrawingBuffer: false,
    ...options
  };

  try {
    // Try WebGL2 first
    let gl = canvas.getContext('webgl2', defaultOptions);
    
    if (!gl) {
      // Fallback to WebGL1
      gl = canvas.getContext('webgl', defaultOptions);
    }

    if (gl) {
      // Set some performance optimizations
      gl.getExtension('OES_element_index_uint');
      gl.getExtension('WEBGL_depth_texture');
      
      // Handle context loss
      const contextManager = new WebGLContextManager(canvas);
      contextManager.gl = gl;
      
      return { gl, contextManager };
    }
  } catch (error) {
    console.warn('Failed to create WebGL context:', error);
  }

  return { gl: null, contextManager: null };
}
