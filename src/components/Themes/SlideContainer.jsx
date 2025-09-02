import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');

  const [canScrollToNext, setCanScrollToNext] = useState(true);
  const [canScrollToPrev, setCanScrollToPrev] = useState(true);
  const totalSlides = React.Children.count(children);
  const handoffFromAboutRef = useRef(false);
  const [showAboutCrossfade, setShowAboutCrossfade] = useState(false);
  const [aboutCrossfadeFadeOut, setAboutCrossfadeFadeOut] = useState(false);
  const [aboutCrossfadeOpaque, setAboutCrossfadeOpaque] = useState(false);
  const lastNavTime = useRef(0);
  const navCooldownMs = 300;
  const momentumGuardUntilRef = useRef(0);
  
  // BaFT Coin section control
  const [baftCoinPinned, setBaftCoinPinned] = useState(false);
  
  // BInstant section control
  const [binstantPinned, setBinstantPinned] = useState(false);
  
  // Touch gesture handling
  const touchStartY = useRef(0);
  const minSwipeDistance = 50;

  // Scroll position tracking
  const currentSlideRef = useRef(null);
  const scrollThreshold = 30; // Reduced threshold for smoother transitions
  const smoothScrollOptions = {
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  };



  // Check if current slide can scroll and update scroll permissions
  useEffect(() => {
    const checkScrollPermissions = () => {
      if (!currentSlideRef.current) return;
      
      const element = currentSlideRef.current;
      const canScrollUp = element.scrollTop > scrollThreshold;
      const canScrollDown = element.scrollTop < (element.scrollHeight - element.clientHeight - scrollThreshold);
      
      setCanScrollToPrev(canScrollUp);
      setCanScrollToNext(canScrollDown);
    };

    // Check after a short delay to ensure content is rendered
    const timer = setTimeout(checkScrollPermissions, 100);
    
    // Also check on window resize
    window.addEventListener('resize', checkScrollPermissions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPermissions);
    };
  }, [slideIndex]);

  const handleSlideChange = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides && !isTransitioning) {
      setPreviousSlideIndex(slideIndex);
      const direction = newIndex > slideIndex ? 'up' : 'down';
      setTransitionDirection(direction);
      setIsTransitioning(true);

      // Determine if this change should use seamless transition timing
      const movingUpSeamless = direction === 'up' && (
        (slideIndex === 3 && newIndex === 4) ||
        (slideIndex === 4 && newIndex === 5) ||
        (slideIndex === 5 && newIndex === 6) ||
        (slideIndex === 6 && newIndex === 7)
      );
      const movingDownSeamless = direction === 'down' && (
        (slideIndex === 4 && newIndex === 3) ||
        (slideIndex === 5 && newIndex === 4) ||
        (slideIndex === 6 && newIndex === 5) ||
        (slideIndex === 7 && newIndex === 6)
      );
      const isSeamlessTransition = movingUpSeamless || movingDownSeamless;
      // Match CSS durations: seamless 1.3s, banner overlay 1.6s
      const transitionDurationMs = isSeamlessTransition ? 1300 : 1600;

      // Set a momentum guard immediately so inertial scroll doesn't affect target slide
      momentumGuardUntilRef.current = Date.now() + transitionDurationMs + 450;

      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);

      // Proactively reset scroll so the next slide always starts at top
      // Try immediately on next frame and again after transition ends for seamless cases
      requestAnimationFrame(() => {
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      });

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection('none');
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        // Extend guard briefly after transition fully ends
        momentumGuardUntilRef.current = Date.now() + 500;
      }, transitionDurationMs);
    }
  }, [totalSlides, onSlideChange, isTransitioning, slideIndex]);

  // Touch gesture handlers (element-level)
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    // Allow native scrolling otherwise; do not prevent default
  }, [isTransitioning]);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    const now = Date.now();
    if (now - lastNavTime.current < navCooldownMs) return;

    const endY = e.changedTouches[0].clientY;
    const distance = touchStartY.current - endY;
    if (Math.abs(distance) < minSwipeDistance) return;

    const element = currentSlideRef.current;
    if (!element) return;
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold);

    if (distance > 0 && atBottom && slideIndex < totalSlides - 1) {
      // Swipe up at bottom -> next slide
      lastNavTime.current = now;
      handleSlideChange(slideIndex + 1);
    } else if (distance < 0 && atTop && slideIndex > 0) {
      // Swipe down at top -> previous slide
      lastNavTime.current = now;
      handleSlideChange(slideIndex - 1);
    }
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // Attach non-passive touch listeners so preventDefault works when needed (iOS/Android)
  useEffect(() => {
    const element = currentSlideRef.current;
    if (!element) return;

    const ts = (e) => handleTouchStart(e);
    const tm = (e) => handleTouchMove(e);
    const te = (e) => handleTouchEnd(e);

    element.addEventListener('touchstart', ts, { passive: false });
    element.addEventListener('touchmove', tm, { passive: false });
    element.addEventListener('touchend', te, { passive: false });

    return () => {
      element.removeEventListener('touchstart', ts);
      element.removeEventListener('touchmove', tm);
      element.removeEventListener('touchend', te);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const handleWheel = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      // Prevent momentum scroll from affecting the next slide during transitions
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;

    const element = currentSlideRef.current;
    if (!element) return;

    const now = Date.now();
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold);

    if (e.deltaY > 0 && atBottom && slideIndex < totalSlides - 1) {
      if (e && e.cancelable) e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        
        // Special handling for BaFT Coin slide (slide 2, index 1)
        if (slideIndex === 1 && !baftCoinPinned) {
          console.log('🎯 BaFT Coin: Scroll triggered, starting exit animations immediately...');
          // Pin the BaFT Coin section and trigger exit animations immediately on scroll
          setBaftCoinPinned(true);
          
          // Trigger exit animations immediately on scroll (no 3-second wait)
          if (typeof window !== 'undefined' && window.triggerBaftCoinExit) {
            console.log('🎯 BaFT Coin: Calling triggerBaftCoinExit immediately...');
            window.triggerBaftCoinExit();
          } else {
            console.log('❌ BaFT Coin: triggerBaftCoinExit not found on window!');
          }
          
          // Reset pin state after a short delay
          setTimeout(() => {
            setBaftCoinPinned(false);
          }, 100);
          
          return; // Don't change slide yet
        }
        
        // Special handling for BInstant slide (slide 3, index 2)
        if (slideIndex === 2 && !binstantPinned) {
          console.log('🎯 BInstant: Scroll triggered, starting exit animations immediately...');
          // Pin the BInstant section and trigger exit animations immediately on scroll
          setBinstantPinned(true);
          
          // Trigger exit animations immediately on scroll
          if (typeof window !== 'undefined' && window.triggerBinstantExit) {
            console.log('🎯 BInstant: Calling triggerBinstantExit immediately...');
            window.triggerBinstantExit();
          } else {
            console.log('❌ BInstant: triggerBinstantExit not found on window!');
          }
          
          // Reset pin state after a short delay
          setTimeout(() => {
            setBinstantPinned(false);
          }, 100);
          
          return; // Don't change slide yet
        }
        

        
        // Normal slide change
        handleSlideChange(slideIndex + 1);
      }
    } else if (e.deltaY < 0 && atTop && slideIndex > 0) {
      if (e && e.cancelable) e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        handleSlideChange(slideIndex - 1);
      }
    }
    // Otherwise allow native scrolling
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // Attach non-passive wheel listener so preventDefault works without warnings
  useEffect(() => {
    const element = currentSlideRef.current;
    if (!element) return;
    const wheelListener = (e) => {
      handleWheel(e);
    };
    element.addEventListener('wheel', wheelListener, { passive: false });
    return () => {
      element.removeEventListener('wheel', wheelListener);
    };
  }, [handleWheel]);

  // Listen for About section pinned end to advance to next slide (pre-footer)
  useEffect(() => {
    const handleAboutPinnedEnd = () => {
      if (isTransitioning) return;
      const nextIndex = Math.min(slideIndex + 1, totalSlides - 1);
      if (nextIndex !== slideIndex) {
        handoffFromAboutRef.current = true;
        // Prepare a black crossfade overlay to cover the handoff
        setShowAboutCrossfade(true);
        setAboutCrossfadeOpaque(false); // start transparent
        setAboutCrossfadeFadeOut(false);
        // Fade to black quickly
        setTimeout(() => {
          setAboutCrossfadeOpaque(true);
        }, 10);
        // Once fully black, change slide under cover
        setTimeout(() => {
          // Ensure current slide is at top without animation
          const element = currentSlideRef.current;
          if (element) {
            try { element.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
          }
          handleSlideChange(nextIndex);
          // After a short hold, fade the cover out smoothly
          setTimeout(() => {
            setAboutCrossfadeFadeOut(true);
            // Remove overlay after fade completes
            setTimeout(() => {
              setShowAboutCrossfade(false);
              setAboutCrossfadeFadeOut(false);
              setAboutCrossfadeOpaque(false);
              handoffFromAboutRef.current = false;
            }, 720);
          }, 150);
        }, 220); // allow ~220ms for fade-in to black
      }
    };
    window.addEventListener('aboutPinnedEnded', handleAboutPinnedEnd);
    return () => window.removeEventListener('aboutPinnedEnded', handleAboutPinnedEnd);
  }, [slideIndex, totalSlides, isTransitioning, handleSlideChange]);

  // Listen for BaFT Coin exit complete event - automatic transition to BInstant
  useEffect(() => {
    const handleBaftCoinExitComplete = () => {
      console.log('🎯 BaFT Coin: Exit complete event received!');
      if (slideIndex === 1 && !isTransitioning) { // BaFT Coin is slide 2 (index 1)
        console.log('🎯 BaFT Coin: Starting smooth transition to BInstant...');
        
        const nextIndex = 2; // BInstant section
        if (nextIndex !== slideIndex) {
          // Prepare a black crossfade overlay to cover the handoff (same as About section)
          setShowAboutCrossfade(true);
          setAboutCrossfadeOpaque(false); // start transparent
          setAboutCrossfadeFadeOut(false);
          
          // Fade to black quickly
          setTimeout(() => {
            setAboutCrossfadeOpaque(true);
          }, 10);
          
          // Once fully black, change slide under cover
          setTimeout(() => {
            // Ensure current slide is at top without animation
            const element = currentSlideRef.current;
            if (element) {
              try { element.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
            }
            handleSlideChange(nextIndex);
            
            // After a short hold, fade the cover out smoothly
            setTimeout(() => {
              setAboutCrossfadeFadeOut(true);
              // Remove overlay after fade completes
              setTimeout(() => {
                setShowAboutCrossfade(false);
                setAboutCrossfadeFadeOut(false);
                setAboutCrossfadeOpaque(false);
              }, 720);
            }, 150);
          }, 220); // allow ~220ms for fade-in to black
        }
      }
    };

    window.addEventListener('baftCoinExitComplete', handleBaftCoinExitComplete);
    return () => window.removeEventListener('baftCoinExitComplete', handleBaftCoinExitComplete);
  }, [slideIndex, isTransitioning, handleSlideChange]);

  // Listen for BInstant exit complete event - automatic transition to B_Fast
  useEffect(() => {
    const handleBinstantExitComplete = () => {
      console.log('🎯 BInstant: Exit complete event received!');
      if (slideIndex === 2 && !isTransitioning) { // BInstant is slide 3 (index 2)
        console.log('🎯 BInstant: Starting smooth transition to B_Fast...');
        
        const nextIndex = 3; // B_Fast section (slide 4, index 3)
        if (nextIndex !== slideIndex) {
          // Prepare a black crossfade overlay to cover the handoff (same as About section)
          setShowAboutCrossfade(true);
          setAboutCrossfadeOpaque(false); // start transparent
          setAboutCrossfadeFadeOut(false);
          
          // Fade to black quickly
          setTimeout(() => {
            setAboutCrossfadeOpaque(true);
          }, 10);
          
          // Once fully black, change slide under cover
          setTimeout(() => {
            // Ensure current slide is at top without animation
            const element = currentSlideRef.current;
            if (element) {
              try { element.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
            }
            handleSlideChange(nextIndex);
            
            // After a short hold, fade the cover out smoothly
            setTimeout(() => {
              setAboutCrossfadeFadeOut(true);
              // Remove overlay after fade completes
              setTimeout(() => {
                setShowAboutCrossfade(false);
                setAboutCrossfadeFadeOut(false);
                setAboutCrossfadeOpaque(false);
              }, 720);
            }, 150);
          }, 220); // allow ~220ms for fade-in to black
        }
      }
    };

    window.addEventListener('binstantExitComplete', handleBinstantExitComplete);
    return () => window.removeEventListener('binstantExitComplete', handleBinstantExitComplete);
  }, [slideIndex, isTransitioning, handleSlideChange]);

  // Listen for programmatic navigation requests (e.g., slow smooth transition to a target slide)
  useEffect(() => {
    const handleNavigateToSlide = (e) => {
      if (!e || !e.detail) return;
      const { index: targetIndex, slow } = e.detail;
      if (typeof targetIndex !== 'number') return;
      if (targetIndex < 0 || targetIndex >= totalSlides) return;
      if (isTransitioning) return;

      // Use an overlay crossfade for a slow, smooth transition
      const fadeInMs = slow ? 700 : 220;
      const holdMs = slow ? 200 : 150;
      const fadeOutMs = slow ? 1000 : 700;

      setShowAboutCrossfade(true);
      setAboutCrossfadeOpaque(false);
      setAboutCrossfadeFadeOut(false);

      // Fade to black
      setTimeout(() => {
        setAboutCrossfadeOpaque(true);
      }, 10);

      // Once black, change slide under cover
      setTimeout(() => {
        const element = currentSlideRef.current;
        if (element) {
          try { element.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
        }
        handleSlideChange(targetIndex);

        // After a short hold, fade the cover out smoothly
        setTimeout(() => {
          setAboutCrossfadeFadeOut(true);
          // Remove overlay after fade completes
          setTimeout(() => {
            setShowAboutCrossfade(false);
            setAboutCrossfadeFadeOut(false);
            setAboutCrossfadeOpaque(false);
          }, fadeOutMs);
        }, holdMs);
      }, fadeInMs);
    };

    window.addEventListener('navigateToSlide', handleNavigateToSlide);
    return () => window.removeEventListener('navigateToSlide', handleNavigateToSlide);
  }, [isTransitioning, totalSlides, handleSlideChange]);

  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return;
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    const element = currentSlideRef.current;
    const atTop = element ? element.scrollTop <= scrollThreshold : true;
    const atBottom = element ? element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold) : true;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (!atBottom && element) {
        element.scrollBy({ top: 100, behavior: 'smooth' });
        return;
      }
      if (slideIndex < totalSlides - 1) {
        handleSlideChange(slideIndex + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (!atTop && element) {
        element.scrollBy({ top: -100, behavior: 'smooth' });
        return;
      }
      if (slideIndex > 0) {
        handleSlideChange(slideIndex - 1);
      }
    } else if (e.key === "Home") {
      handleSlideChange(0);
    } else if (e.key === "End") {
      handleSlideChange(totalSlides - 1);
    }
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // No global listeners; handlers are attached to elements

  // Update slide index when currentSlide prop changes
  useEffect(() => {
    if (currentSlide !== undefined && currentSlide !== slideIndex) {
      if (currentSlide >= 0 && currentSlide < totalSlides) {
        setSlideIndex(currentSlide);
        setPreviousSlideIndex(slideIndex);
      }
    }
  }, [currentSlide, slideIndex, totalSlides]);

  // Ensure scroll position is reset whenever the active slide changes
  useEffect(() => {
    requestAnimationFrame(() => {
      if (currentSlideRef.current) {
        currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });
  }, [slideIndex]);

  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[slideIndex];
  const previousChild = childrenArray[previousSlideIndex];

  // Validate slide indices
  if (slideIndex < 0 || slideIndex >= totalSlides) {
    return null;
  }

  if (!currentChild) {
    return null;
  }

  // Seamless transition conditions
  const seamlessEnabled = false; // Disable seamless to avoid double-rendering heavy slides (e.g., WebGL)
  const isSeamlessUp = isTransitioning && transitionDirection === 'up' && 
    ((previousSlideIndex === 3 && slideIndex === 4) || 
     (previousSlideIndex === 4 && slideIndex === 5) ||
     (previousSlideIndex === 5 && slideIndex === 6) ||
     (previousSlideIndex === 6 && slideIndex === 7));
  const isSeamlessDown = isTransitioning && transitionDirection === 'down' && 
    ((previousSlideIndex === 4 && slideIndex === 3) || 
     (previousSlideIndex === 5 && slideIndex === 4) ||
     (previousSlideIndex === 6 && slideIndex === 5) ||
     (previousSlideIndex === 7 && slideIndex === 6));
  const isSeamless = seamlessEnabled && (isSeamlessUp || isSeamlessDown);

  return (
    <div className="slide-container relative w-full h-screen overflow-hidden" tabIndex={0} onKeyDown={handleKeyDown}>
      {isSeamless ? (
        <>
          <div className={`absolute inset-0 w-full h-full ${
            isSeamlessUp ? 'seamless-up-prev' : 'seamless-down-prev'
          }`}>
            {previousChild}
          </div>
          <div className={`absolute inset-0 w-full h-full ${
            isSeamlessUp ? 'seamless-up-next' : 'seamless-down-next'
          }`}>
            {currentChild}
          </div>
        </>
      ) : (
        <div 
          ref={currentSlideRef}
          className="w-full h-full transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-auto scroll-smooth custom-scroll buttery-smooth-scroll"
          onScroll={() => {
            // Update scroll permissions when user scrolls
            if (currentSlideRef.current) {
              const element = currentSlideRef.current;
              const canScrollUp = element.scrollTop > scrollThreshold;
              const canScrollDown = element.scrollTop < (element.scrollHeight - element.clientHeight - scrollThreshold);
              
              setCanScrollToPrev(canScrollUp);
              setCanScrollToNext(canScrollDown);
            }
          }}
        >
          {currentChild}
        </div>
      )}
      {showAboutCrossfade && (
        <div 
          className={`pointer-events-none absolute inset-0 z-40`}
          style={{ 
            background: '#000', 
            opacity: aboutCrossfadeFadeOut ? 0 : (aboutCrossfadeOpaque ? 1 : 0),
            transition: 'opacity 700ms ease-out', 
            willChange: 'opacity' 
          }}
        />
      )}

      {/* Banner-style transition overlay (disabled for seamless transitions) */}
      {isTransitioning && !isSeamless && (
        <div 
          className={`absolute inset-0 z-30 pointer-events-none ${
            transitionDirection === 'up' 
              ? 'banner-transition-up' 
              : 'banner-transition-down'
          }`}
        />
      )}

          {/* BaFT Coin pinned indicator */}
    {baftCoinPinned && slideIndex === 1 && (
      <div className="absolute top-8 right-8 z-50 pointer-events-none">
        <div className="bg-blue-500/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-medium shadow-lg">
          BaFT Coin Exit Animations
        </div>
      </div>
    )}

    {/* BInstant pinned indicator */}
    {binstantPinned && slideIndex === 2 && (
      <div className="absolute top-8 right-8 z-50 pointer-events-none">
        <div className="bg-green-500/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-medium shadow-lg">
          BInstant Exit Animations
        </div>
      </div>
    )}


    </div>
  );
};

export default SlideContainer;