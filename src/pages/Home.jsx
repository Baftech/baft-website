import React, { useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import B_Fast from "../components/Mainsection/B_Fast";
import Features from "../components/Mainsection/Features";
import Videocomponent from "../components/Aboutsection/Videocomponent";
import SafeSecure from "../components/Mainsection/SafeSecure";
import About from "../components/Aboutsection/About";
import Pre_footer from "../components/Footer/Pre_footer";
import Footer from "../components/Footer/Footer";
import SlideContainer from "../components/Themes/SlideContainer";
import HeroSlide from "../components/Herosection/HeroSlide";
import BaFTCoinSlide from "../components/Herosection/BaFTCoinSlide";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* PowerPoint-style slide system for all sections */}
      <SlideContainer currentSlide={currentSlide} onSlideChange={handleSlideChange}>
        <HeroSlide />
        <BaFTCoinSlide />
        <B_Fast />
        <Features />
        <Videocomponent />
        <SafeSecure />
        <About />
        <Pre_footer />
        <Footer />
      </SlideContainer>
    </div>
  );
};

export default Home;
