import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Trash2,
  Play,
  Heart,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';

import { useLibrary } from '../LibraryContext';
import { usePlayer } from '../PlayerContext';

/* =========================================================
   DECODE HTML
========================================================= */

const decodeHtml = (text = '') => {
  const txt =
    document.createElement('textarea');

  txt.innerHTML = text;

  return txt.value;
};

/* =========================================================
   LIKED SONGS PAGE
========================================================= */

function LikedSongsPage() {
  const {
    likedSongs,
    toggleLike,
    libraryLoaded,
  } = useLibrary();

  const {
    playQueue,
    currentSong,
  } = usePlayer();

  const navigate = useNavigate();

  /* =======================================================
     PLAY ALL
  ======================================================= */

  const handlePlayAll = () => {
    if (likedSongs.length === 0) {
      return;
    }

    playQueue(
      likedSongs,
      0,
      'Liked Songs'
    );
  };

  /* =======================================================
     PLAY SINGLE SONG
  ======================================================= */

  const handlePlaySong = (index) => {
    playQueue(
      likedSongs,
      index,
      'Liked Songs'
    );
  };

  /* =======================================================
     REMOVE SONG
  ======================================================= */

  const handleRemoveSong = (song) => {
    if (!song?.id) {
      return;
    }

    const songName = decodeHtml(
      song.name ||
        song.title ||
        'this song'
    );

    const shouldRemove =
      window.confirm(
        `Remove "${songName}" from Liked Songs?`
      );

    if (shouldRemove) {
      toggleLike(song);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!libraryLoaded) {
    return (
      <div
        className="
          flex
          min-h-full
          flex-col
          items-center
          justify-center
          gap-3
          bg-black
          px-5
          py-10
          text-white
        "
      >
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-white/20
            border-t-white
          "
        />

        <p
          className="
            text-sm
            text-white/60
          "
        >
          Loading your library...
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-full
        min-w-0
        bg-black
        text-white
      "
    >
      {/* =================================================
          TOP BAR
      ================================================= */}

      <header
        className="
          sticky
          top-0
          z-20
          flex
          h-14
          items-center
          justify-between
          border-b
          border-white/5
          bg-black/90
          px-3
          backdrop-blur-md
          sm:h-16
          sm:px-6
        "
      >
        <button
          type="button"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white/70
            transition-all
            duration-200
            hover:bg-white/10
            hover:text-white
            active:scale-95
          "
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>

        <h2
          className="
            min-w-0
            truncate
            px-3
            text-base
            font-semibold
            tracking-tight
            sm:px-4
            sm:text-xl
          "
        >
          Liked Songs
        </h2>

        <button
          type="button"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white/60
            transition-all
            duration-200
            hover:bg-white/10
            hover:text-white
            active:scale-95
          "
          aria-label="More options"
        >
          <MoreVertical size={21} />
        </button>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          px-4
          pb-5
          pt-6
          sm:px-6
          sm:pb-6
          sm:pt-8
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            items-center
            gap-4
            sm:flex-row
            sm:gap-6
            md:gap-7
          "
        >
          {/* =================================================
              ART
          ================================================= */}

          <div
            className="
              flex
              h-28
              w-28
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-purple-500
              via-indigo-500
              to-blue-600
              shadow-2xl
              shadow-purple-900/20
              sm:h-36
              sm:w-36
              md:h-40
              md:w-40
            "
          >
            <Heart
              size={58}
              fill="currentColor"
              strokeWidth={1.6}
              className="
                text-white
                sm:h-[68px]
                sm:w-[68px]
                md:h-[72px]
                md:w-[72px]
              "
            />
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              min-w-0
              w-full
              flex-1
              text-center
              sm:w-auto
              sm:text-left
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                tracking-[0.18em]
                text-white/50
                sm:text-xs
              "
            >
              PLAYLIST
            </span>

            <h1
              className="
                mt-1
                line-clamp-2
                text-2xl
                font-bold
                leading-tight
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Liked Songs
            </h1>

            <p
              className="
                mt-2
                text-xs
                text-white/50
                sm:text-sm
              "
            >
              {likedSongs.length}{' '}
              {likedSongs.length === 1
                ? 'song'
                : 'songs'}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <section
        className="
          flex
          items-center
          gap-3
          border-b
          border-white/5
          px-3
          py-2.5
          sm:gap-4
          sm:px-6
          sm:py-3
        "
      >
        <button
          type="button"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            text-green-500
            transition-all
            duration-200
            hover:bg-white/5
            hover:text-green-400
            active:scale-95
            sm:h-11
            sm:w-11
          "
          aria-label="Liked"
        >
          <Heart
            size={21}
            fill="currentColor"
          />
        </button>

        {likedSongs.length > 0 && (
          <button
            type="button"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-500
              text-black
              shadow-lg
              shadow-green-500/20
              transition-all
              duration-200
              hover:scale-105
              hover:bg-green-400
              active:scale-95
              sm:h-12
              sm:w-12
            "
            onClick={handlePlayAll}
            aria-label="Play all liked songs"
          >
            <Play
              size={21}
              fill="currentColor"
              className="sm:h-[23px] sm:w-[23px]"
            />
          </button>
        )}
      </section>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {likedSongs.length === 0 ? (
        <section
          className="
            flex
            min-h-[350px]
            flex-col
            items-center
            justify-center
            px-5
            py-16
            text-center
            sm:min-h-[400px]
            sm:px-6
            sm:py-24
          "
        >
          <div
            className="
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-white/5
              text-white/40
            "
          >
            <Heart
              size={42}
              strokeWidth={1.6}
            />
          </div>

          <h2
            className="
              text-xl
              font-semibold
              sm:text-2xl
            "
          >
            No liked songs yet
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-white/50
            "
          >
            Songs you like will appear here.
          </p>

          <button
            type="button"
            className="
              mt-6
              rounded-full
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-black
              transition-all
              duration-200
              hover:bg-white/90
              active:scale-95
            "
            onClick={() => navigate('/')}
          >
            Find something to listen to
          </button>
        </section>
      ) : (
        /* =================================================
           SONG LIST
        ================================================= */

        <section
          className="
            min-w-0
            px-2
            pb-28
            sm:px-4
            sm:pb-24
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
            {likedSongs.map(
              (song, index) => {
                if (!song?.id) {
                  return null;
                }

                const songName =
                  decodeHtml(
                    song.name ||
                      song.title ||
                      'Unknown Song'
                  );

                const artistName =
                  song.artists
                    ?.primary
                    ?.map(
                      (artist) =>
                        artist.name
                    )
                    .join(', ') ||
                  song.primaryArtists ||
                  'Unknown Artist';

                const decodedArtistName =
                  decodeHtml(
                    artistName
                  );

                const imageUrl =
                  song.image?.[2]?.url ||
                  song.image?.[1]?.url ||
                  song.image?.[0]?.url ||
                  '';

                const isPlaying =
                  currentSong?.id ===
                  song.id;

                return (
                  <div
                    key={song.id}
                    className={`
                      group
                      flex
                      min-w-0
                      items-center
                      gap-2
                      rounded-lg
                      px-2
                      py-2
                      transition-all
                      duration-200
                      sm:gap-4
                      sm:px-3
                      ${
                        isPlaying
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                      }
                    `}
                  >
                    {/* =================================================
                        SONG CONTENT
                    ================================================= */}

                    <div
                      className="
                        flex
                        min-w-0
                        flex-1
                        cursor-pointer
                        items-center
                        gap-3
                        sm:gap-4
                      "
                      onClick={() =>
                        handlePlaySong(
                          index
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                            'Enter' ||
                          event.key === ' '
                        ) {
                          event.preventDefault();

                          handlePlaySong(
                            index
                          );
                        }
                      }}
                    >
                      {/* =================================================
                          COVER
                      ================================================= */}

                      <div
                        className="
                          relative
                          h-11
                          w-11
                          shrink-0
                          overflow-hidden
                          rounded-md
                          bg-white/5
                          sm:h-14
                          sm:w-14
                        "
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={songName}
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-white/40
                            "
                          >
                            <Heart
                              size={21}
                              fill="currentColor"
                            />
                          </div>
                        )}

                        {/* PLAYING ANIMATION */}

                        {isPlaying && (
                          <div
                            className="
                              absolute
                              inset-0
                              flex
                              items-end
                              justify-center
                              gap-[3px]
                              bg-black/35
                              pb-2
                            "
                          >
                            <span
                              className="
                                h-3
                                w-[3px]
                                animate-pulse
                                rounded-full
                                bg-white
                              "
                            />

                            <span
                              className="
                                h-5
                                w-[3px]
                                animate-pulse
                                rounded-full
                                bg-white
                                [animation-delay:150ms]
                              "
                            />

                            <span
                              className="
                                h-4
                                w-[3px]
                                animate-pulse
                                rounded-full
                                bg-white
                                [animation-delay:300ms]
                              "
                            />
                          </div>
                        )}
                      </div>

                      {/* =================================================
                          INFORMATION
                      ================================================= */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className={`
                            truncate
                            text-sm
                            font-medium
                            sm:text-base
                            ${
                              isPlaying
                                ? 'text-green-400'
                                : 'text-white'
                            }
                          `}
                          title={songName}
                        >
                          {songName}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-white/50
                            sm:mt-1
                            sm:text-sm
                          "
                          title={
                            decodedArtistName
                          }
                        >
                          {
                            decodedArtistName
                          }
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        REMOVE
                    ================================================= */}

                    <button
                      type="button"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-white/40
                        transition-all
                        duration-200
                        hover:bg-red-400/10
                        hover:text-red-400
                        active:scale-95
                        sm:h-10
                        sm:w-10
                      "
                      onClick={() =>
                        handleRemoveSong(
                          song
                        )
                      }
                      aria-label={`Remove ${songName}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default LikedSongsPage;