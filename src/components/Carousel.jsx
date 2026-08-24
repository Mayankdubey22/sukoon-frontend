import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Carousel({ items, renderItem }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragMoved = useRef(false);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkArrows);
    window.addEventListener('resize', checkArrows);
    return () => {
      el.removeEventListener('scroll', checkArrows);
      window.removeEventListener('resize', checkArrows);
    };
  }, [items]);

  const scrollByAmount = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild ? el.firstChild.offsetWidth + 20 : 200; // + gap
    el.scrollBy({ left: direction * cardWidth * 4, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
    trackRef.current.classList.add('dragging');
  };

  const stopDragging = () => {
    isDragging.current = false;
    trackRef.current?.classList.remove('dragging');
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) dragMoved.current = true;
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  // Prevent click-to-play from firing right after a drag
  const handleClickCapture = (e) => {
    if (dragMoved.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="carousel-wrapper">
      {showLeftArrow && (
        <button className="carousel-arrow left" onClick={() => scrollByAmount(-1)}>
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        className="carousel-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
      >
        {items.map((item, i) => renderItem(item, i))}
      </div>

      {showRightArrow && (
        <button className="carousel-arrow right" onClick={() => scrollByAmount(1)}>
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

export default Carousel;