import React, { useRef, useEffect } from "react";

const VideoExpanded = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const play = () => {
      videoRef.current
        .play()
        .catch(() => {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        });
    };
    // Attempt autoplay on mount
    play();
  }, []);

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-white"
      data-theme="light"
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full max-w-6xl h-full rounded-3xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-3xl"
            src="/BAFT Vid 2_1.mp4"
            poster="/video_com.png"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default VideoExpanded;


