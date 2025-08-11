import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { GridBackground } from "../components/GridBackground";
import B_Instant from "../components/B_Instant";
import B_Fast from "../components/B_Fast";
import B_coin from "../components/B_coin";
import Features from "../components/Features";
import Video_Component from "../components/Video_Component";
import SecurityCard from "../components/SecurityCard";
import AboutBaft from "../components/AboutBaft";
import Footer from "../components/Footer";
import Banking_NE from "../components/Banking_NE";
export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* *Theme Toggle
      <ThemeToggle />
      {/* Background Effects */}
      <GridBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <HeroSection />
        <div className="bg-black py-24">
          <B_coin />
        </div>
        <div className="bg-black py-24">
          <B_Instant />
        </div>
        <B_Fast />

        <Features />

        <Video_Component />

        <SecurityCard />

        <AboutBaft />
      </main>

      {/* Footer */}
      <Banking_NE />
      <Footer />
    </div>
  );
};
