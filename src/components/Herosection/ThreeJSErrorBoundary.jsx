import React from 'react';

class ThreeJSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.warn('Three.js Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a WebGL context error
    if (error.message && error.message.includes('Context Lost')) {
      console.warn('WebGL context lost detected, component will attempt to recover');
      // Reset error state after a short delay to allow recovery
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when Three.js fails
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <div className="text-4xl mb-4">🎮</div>
            <p className="text-sm">3D content temporarily unavailable</p>
            <p className="text-xs text-gray-500 mt-2">Refreshing...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeJSErrorBoundary;
