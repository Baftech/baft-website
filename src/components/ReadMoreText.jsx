import React, { useState } from "react";

const ReadMoreText = ({ 
  text, 
  maxLength = 150, 
  className = "",
  buttonClassName = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldShowButton = text.length > maxLength;
  const displayText = isExpanded ? text : text.slice(0, maxLength);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div id="readmore" data-theme="light" className={className}>
      <p className="text-sm text-gray-600 leading-relaxed pr-2">
        {displayText}
        {!isExpanded && shouldShowButton && "..."}
      </p>
      
      {shouldShowButton && (
        <button
          onClick={toggleExpanded}
          className={`mt-3 text-sm font-medium text-[rgba(25,102,187,1)] hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded ${buttonClassName}`}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
