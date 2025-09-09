import { BrowserRouter, Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { useEffect } from "react";

function App() {
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
      
      // Fix for Safari's handling of scroll behavior
      document.documentElement.style.scrollBehavior = 'smooth';
      document.documentElement.style.webkitOverflowScrolling = 'touch';
    }
  }, []);

  return (
    <>
      
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;