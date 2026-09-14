import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

function Carousel({
  items = [],
  renderItem,
}) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragMoved = useRef(false);

  const [showLeftArrow, setShowLeftArrow] =
    useState(false);

  const [showRightArrow, setShowRightArrow] =
    useState(true);

  /* =====================================================
     CHECK ARROWS
  ===================================================== */

  const checkArrows = () => {
    const el = trackRef.current;

    if (!el) return;

    setShowLeftArrow(
      el.scrollLeft > 5
    );

    setShowRightArrow(
      el.scrollLeft + el.clientWidth <
        el.scrollWidth - 5
    );
  };

  /* =====================================================
     SCROLL / RESIZE
  ===================================================== */

  useEffect(() => {
    const el = trackRef.current;

    if (!el) return;

    checkArrows();

    el.addEventListener(
      'scroll',
      checkArrows
    );

    window.addEventListener(
      'resize',
      checkArrows
    );

    return () => {
      el.removeEventListener(
        'scroll',
        checkArrows
      );

      window.removeEventListener(
        'resize',
        checkArrows
      );
    };
  }, [items]);

  /* =====================================================
     ARROW SCROLL
  ===================================================== */

  const scrollByAmount = (direction) => {
    const el = trackRef.current;

    if (!el) return;

    const firstChild = el.firstElementChild;

    const cardWidth = firstChild
      ? firstChild.offsetWidth +
        parseFloat(
          getComputedStyle(el).columnGap ||
            getComputedStyle(el).gap ||
            0
        )
      : 200;

    el.scrollBy({
      left:
        direction *
        cardWidth *
        (window.innerWidth < 640 ? 2 : 4),
      behavior: 'smooth',
    });
  };

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const handleMouseDown = (event) => {
    const el = trackRef.current;

    if (!el) return;

    isDragging.current = true;
    dragMoved.current = false;

    startX.current =
      event.pageX -
      el.offsetLeft;

    scrollLeftStart.current =
      el.scrollLeft;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (event) => {
    const el = trackRef.current;

    if (
      !isDragging.current ||
      !el
    ) {
      return;
    }

    event.preventDefault();

    const x =
      event.pageX -
      el.offsetLeft;

    const walk =
      (x - startX.current) * 1.5;

    if (Math.abs(walk) > 5) {
      dragMoved.current = true;
    }

    el.scrollLeft =
      scrollLeftStart.current -
      walk;
  };

  /* =====================================================
     PREVENT CLICK AFTER DRAG
  ===================================================== */

  const handleClickCapture = (event) => {
    if (!dragMoved.current) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    dragMoved.current = false;
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="relative w-full">
      {/* =================================================
          LEFT ARROW
      ================================================= */}

      {showLeftArrow && (
        <button
          type="button"
          onClick={() =>
            scrollByAmount(-1)
          }
          className="
            absolute
            left-1
            sm:left-2
            top-1/2
            z-10
            flex
            h-8
            w-8
            sm:h-10
            sm:w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/70
            text-white
            shadow-lg
            backdrop-blur-sm
            transition-all
            duration-200
            hover:scale-105
            hover:bg-black/90
            active:scale-95
          "
          aria-label="Scroll left"
        >
          <ChevronLeft
            className="
              h-4
              w-4
              sm:h-5
              sm:w-5
            "
          />
        </button>
      )}

      {/* =================================================
          CAROUSEL TRACK
      ================================================= */}

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
        className="
          flex
          w-full
          gap-3
          sm:gap-4
          lg:gap-5
          overflow-x-auto
          overflow-y-hidden
          scroll-smooth
          select-none
          cursor-grab
          active:cursor-grabbing
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {(items || []).map(
          (item, index) =>
            renderItem(
              item,
              index
            )
        )}
      </div>

      {/* =================================================
          RIGHT ARROW
      ================================================= */}

      {showRightArrow && (
        <button
          type="button"
          onClick={() =>
            scrollByAmount(1)
          }
          className="
            absolute
            right-1
            sm:right-2
            top-1/2
            z-10
            flex
            h-8
            w-8
            sm:h-10
            sm:w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/70
            text-white
            shadow-lg
            backdrop-blur-sm
            transition-all
            duration-200
            hover:scale-105
            hover:bg-black/90
            active:scale-95
          "
          aria-label="Scroll right"
        >
          <ChevronRight
            className="
              h-4
              w-4
              sm:h-5
              sm:w-5
            "
          />
        </button>
      )}
    </div>
  );
}

export default Carousel;