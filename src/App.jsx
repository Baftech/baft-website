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

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    setIsAppLoaded(true);
    document.documentElement.style.overflow = '';
  };

  // Prevent scroll while loading
  useEffect(() => {
    if (!isAppLoaded) {
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isAppLoaded]);

  return (
    <>
      {!isAppLoaded && (
        <div className={`preloader-wrapper ${isAppLoaded ? 'preloader-hidden' : ''}`}>
          <Preloader onComplete={handlePreloaderComplete} />
        </div>
      )}
      {isAppLoaded && (
        <div>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;