import React, { useState, useEffect } from "react";
import {Navbar} from "../components/Navbar/Navbar";
import SlideContainer from "../components/Themes/SlideContainer";
import HeroSlide from "../components/Herosection/HeroSlide";
import BaFTCoinSlide from "../components/Herosection/BaFTCoinSlide";
import BInstantSection from "../components/Herosection/BInstantSection";
import B_Fast from "../components/Mainsection/B_Fast";
import Cards from "../components/Mainsection/Features";
// import Videocomponent from "../components/Aboutsection/Videocomponent";
import SafeSecure from "../components/Mainsection/SafeSecure";
import Pre_footer from "../components/Footer/Pre_footer";
import Footer from "../components/Footer/Footer";
import AboutBaft from "../components/Aboutsection/About";
import CombinedFooter from "../components/Footer/CombinedFooter";
import { preloadLinkHints } from "../assets/preloader";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Add early preload hints for above-the-fold hero and features assets
    const remove = preloadLinkHints([
      "/logo.png",
      "/baft_card1.svg",
      "/baft_card2.svg",
      "/baft_card3.svg",
      "/baft_card4.svg",
    ]);
    return () => { try { remove(); } catch {} };
  }, []);

  // Preload manifest per slide (indices must match SlideContainer children order)
  const preloadManifestBySlide = {
    0: { images: ["/logo.png", "/headline.png"] },
    1: { images: ["/b-coin.svg", "/b-coin-1.svg", "/b-coin-2.svg", "/b-coin-3.svg"] },
    2: { videos: ["/bfast_video.mp4", "/bfast_video_mobile.mp4"] },
    3: { images: ["/manage-account.svg", "/pay-bills.svg", "/seamless-payments.svg"] },
    4: { images: ["/baft_card1.svg", "/baft_card2.svg", "/baft_card3.svg", "/baft_card4.svg"] },
    5: { images: ["/safe_sec.svg"] },
    6: { images: ["/aboutus.svg"] },
  };

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        currentSlide={currentSlide}
        onNavigate={(target, opts = {}) => {
          // Map named targets to slide indices
          // 0: Hero, 1: BaFTCoin, 2: BInstant, 3: B_Fast, 4: Features, 5: SafeSecure, 6: About, 7: Footer
          const slow = Boolean(opts.slow);
          const instant = Boolean(opts.instant);
          
          const dispatchNav = (index) => {
            try {
              const evt = new CustomEvent('navigateToSlide', { detail: { index, slow, instant } });
              window.dispatchEvent(evt);
            } catch {
              setCurrentSlide(index);
            }
          };

          if (target === 'hero') {
            if (instant) {
              // Instant navigation - set slide immediately
              setCurrentSlide(0);
            } else {
              // Normal navigation
              dispatchNav(0);
            }
            return;
          }
          if (target === 'about') {
            dispatchNav(6);
            return;
          }
        }}
      />

      {/* PowerPoint-style slide system - now with 9 slides */}
      <SlideContainer currentSlide={currentSlide} onSlideChange={handleSlideChange} preloadManifestBySlide={preloadManifestBySlide}>
        {/* Slide 1: Hero Section */}
        <HeroSlide />
        {/* Slide 2: BaFT Coin Section */}
        <BaFTCoinSlide />
        {/* Slide 3: B Instant Section */}
        <BInstantSection />
        {/* Slide 4: B Fast Section */}
        <B_Fast />
        {/* Slide 5: Features/Cards Section */}
        <Cards />
        {/* Slide 6: Video Component
        <Videocomponent slide /> */}
        {/* Slide 8: Safe & Secure Section */}
        <SafeSecure />
        {/* Slide 9: Pre-footer */}
        <AboutBaft />
        <CombinedFooter />
      </SlideContainer>
      
      {/* Footer - placed outside SlideContainer to be always visible */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
