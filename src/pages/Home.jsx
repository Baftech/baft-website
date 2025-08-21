import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import SlideContainer from "../components/Themes/SlideContainer";
import HeroSlide from "../components/Herosection/HeroSlide";
import BaFTCoinSlide from "../components/Herosection/BaFTCoinSlide";
import BInstantSection from "../components/Herosection/BInstantSection";
import B_Fast from "../components/Mainsection/B_Fast";
import Cards from "../components/Mainsection/Features";

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

      {/* PowerPoint-style slide system - now with 5 slides */}
      <SlideContainer currentSlide={currentSlide} onSlideChange={handleSlideChange}>
        <HeroSlide />
        <BaFTCoinSlide />
        <BInstantSection />
        <B_Fast />
        <Cards />
      </SlideContainer>
    </div>
  );
};

export default Home;
