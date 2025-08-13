import React, {  useState } from "react";

const ReadMore = ({ content, maxLength = 320, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = content.length > maxLength;
  const safeMax = Math.max(0, Math.min(maxLength, content.length));

  const textToShow = isExpanded || !isLong
    ? content
    : content.substring(0, safeMax) + "...";

  const paragraphs = textToShow
    .split(/\n+/) // split on newlines
    .map((para) => para.trim())
    .filter((para) => para.length > 0); // remove empty

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState);
  };

  return (
    <div className="leading-relaxed pr-2">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="transition-all duration-1000 ease-out text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-[#909090] mb-6"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          {para}
        </p>
      ))}

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-2 transition-all duration-500 ease-out"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            width: "177px",
            height: "64px",
            borderRadius: "200px",
            backgroundColor: "#E3EDFF",
            color: "#092646",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#000000";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#E3EDFF";
            e.target.style.color = "#092646";
          }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};
export default ReadMore;