import React, { useState } from "react";

const ReadMoreText = ({
  content,
  maxLength = 150,
  className = "",
  buttonClassName = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const isLong = content.length > maxLength;
  const textToShow = isExpanded || !isLong ? content : content.slice(0, maxLength) + "...";

  return (
    <div className={className}>
      <p className="text-sm text-gray-600 leading-relaxed pr-2">{textToShow}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-3 text-sm font-medium text-[rgba(25,102,187,1)] hover:text-blue-700 transition-colors duration-200 focus:outline-none ${buttonClassName}`}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
