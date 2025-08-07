import React from "react";

const VideoPlayer = () => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-12">
      <div
        className="w-full max-w-[1258px] aspect-[1258/731.9] rounded-[63.44px] overflow-hidden"
      >
        <video
          className="w-full h-full object-cover"
          controls
          autoPlay={false}
          muted
          loop
        >
          <source src="/your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
