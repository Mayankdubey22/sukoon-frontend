import React from 'react';
import { usePlayer } from '../PlayerContext';

const decodeHtml = (text = '') => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function NowPlayingSidebar() {
  const {
    currentSong,
    queue,
    currentIndex,
    playQueue,
    sourceName,
  } = usePlayer();

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!currentSong) {
    return (
      <aside
        className="
          hidden
          h-fit
          w-[280px]
          shrink-0
          self-start
          border-l
          border-white/10
          bg-[#181818]
          px-5
          py-6
          text-gray-400
          lg:block
          xl:w-[300px]
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            text-center
          "
        >
          <p className="text-sm">
            Nothing playing right now
          </p>
        </div>
      </aside>
    );
  }

  /* =====================================================
     CURRENT SONG
  ===================================================== */

  const currentSongName = decodeHtml(
    currentSong.name ||
      currentSong.title ||
      'Unknown Song'
  );

  const currentArtist = decodeHtml(
    currentSong.artists?.primary
      ?.map((artist) => artist.name)
      .join(', ') ||
      currentSong.primaryArtists ||
      ''
  );

  const currentImage =
    currentSong.image?.[2]?.url ||
    currentSong.image?.[1]?.url ||
    currentSong.image?.[0]?.url;

  /* =====================================================
     UPCOMING QUEUE
  ===================================================== */

  const upcoming =
    Array.isArray(queue) &&
    currentIndex >= 0
      ? queue.slice(currentIndex + 1)
      : [];

  /* =====================================================
     PLAY QUEUED SONG
  ===================================================== */

  const handleQueueSongClick = (index) => {
    if (
      !Array.isArray(queue) ||
      queue.length === 0
    ) {
      return;
    }

    playQueue(queue, index);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <aside
      className="
        hidden
        h-fit
        w-[280px]
        shrink-0
        self-start
        border-l
        border-white/10
        bg-[#181818]
        px-4
        py-5
        lg:block
        xl:w-[300px]
        [scrollbar-width:none]
        [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      {/* =================================================
          CURRENTLY PLAYING
      ================================================= */}

      <div className="mb-6">
        {/* Artwork */}

        {currentImage ? (
          <img
            src={currentImage}
            alt={currentSongName}
            className="
              aspect-square
              w-full
              rounded-xl
              object-cover
              shadow-2xl
            "
          />
        ) : (
          <div
            className="
              flex
              aspect-square
              w-full
              items-center
              justify-center
              rounded-xl
              bg-[#242424]
              text-5xl
              text-gray-500
            "
          >
            ♪
          </div>
        )}

        {/* Song Name */}

        <h3
          className="
            mt-4
            truncate
            text-lg
            font-semibold
            text-white
          "
          title={currentSongName}
        >
          {currentSongName}
        </h3>

        {/* Artist */}

        {currentArtist && (
          <p
            className="
              mt-1
              truncate
              text-sm
              text-gray-400
            "
            title={currentArtist}
          >
            {currentArtist}
          </p>
        )}

        {/* Source */}

        {sourceName && (
          <p
            className="
              mt-2
              truncate
              text-xs
              text-gray-500
            "
            title={`Playing from ${decodeHtml(sourceName)}`}
          >
            Playing from {decodeHtml(sourceName)}
          </p>
        )}
      </div>

      {/* =================================================
          QUEUE TITLE
      ================================================= */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
        "
      >
        <h4
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          Next Up
        </h4>

        {upcoming.length > 0 && (
          <span
            className="
              rounded-full
              bg-white/10
              px-2
              py-0.5
              text-[10px]
              text-gray-400
            "
          >
            {upcoming.length}
          </span>
        )}
      </div>

      {/* =================================================
          QUEUE
      ================================================= */}

      <div className="space-y-1">
        {upcoming.length === 0 ? (
          <div
            className="
              rounded-lg
              bg-white/[0.03]
              px-3
              py-4
              text-center
            "
          >
            <p className="text-xs text-gray-500">
              No more songs in queue
            </p>
          </div>
        ) : (
          upcoming.map((song, index) => {
            const songName = decodeHtml(
              song.name ||
                song.title ||
                'Unknown Song'
            );

            const artistName = decodeHtml(
              song.primaryArtists ||
                song.artists?.primary
                  ?.map(
                    (artist) =>
                      artist.name
                  )
                  .join(', ') ||
                ''
            );

            const imageUrl =
              song.image?.[2]?.url ||
              song.image?.[1]?.url ||
              song.image?.[0]?.url;

            return (
              <button
                key={`${
                  song.id ||
                  songName
                }-${index}`}
                type="button"
                onClick={() =>
                  handleQueueSongClick(
                    currentIndex +
                      1 +
                      index
                  )
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  p-2
                  text-left
                  transition-colors
                  duration-200
                  hover:bg-white/10
                  active:bg-white/15
                "
              >
                {/* Song Artwork */}

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={songName}
                    loading="lazy"
                    className="
                      h-11
                      w-11
                      shrink-0
                      rounded-md
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      bg-[#242424]
                      text-lg
                      text-gray-500
                    "
                  >
                    ♪
                  </div>
                )}

                {/* Song Information */}

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-gray-200
                      transition-colors
                      group-hover:text-white
                    "
                    title={songName}
                  >
                    {songName}
                  </p>

                  {artistName && (
                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-gray-500
                        group-hover:text-gray-400
                      "
                      title={artistName}
                    >
                      {artistName}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default NowPlayingSidebar;