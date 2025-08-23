import React, { useState, useEffect } from "react";
import {Navbar} from "../components/Navbar/Navbar";
import SlideContainer from "../components/Themes/SlideContainer";
import HeroSlide from "../components/Herosection/HeroSlide";
import BaFTCoinSlide from "../components/Herosection/BaFTCoinSlide";
import BInstantSection from "../components/Herosection/BInstantSection";
import B_Fast from "../components/Mainsection/B_Fast";
import Cards from "../components/Mainsection/Features";
import Videocomponent from "../components/Aboutsection/Videocomponent";
import SafeSecure from "../components/Mainsection/SafeSecure";
import Pre_footer from "../components/Footer/Pre_footer";
import Footer from "../components/Footer/Footer";
import AboutBaft from "../components/Aboutsection/About";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Preload Features slide assets to avoid delay when entering slide 5
    const sources = [
      "/baft_card1.svg",
      "/baft_card2.svg",
      "/baft_card3.svg",
      "/baft_card4.svg",
    ];
    const imgs = sources.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
    return () => { imgs.forEach((img) => (img.src = "")); };
  }, []);

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen">
      <Navbar currentSlide={currentSlide} />

      {/* PowerPoint-style slide system - now with 9 slides */}
      <SlideContainer currentSlide={currentSlide} onSlideChange={handleSlideChange}>
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
        {/* Slide 6: Video Component */}
        <Videocomponent slide />
        {/* Slide 8: Safe & Secure Section */}
        <SafeSecure />
        {/* Slide 9: Pre-footer */}
        {/* <AboutBaft /> */}
        <Pre_footer/>
      </SlideContainer>
      
      {/* Footer - placed outside SlideContainer to be always visible */}
      <Footer />
    </div>
  );
};

export default Home;
