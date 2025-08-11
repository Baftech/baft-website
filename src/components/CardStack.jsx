"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval;

export const CardStack = ({ items = [], offset, scaleFactor }) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    // Update cards if items change (API or props update)
    if (Array.isArray(items) && items.length > 0) {
      setCards(items);
    }
  }, [items]);

  useEffect(() => {
    if (cards.length > 0) {
      startFlipping();
    }
    return () => clearInterval(interval);
  }, [cards]);

  const startFlipping = () => {
    clearInterval(interval); // prevent multiple intervals
    interval = setInterval(() => {
      setCards((prevCards) => {
        if (!Array.isArray(prevCards) || prevCards.length === 0) return prevCards;
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()); // move last to front
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.length > 0 ? (
        cards.map((card, index) => (
          <motion.div
            key={card.id || index}
            className="absolute  h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 flex flex-col justify-between"
            style={{ transformOrigin: "top center" }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div >
              {card.content}
            </div>
            
          </motion.div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No cards available
        </div>
      )}
    </div>
  );
};
