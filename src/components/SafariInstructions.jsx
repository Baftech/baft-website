import React, { useState, useEffect } from 'react';

const SafariInstructions = ({ show = false, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari
    const safari = typeof navigator !== 'undefined' && 
                   /safari/i.test(navigator.userAgent) && 
                   !/chrome|crios|fxios|android/i.test(navigator.userAgent);
    setIsSafari(safari);
  }, []);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isSafari || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 mx-4 max-w-sm shadow-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Hide Safari Tab Bar
          </h3>
          <div className="text-sm text-gray-600 space-y-2 text-left">
            <p>To hide Safari's tab bar while scrolling:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Tap the <strong>"aA"</strong> icon in the address bar</li>
              <li>Select <strong>"Hide Toolbar"</strong></li>
              <li>The tab bar will stay hidden while scrolling</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              This gives you more screen space for the slides.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Got it!
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariInstructions;
