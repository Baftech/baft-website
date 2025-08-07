import React from 'react'

import Dark_Navbar from './components/Dark_Navbar';
import B_Fast from './components/B_Fast';
import Home from './components/Home'
import GridBackground from './components/GridBackground'
import B_coin from './components/B_coin'
import B_Instant from './components/B_Instant'
import Features from './components/Features';
import Video_Component from './components/Video_Component';
import VideoPlayer from './components/VideoPlayer';
import SecurityCard from './components/SecurityCard';
import About from './components/About';
import Footer from './components/Footer';



const App = () => {
  
   return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Dark_Navbar />
      
      <main className="w-full">
        <Home />
        <B_coin />
        <B_Instant />
        <B_Fast />
        <Features/>
        <Video_Component />
        <VideoPlayer />
        <SecurityCard />
        <About />
        <Footer />
      </main>
    </div>
  )
}

export default App
