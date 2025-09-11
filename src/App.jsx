import { BrowserRouter, Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { useEffect, useState } from "react";
import safariViewportHandler from "./safari-viewport-handler";
import Preloader from "./components/Preloader";

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Safari-specific fixes
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // Add Safari-specific classes to body
      document.body.classList.add('safari-browser');
      
      // Fix for Safari's handling of viewport units
      function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
    }
  }, []);

  // Preloader: wait until all assets have loaded
  useEffect(() => {
    const handleLoad = () => {
      // Give a short delay for nicer fade-out
      setTimeout(() => setIsAppLoaded(true), 150);
    };
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }
    // Prevent scroll while loading
    if (!isAppLoaded) {
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('load', handleLoad);
      document.documentElement.style.overflow = '';
    };
  }, [isAppLoaded]);

  return (
    <>
      {!isAppLoaded && (
        <div className={`preloader-wrapper ${isAppLoaded ? 'preloader-hidden' : ''}`}>
          <Preloader />
        </div>
      )}
      <div aria-hidden={!isAppLoaded} style={{ visibility: isAppLoaded ? 'visible' : 'hidden' }}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;