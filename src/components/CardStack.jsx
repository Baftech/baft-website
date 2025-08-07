import React, { useEffect, useRef } from 'react';
import { ScrollObserver, valueAtPercentage } from './aat';

const CardStack = ({ cardsData }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current;

    if (!container || cards.length === 0) return;

    container.style.setProperty('--cards-count', cards.length);
    container.style.setProperty('--card-height', `${cards[0].clientHeight}px`);

    cards.forEach((card, index) => {
      const offsetTop = 20 + index * 20;
      card.style.paddingTop = `${offsetTop}px`;

      if (index === cards.length - 1) return;

      const toScale = 1 - (cards.length - 1 - index) * 0.1;
      const nextCard = cards[index + 1];
      const cardInner = card.querySelector('.card__inner');

      ScrollObserver.Element(nextCard, {
        offsetTop,
        offsetBottom: window.innerHeight - card.clientHeight
      }).onScroll(({ percentageY }) => {
        cardInner.style.scale = valueAtPercentage({
          from: 1,
          to: toScale,
          percentage: percentageY
        });
        cardInner.style.filter = `brightness(${valueAtPercentage({
          from: 1,
          to: 0.6,
          percentage: percentageY
        })})`;
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="cards relative flex flex-col "
    >
      {cardsData.map((cardContent, index) => (
        <div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          className=" transition-transform duration-300"
        >
          <div className="card__inner p-4">{cardContent}</div>
        </div>
      ))}
    </div>
  );
};

export default CardStack;
