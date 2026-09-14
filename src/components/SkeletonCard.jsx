import React from 'react';

/* =========================================================
   SKELETON CARD
========================================================= */

export function SkeletonCard() {
  return (
    <div className="w-full">
      {/* =================================================
          SKELETON IMAGE
      ================================================= */}

      <div
        className="
          aspect-square
          w-full
          rounded-xl
          bg-zinc-800
          animate-pulse
        "
      />

      {/* =================================================
          SKELETON TITLE
      ================================================= */}

      <div
        className="
          mt-3
          h-4
          w-[80%]
          rounded-md
          bg-zinc-800
          animate-pulse
        "
      />

      {/* =================================================
          SKELETON SUBTITLE
      ================================================= */}

      <div
        className="
          mt-2
          h-3
          w-[50%]
          rounded-md
          bg-zinc-800
          animate-pulse
        "
      />
    </div>
  );
}

/* =========================================================
   SKELETON ROW
========================================================= */

export function SkeletonRow({
  count = 5,
}) {
  return (
    <div
      className="
        flex
        w-full
        gap-5
        overflow-hidden
      "
    >
      {Array.from({
        length: count,
      }).map((_, i) => (
        <div
          key={i}
          className="
            shrink-0

            /* PHONE
               Show roughly 1.3 cards */
            w-[70%]

            /* SMALL TABLET */
            sm:w-[42%]

            /* TABLET / SMALL LAPTOP */
            md:w-[30%]

            /* LAPTOP / DESKTOP
               Roughly 4 cards visible */
            lg:w-[22%]

            /* LARGE DESKTOP */
            xl:w-[21%]
          "
        >
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}