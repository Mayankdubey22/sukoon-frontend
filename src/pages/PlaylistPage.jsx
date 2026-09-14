import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import axios from 'axios';

import {
  Play,
  Heart,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

import { usePlayer } from '../PlayerContext';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { useLibrary } from '../LibraryContext';
import { API_BASE_URL } from '../config';

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
   PLAYLIST PAGE
========================================================= */

function PlaylistPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [
    playlist,
    setPlaylist,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  const {
    playQueue,
    currentSong,
  } = usePlayer();

  const {
    toggleLikePlaylist,
    isPlaylistLiked,
  } = useLibrary();

  /* =======================================================
     FETCH PLAYLIST
  ======================================================= */

  const fetchPlaylist = async () => {
    if (!id) {
      setPlaylist(null);
      setError('Invalid playlist.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await axios.get(
          `${API_BASE_URL}/api/songs/playlist/${id}`
        );

      const data =
        response.data?.data;

      if (!data) {
        throw new Error(
          'Invalid playlist response.'
        );
      }

      setPlaylist(data);
    } catch (err) {
      console.error(
        'Failed to load playlist:',
        err
      );

      setPlaylist(null);

      setError(
        'Unable to load this playlist. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD WHEN ID CHANGES
  ======================================================= */

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  /* =======================================================
     SONGS
  ======================================================= */

  const songs =
    Array.isArray(playlist?.songs)
      ? playlist.songs.filter(
          (song) => song?.id
        )
      : [];

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
      playlist?.name || 'Playlist'
    );
  };

  /* =======================================================
     PLAYLIST IMAGE
  ======================================================= */

  const playlistImage =
    playlist?.image?.[2]?.url ||
    playlist?.image?.[1]?.url ||
    playlist?.image?.[0]?.url ||
    '';

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          px-5
          py-10
          text-white
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            text-center
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
              sm:text-base
            "
          >
            Loading playlist...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          px-5
          py-10
          text-white
        "
      >
        <div
          className="
            flex
            max-w-md
            flex-col
            items-center
            gap-4
            text-center
          "
        >
          <h2
            className="
              text-xl
              font-bold
              sm:text-2xl
            "
          >
            Something went wrong
          </h2>

          <p
            className="
              text-sm
              text-white/60
              sm:text-base
            "
          >
            {error}
          </p>

          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-black
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white/90
              active:scale-95
            "
            onClick={fetchPlaylist}
          >
            <RefreshCw size={16} />

            Try again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!playlist) {
    return (
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          px-5
          py-10
          text-white
        "
      >
        <div
          className="
            flex
            max-w-md
            flex-col
            items-center
            gap-4
            text-center
          "
        >
          <h2
            className="
              text-xl
              font-bold
              sm:text-2xl
            "
          >
            Playlist not found
          </h2>

          <p
            className="
              text-sm
              text-white/60
              sm:text-base
            "
          >
            We couldn't find this playlist.
          </p>

          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
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
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowLeft size={17} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     PLAYLIST DATA
  ======================================================= */

  const playlistName =
    decodeHtml(
      playlist.name ||
        'Unknown playlist'
    );

  const playlistLiked =
    isPlaylistLiked(id);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-x-hidden
        px-4
        py-5
        text-white
        sm:px-6
        sm:py-6
        lg:px-7
      "
    >
      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="
          mb-5
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/5
          text-white/70
          transition-all
          duration-200
          hover:bg-white/10
          hover:text-white
          active:scale-95
        "
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
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
          lg:gap-7
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            h-32
            w-32
            shrink-0
            self-center
            overflow-hidden
            rounded-xl
            bg-[#282828]
            shadow-lg
            sm:h-40
            sm:w-40
            sm:self-auto
            md:h-48
            md:w-48
            lg:h-52
            lg:w-52
          "
        >
          {playlistImage ? (
            <img
              src={playlistImage}
              alt={playlistName}
              className="
                h-full
                w-full
                object-cover
              "
              onError={(event) => {
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
                text-4xl
                sm:text-5xl
              "
            >
              🎵
            </div>
          )}
        </div>

        {/* =================================================
            INFO
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
              font-medium
              uppercase
              tracking-wider
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
              sm:mt-3
              sm:text-sm
            "
          >
            {playlist.songCount ??
              songs.length}{' '}
            {playlist.songCount === 1 ||
            songs.length === 1
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
            shrink-0
            items-center
            justify-center
            gap-3
            sm:w-auto
            sm:justify-start
          "
        >
          {/* PLAY */}

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
                bg-[#1db954]
                text-black
                shadow-lg
                shadow-black/20
                transition-all
                duration-200
                hover:scale-105
                hover:bg-[#1ed760]
                active:scale-95
                sm:h-12
                sm:w-12
              "
              onClick={handlePlayAll}
              title="Play playlist"
              aria-label="Play playlist"
            >
              <Play
                size={20}
                fill="currentColor"
                className="sm:h-[22px] sm:w-[22px]"
              />
            </button>
          )}

          {/* LIKE PLAYLIST */}

          <button
            type="button"
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              transition-all
              duration-200
              hover:scale-105
              active:scale-95
              sm:h-12
              sm:w-12
              ${
                playlistLiked
                  ? 'border-[#1db954]/40 bg-[#1db954]/10 text-[#1db954]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }
            `}
            onClick={() =>
              toggleLikePlaylist({
                id,
                name:
                  playlist.name ||
                  'Unknown playlist',
                image:
                  playlist.image ||
                  [],
              })
            }
            title={
              playlistLiked
                ? 'Remove from library'
                : 'Add to library'
            }
            aria-label={
              playlistLiked
                ? 'Remove playlist from library'
                : 'Add playlist to library'
            }
          >
            <Heart
              size={20}
              fill={
                playlistLiked
                  ? 'currentColor'
                  : 'none'
              }
              className="sm:h-[22px] sm:w-[22px]"
            />
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
            rounded-2xl
            border
            border-white/5
            bg-white/[0.02]
            px-5
            py-14
            text-center
            sm:min-h-[350px]
            sm:py-16
          "
        >
          <div
            className="
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white/5
            "
          >
            <Heart
              size={24}
              className="text-white/40"
            />
          </div>

          <h2
            className="
              text-xl
              font-semibold
              sm:text-2xl
            "
          >
            No songs available
          </h2>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              text-white/50
              sm:text-base
            "
          >
            We couldn't find any songs in this
            playlist right now.
          </p>
        </div>
      ) : (
        /* =================================================
           SONG LIST
        ================================================= */

        <div
          className="
            flex
            w-full
            min-w-0
            flex-col
            overflow-hidden
            rounded-xl
            pb-28
            sm:pb-24
          "
        >
          {songs.map(
            (song, index) => {
              const songImage =
                song.image?.[2]?.url ||
                song.image?.[1]?.url ||
                song.image?.[0]?.url ||
                '';

              const artist =
                song.artists
                  ?.primary
                  ?.map(
                    (item) =>
                      item.name
                  )
                  .join(', ') ||
                song.primaryArtists ||
                'Unknown artist';

              const songName =
                decodeHtml(
                  song.name ||
                    'Unknown song'
                );

              const artistName =
                decodeHtml(
                  artist
                );

              const isPlaying =
                currentSong?.id ===
                song.id;

              return (
                <div
                  key={song.id}
                  className={`
                    group
                    flex
                    min-h-[62px]
                    min-w-0
                    items-center
                    gap-2
                    rounded-lg
                    px-2
                    py-2
                    transition-colors
                    duration-200
                    sm:min-h-[68px]
                    sm:gap-3
                    sm:px-3
                    ${
                      isPlaying
                        ? 'bg-[#1db954]/10'
                        : 'hover:bg-white/[0.06]'
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
                      playQueue(
                        songs,
                        index,
                        playlistName
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

                        playQueue(
                          songs,
                          index,
                          playlistName
                        );
                      }
                    }}
                  >
                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div
                      className="
                        relative
                        h-11
                        w-11
                        shrink-0
                        overflow-hidden
                        rounded-md
                        bg-[#282828]
                        sm:h-12
                        sm:w-12
                      "
                    >
                      {songImage ? (
                        <img
                          src={songImage}
                          alt={songName}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                          onError={(event) => {
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
                            text-base
                            sm:text-lg
                          "
                        >
                          🎵
                        </div>
                      )}

                      {/* PLAYING ANIMATION */}

                      {isPlaying && (
                        <div
                          className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/50
                          "
                        >
                          <span
                            className="
                              mx-[1px]
                              h-3
                              w-[2px]
                              animate-pulse
                              bg-[#1db954]
                            "
                          />

                          <span
                            className="
                              mx-[1px]
                              h-5
                              w-[2px]
                              animate-pulse
                              bg-[#1db954]
                              [animation-delay:150ms]
                            "
                          />

                          <span
                            className="
                              mx-[1px]
                              h-4
                              w-[2px]
                              animate-pulse
                              bg-[#1db954]
                              [animation-delay:300ms]
                            "
                          />
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        INFO
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
                              ? 'text-[#1db954]'
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
                        title={artistName}
                      >
                        {artistName}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      PLAYLIST BUTTON
                  ================================================= */}

                  <div
                    className="
                      shrink-0
                    "
                  >
                    <AddToPlaylistButton
                      song={song}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;