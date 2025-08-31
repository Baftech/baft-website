import React from 'react';

class ThreeJSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      isContextLost: false,
      retryCount: 0 
    };
    this.maxRetries = 3;
  }

  static getDerivedStateFromError(error) {
    // Check if it's a WebGL context error
    const isContextLost = error.message && (
      error.message.includes('Context Lost') || 
      error.message.includes('context lost') ||
      error.message.includes('WebGL') ||
      error.message.includes('THREE.WebGLRenderer')
    );
    
    return { 
      hasError: true, 
      error, 
      isContextLost,
      retryCount: 0
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.warn('Three.js Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a WebGL context error
    if (this.state.isContextLost) {
      console.warn('WebGL context lost detected, attempting recovery...');
      this.attemptRecovery();
    } else {
      // For non-context errors, try to recover after a delay
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 2000);
    }
  }

  attemptRecovery = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      console.log(`Attempting WebGL recovery (${retryCount + 1}/${this.maxRetries})...`);
      
      // Increment retry count
      this.setState(prevState => ({ 
        retryCount: prevState.retryCount + 1 
      }));
      
      // Wait a bit longer between retries
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff
      
      setTimeout(() => {
        if (retryCount + 1 >= this.maxRetries) {
          // Final attempt failed, show permanent error
          console.error('WebGL recovery failed after maximum attempts');
        } else {
          // Try to recover by resetting error state
          this.setState({ 
            hasError: false, 
            error: null,
            isContextLost: false
          });
        }
      }, delay);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      isContextLost: false,
      retryCount: 0 
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const { isContextLost, retryCount } = this.state;
      
      if (isContextLost && retryCount >= this.maxRetries) {
        // Permanent WebGL failure
        return (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-300 p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold mb-2">WebGL Graphics Unavailable</h3>
              <p className="text-sm mb-4">Your device or browser doesn't support WebGL graphics.</p>
              <div className="space-y-2">
                <button 
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm mr-2"
                >
                  Try Again
                </button>
                <button 
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      if (isContextLost) {
        // Attempting recovery
        return (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-300 p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Recovering Graphics...</h3>
              <p className="text-sm mb-2">Attempt {retryCount + 1} of {this.maxRetries}</p>
              <div className="w-16 h-2 bg-gray-700 rounded-full mx-auto mt-4">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((retryCount + 1) / this.maxRetries) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      }
      
      // General Three.js error
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-300 p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">3D Content Temporarily Unavailable</h3>
            <p className="text-sm mb-4">Attempting to recover...</p>
            <div className="animate-pulse">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeJSErrorBoundary;
