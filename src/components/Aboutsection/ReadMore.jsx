import React, { useState } from "react";

const ReadMore = ({ content, maxLength = 150, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = content.length > maxLength;

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState);
  };

  // Decide which text to show
  const textToShow = isExpanded || !isLong ? content : content.slice(0, maxLength) + "...";

  // Split text into paragraphs based on newlines
  const paragraphs = textToShow.split(/\n+/);

  return (
    <div>
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-4 leading-relaxed text-gray-700 text-lg" style={{ lineHeight: 1.8 }}>
          {para}
        </p>
      ))}

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-2 text-blue-700 hover:text-blue-900 font-medium text-sm"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
