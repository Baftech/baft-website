# WebGL Context Manager

This utility provides robust WebGL context loss handling and recovery for Three.js applications.

## Features

- **Automatic Context Loss Detection**: Detects when WebGL context is lost
- **Automatic Recovery**: Attempts to restore WebGL context automatically
- **Fallback UI**: Provides user-friendly error messages when WebGL is unavailable
- **Browser Compatibility**: Checks for WebGL support and browser capabilities
- **Mobile Optimization**: Special handling for mobile devices
- **Performance Monitoring**: Detects potential WebGL performance issues

## Usage

### Basic Usage

```jsx
import { useWebGLContextManager, setupWebGLContext } from './WebGLContextManager';

const MyThreeJSComponent = () => {
  const { 
    contextLost, 
    retryCount, 
    handleContextLost, 
    handleContextRestored 
  } = useWebGLContextManager({
    maxRetries: 3,
    recoveryDelay: 1000,
    enableAutoRecovery: true
  });

  const handleCanvasCreated = useCallback(({ gl }) => {
    const cleanup = setupWebGLContext(gl, {
      isMobile: false,
      onContextLost: handleContextLost,
      onContextRestored: handleContextRestored
    });
    return cleanup;
  }, [handleContextLost, handleContextRestored]);

  // Fallback UI when WebGL is unavailable
  if (contextLost && retryCount >= 3) {
    return <WebGLFallbackUI />;
  }

  return (
    <Canvas onCreated={handleCanvasCreated}>
      {/* Your Three.js content */}
    </Canvas>
  );
};
```

### Configuration Options

```jsx
const webGLManager = useWebGLContextManager({
  maxRetries: 3,           // Maximum recovery attempts
  recoveryDelay: 1000,     // Delay between recovery attempts (ms)
  enableAutoRecovery: true, // Enable automatic recovery
  onContextLost: (event) => {
    // Custom context lost handler
    console.log('Context lost:', event);
  },
  onContextRestored: () => {
    // Custom context restored handler
    console.log('Context restored');
  },
  onRecoveryFailed: () => {
    // Custom recovery failed handler
    console.log('Recovery failed');
  }
});
```

### WebGL Context Setup

```jsx
const handleCanvasCreated = useCallback(({ gl }) => {
  const cleanup = setupWebGLContext(gl, {
    isMobile: false,        // Set to true for mobile devices
    onContextLost: handleContextLost,
    onContextRestored: handleContextRestored
  });
  
  // Return cleanup function
  return cleanup;
}, [handleContextLost, handleContextRestored]);
```

## API Reference

### `useWebGLContextManager(options)`

Returns an object with the following properties:

- `contextLost`: Boolean indicating if context is lost
- `retryCount`: Number of recovery attempts made
- `isRecovering`: Boolean indicating if recovery is in progress
- `maxRetries`: Maximum number of recovery attempts
- `browserCompatible`: Boolean indicating browser compatibility
- `handleContextLost`: Function to handle context lost events
- `handleContextRestored`: Function to handle context restored events
- `manualRetry`: Function to manually retry recovery
- `forceReload`: Function to force page reload
- `attemptRecovery`: Function to attempt automatic recovery

### `setupWebGLContext(gl, options)`

Sets up WebGL context with optimized settings and event handlers.

Parameters:
- `gl`: WebGL context from Three.js
- `options`: Configuration object
  - `isMobile`: Boolean for mobile-specific optimizations
  - `onContextLost`: Context lost event handler
  - `onContextRestored`: Context restored event handler

Returns a cleanup function to remove event listeners.

### `checkWebGLSupport()`

Checks if WebGL is supported and returns support information.

### `checkBrowserCompatibility()`

Checks browser compatibility for WebGL context loss handling.

### `detectWebGLIssues()`

Detects common WebGL issues like mobile GPU limitations and memory constraints.

## Error Handling

The context manager provides several levels of error handling:

1. **Automatic Recovery**: Attempts to restore context automatically
2. **Fallback UI**: Shows user-friendly error messages
3. **Manual Recovery**: Provides buttons for users to retry
4. **Performance Monitoring**: Detects and warns about potential issues

## Mobile Considerations

For mobile devices:

- Set `isMobile: true` in `setupWebGLContext`
- Use lower pixel ratios and simplified rendering
- Disable antialiasing for better performance
- Handle touch events appropriately

## Troubleshooting

### Common Issues

1. **Context Lost on Tab Switch**: This is normal behavior, the context manager handles it automatically
2. **Mobile Performance Issues**: Use mobile-optimized settings and reduce complexity
3. **Browser Compatibility**: Check browser support using `checkBrowserCompatibility()`

### Debug Information

Enable console logging to see detailed information about context loss and recovery attempts.

## Best Practices

1. **Always wrap Three.js components** with the context manager
2. **Provide fallback UI** for when WebGL is unavailable
3. **Use appropriate mobile settings** for mobile devices
4. **Monitor performance** and adjust complexity accordingly
5. **Test on various devices** to ensure compatibility

## Example Components

See the following components for complete examples:
- `BInstantSection.jsx` - Desktop Three.js component
- `BInstantMobile.jsx` - Mobile Three.js component
- `ThreeJSErrorBoundary.jsx` - Error boundary for Three.js


