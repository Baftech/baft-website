import React from "react";
import Hero from "../components/Herosection/Hero";
import { Navbar } from "../components/Navbar/Navbar";
import B_Fast from "../components/Mainsection/B_Fast";
import Features from "../components/Mainsection/Features";
import Videocomponent from "../components/Aboutsection/Videocomponent";
import SafeSecure from "../components/Mainsection/SafeSecure";
import About from "../components/Aboutsection/About";
import Pre_footer from "../components/Footer/Pre_footer";
import Footer from "../components/Footer/Footer";
import HeroContainer from "../components/Herosection/HeroContainer";
import BaFT_Coin from "../components/Mainsection/BaFT_Coin";
import B_Instant from "../components/Mainsection/B_Instant";    
const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroContainer />
      <BaFT_Coin />
      <B_Instant />

      <main>
        <B_Fast />

        <Features />
        <Videocomponent />

        <SafeSecure />
        <About />
      </main>
      <footer>
        <Pre_footer />
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
