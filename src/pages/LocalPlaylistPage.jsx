import React from 'react';
import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import {
  Trash2,
  Trash,
  Play,
  Music,
  ArrowLeft,
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
   LOCAL PLAYLIST PAGE
========================================================= */

function LocalPlaylistPage() {
  const { id } = useParams();

  const {
    playlists,
    removeFromPlaylist,
    deletePlaylist,
    libraryLoaded,
  } = useLibrary();

  const {
    playQueue,
    currentSong,
  } = usePlayer();

  const navigate = useNavigate();

  /* =======================================================
     LOADING
  ======================================================= */

  if (!libraryLoaded) {
    return (
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          bg-black
          px-5
          py-10
          text-white
        "
      >
        <p className="text-sm text-white/60 sm:text-base">
          Loading playlist...
        </p>
      </div>
    );
  }

  /* =======================================================
     FIND PLAYLIST
  ======================================================= */

  const playlist = playlists.find(
    (item) => item.id === id
  );

  /* =======================================================
     PLAYLIST NOT FOUND
  ======================================================= */

  if (!playlist) {
    return (
      <div
        className="
          flex
          min-h-full
          flex-col
          bg-black
          px-5
          py-6
          text-white
          sm:px-6
          sm:py-8
        "
      >
        <h2
          className="
            mb-2
            text-xl
            font-semibold
            sm:text-2xl
          "
        >
          Playlist not found
        </h2>

        <p
          className="
            mb-6
            text-sm
            text-white/50
            sm:text-base
          "
        >
          This playlist may have been deleted.
        </p>

        <button
          type="button"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-black
            transition-all
            duration-200
            hover:bg-white/90
            active:scale-95
          "
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={17} />
          Go Home
        </button>
      </div>
    );
  }

  /* =======================================================
     PLAYLIST DATA
  ======================================================= */

  const playlistName =
    decodeHtml(
      playlist.name ||
        'Untitled playlist'
    );

  const songs =
    Array.isArray(playlist.songs)
      ? playlist.songs.filter(
          (song) => song?.id
        )
      : [];

  /* =======================================================
     DELETE PLAYLIST
  ======================================================= */

  const handleDeletePlaylist = () => {
    const shouldDelete =
      window.confirm(
        `Delete playlist "${playlistName}"? This cannot be undone.`
      );

    if (!shouldDelete) {
      return;
    }

    deletePlaylist(playlist.id);

    navigate('/');
  };

  /* =======================================================
     PLAY ALL
  ======================================================= */

  const handlePlayAll = () => {
    if (songs.length === 0) {
      return;
    }

    playQueue(
      songs,
      0,
      playlistName
    );
  };

  /* =======================================================
     PLAY SONG
  ======================================================= */

  const handlePlaySong = (index) => {
    playQueue(
      songs,
      index,
      playlistName
    );
  };

  /* =======================================================
     REMOVE SONG
  ======================================================= */

  const handleRemoveSong = (song) => {
    if (!song?.id) {
      return;
    }

    const songName =
      decodeHtml(
        song.name ||
          song.title ||
          'this song'
      );

    const shouldRemove =
      window.confirm(
        `Remove "${songName}" from "${playlistName}"?`
      );

    if (!shouldRemove) {
      return;
    }

    removeFromPlaylist(
      playlist.id,
      song.id
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-full
        min-w-0
        overflow-x-hidden
        bg-black
        px-4
        py-5
        text-white
        sm:px-5
        sm:py-6
        md:px-6
        lg:px-7
      "
    >
      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          mb-5
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
        title="Go back"
        aria-label="Go back"
      >
        <ArrowLeft size={21} />
      </button>

      {/* =================================================
          PLAYLIST HEADER
      ================================================= */}

      <div
        className="
          mb-7
          flex
          min-w-0
          flex-col
          gap-5
          sm:mb-8
          sm:flex-row
          sm:items-center
          sm:gap-6
        "
      >
        {/* =================================================
            PLAYLIST ICON
        ================================================= */}

        <div
          className="
            flex
            h-28
            w-28
            shrink-0
            items-center
            justify-center
            self-center
            rounded-xl
            bg-gradient-to-br
            from-white/10
            to-white/5
            text-white/50
            shadow-xl
            sm:h-40
            sm:w-40
            sm:self-auto
            lg:h-48
            lg:w-48
          "
        >
          <Music
            size={48}
            className="
              sm:h-[60px]
              sm:w-[60px]
              lg:h-[68px]
              lg:w-[68px]
            "
          />
        </div>

        {/* =================================================
            PLAYLIST INFO
        ================================================= */}

        <div
          className="
            min-w-0
            flex-1
            text-center
            sm:text-left
          "
        >
          <p
            className="
              mb-1
              text-xs
              text-white/50
              sm:text-sm
            "
          >
            Playlist
          </p>

          <h1
            className="
              line-clamp-2
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            "
            title={playlistName}
          >
            {playlistName}
          </h1>

          <p
            className="
              mt-2
              text-xs
              text-white/50
              sm:text-sm
            "
          >
            {songs.length}{' '}
            {songs.length === 1
              ? 'song'
              : 'songs'}
          </p>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            sm:w-auto
            sm:shrink-0
            sm:justify-start
          "
        >
          {/* PLAY ALL */}

          {songs.length > 0 && (
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
              title="Play all"
              aria-label="Play all"
            >
              <Play
                size={20}
                fill="black"
                className="sm:h-[22px] sm:w-[22px]"
              />
            </button>
          )}

          {/* DELETE PLAYLIST */}

          <button
            type="button"
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-full
              border
              border-red-500/30
              px-4
              text-sm
              font-medium
              text-red-400
              transition-all
              duration-200
              hover:border-red-500/50
              hover:bg-red-500/10
              active:scale-95
            "
            onClick={
              handleDeletePlaylist
            }
            title="Delete playlist"
            aria-label="Delete playlist"
          >
            <Trash size={18} />

            <span className="hidden sm:inline">
              Delete Playlist
            </span>
          </button>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {songs.length === 0 ? (
        <div
          className="
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            px-5
            py-16
            text-center
            sm:min-h-[350px]
            sm:py-20
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
            <Music size={40} />
          </div>

          <h2
            className="
              text-xl
              font-semibold
              sm:text-2xl
            "
          >
            This playlist is empty
          </h2>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-relaxed
              text-white/50
              sm:text-base
            "
          >
            Add songs using the playlist
            button next to any track.
          </p>
        </div>
      ) : (
        /* =================================================
           SONG LIST
        ================================================= */

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-1
            pb-28
            sm:pb-24
          "
        >
          {songs.map(
            (song, index) => {
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
                      SONG
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
                        IMAGE
                    ================================================= */}

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
                          bg-white/5
                          object-cover
                          sm:h-14
                          sm:w-14
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
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-white/5
                          text-white/40
                          sm:h-14
                          sm:w-14
                        "
                      >
                        🎵
                      </div>
                    )}

                    {/* =================================================
                        SONG INFO
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
                      REMOVE SONG
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
                      hover:bg-red-500/10
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
                    title="Remove from playlist"
                    aria-label={`Remove ${songName} from playlist`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default LocalPlaylistPage;