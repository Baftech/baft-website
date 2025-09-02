# BaFT Coin Animation Trigger System

## Overview
The BaFT Coin section now includes an advanced animation trigger system that provides:
- **Entrance animations** when scrolling into the section
- **Exit animations** when user attempts to scroll away (triggers pinning)
- **Section pinning** for 3 seconds with reverse animations
- **Coordinated transitions** with the SlideContainer

## How It Works

### 1. Entrance Animation
When the user scrolls to the BaFT Coin section:
- Text elements fade in with staggered timing
- Coin image appears with scale and rotation effects
- Floating animation begins after entrance completes
- Section is ready for user interaction

### 2. Scroll Attempt Detection
When the user tries to scroll away from the section:
- Section immediately pins in place
- Reverse animations begin automatically
- Content animates out over 3 seconds
- User cannot proceed until animations complete

### 3. Exit Animation & Pinning
During the 3-second pin period:
- All entrance animations are reversed
- Text elements fade out with scale and position changes
- Coin image fades out with rotation and scale
- Effects are removed (glow, blur, etc.)
- After 3 seconds, section unpins and allows transition

## Technical Implementation

### State Management
- `isPinned`: Controls whether section is currently pinned
- `isExiting`: Prevents multiple exit animations from running
- `hasAnimated`: Tracks if entrance animations have completed

### Event Communication
The component communicates with SlideContainer via custom events:
- `baftCoinPinned`: Notifies when section becomes pinned/unpinned
- `baftCoinExitComplete`: Notifies when exit animation finishes

### Global Flags
- `window.__baftCoinPinnedActive`: Used by SlideContainer to prevent scrolling
- `window.__baftCoinManualExit`: Allows manual triggering of exit animation

## Usage

### Automatic Behavior
The system works automatically:
1. User scrolls to BaFT Coin section → entrance animations play
2. User tries to scroll away → section pins and reverse animations start
3. After 3 seconds → section unpins and allows transition to next slide

### Manual Control
```javascript
// Trigger exit animation manually (for testing/debugging)
window.__baftCoinManualExit();
```

### Testing
1. Navigate to the BaFT Coin section
2. Wait for entrance animations to complete
3. Try scrolling away → section will pin and show "Section Pinned - Animating Out"
4. Watch reverse animations over 3 seconds
5. After 3 seconds, section unpins and allows scrolling to next section

## Configuration

### Timing
- Entrance animations: 3.2 seconds total
- Section pinning: 3 seconds (fixed)
- Exit animations: 1.5 seconds total (within pin period)
- Floating animation: Continuous with 6-second cycle

### Animation Easing
- Entrance: `power2.out` for smooth appearance
- Exit: `power3.in` for quick disappearance
- Floating: `power1.inOut` for gentle movement

## Integration with SlideContainer

The SlideContainer automatically:
- Prevents scrolling when BaFT Coin section is pinned
- Shows visual indicator when section is pinned
- Handles transition to next slide after exit completes
- Coordinates with other pinned sections (About, Video)

## Key Differences from Previous Version

- **No automatic pinning** after entrance animations
- **Pinning only triggers** when user attempts to scroll away
- **Reverse animations happen** during the 3-second pin period
- **Immediate response** to scroll attempts with visual feedback

## Troubleshooting

### Common Issues
1. **Animations not triggering**: Check if refs are properly set
2. **Section not pinning**: Verify scroll attempt detection
3. **Exit not working**: Ensure `isExiting` state is properly managed

### Debug Commands
```javascript
// Check current state
console.log('Pinned:', window.__baftCoinPinnedActive);

// Force exit
window.__baftCoinManualExit();
```

## Future Enhancements

Potential improvements:
- Configurable pin duration
- Custom exit animation sequences
- Integration with other sections
- Performance optimizations for mobile
- Haptic feedback for mobile devices
