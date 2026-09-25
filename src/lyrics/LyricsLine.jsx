import React from 'react';

const LyricsLine = ({
  text,
  isActive = false,
  onClick,
}) => {
  // Don't render completely empty lyric lines
  if (!text?.trim()) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        block w-full text-center
        px-2 py-1.5
        transition-all duration-300 ease-out
        cursor-pointer
        ${
          isActive
            ? 'text-white text-lg sm:text-xl font-semibold opacity-100 scale-[1.01]'
            : 'text-white/40 text-base sm:text-lg font-medium opacity-70 hover:text-white/70'
        }
      `}
    >
      {text}
    </button>
  );
};

export default LyricsLine;