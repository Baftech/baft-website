import React, { useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import SlideContainer from "../components/Themes/SlideContainer";
import HeroSlide from "../components/Herosection/HeroSlide";
import BaFTCoinSlide from "../components/Herosection/BaFTCoinSlide";
import BInstantSection from "../components/Herosection/BInstantSection";
import B_Fast from "../components/Mainsection/B_Fast";
import Cards from "../components/Mainsection/Features";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

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
