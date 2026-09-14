import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'react-router-dom';

import axios from 'axios';

import {
  Play,
  RefreshCw,
} from 'lucide-react';

import {
  usePlayer,
} from '../PlayerContext';

import AddToPlaylistButton from '../components/AddToPlaylistButton';

import {
  API_BASE_URL,
} from '../config';

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
   ALBUM PAGE
========================================================= */

function AlbumPage() {
  const { id } = useParams();

  const [
    album,
    setAlbum,
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

  /* =======================================================
     FETCH ALBUM
  ======================================================= */

  const fetchAlbum = async () => {
    if (!id) {
      setAlbum(null);
      setError('Invalid album.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await axios.get(
          `${API_BASE_URL}/api/songs/album/${id}`
        );

      const data =
        response.data?.data;

      if (!data) {
        throw new Error(
          'Invalid album response.'
        );
      }

      setAlbum(data);
    } catch (err) {
      console.error(
        'Failed to load album:',
        err
      );

      setAlbum(null);

      setError(
        'Unable to load this album. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD WHEN ID CHANGES
  ======================================================= */

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  /* =======================================================
     SONGS
  ======================================================= */

  const songs =
    Array.isArray(album?.songs)
      ? album.songs
      : [];

  /* =======================================================
     PLAY ALBUM
  ======================================================= */

  const handlePlayAll = () => {
    if (songs.length === 0) {
      return;
    }

    playQueue(
      songs,
      0,
      album?.name || 'Album'
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-full
          px-4
          py-5
          text-white
          sm:px-5
          sm:py-6
          md:px-6
        "
      >
        {/* Album Header Skeleton */}

        <div
          className="
            mb-8
            flex
            items-center
            gap-4
            sm:gap-5
          "
        >
          <div
            className="
              h-[140px]
              w-[140px]
              shrink-0
              animate-pulse
              rounded-lg
              bg-[#282828]
              sm:h-[180px]
              sm:w-[180px]
              md:h-[200px]
              md:w-[200px]
            "
          />

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                mb-3
                h-3
                w-16
                animate-pulse
                rounded
                bg-[#282828]
              "
            />

            <div
              className="
                mb-3
                h-8
                w-[70%]
                max-w-[320px]
                animate-pulse
                rounded
                bg-[#282828]
              "
            />

            <div
              className="
                h-4
                w-32
                animate-pulse
                rounded
                bg-[#282828]
              "
            />
          </div>
        </div>

        {/* Song Skeletons */}

        <div className="space-y-2">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2
              "
            >
              <div
                className="
                  h-[50px]
                  w-[50px]
                  shrink-0
                  animate-pulse
                  rounded
                  bg-[#282828]
                "
              />

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <div
                  className="
                    mb-2
                    h-3
                    w-[55%]
                    animate-pulse
                    rounded
                    bg-[#282828]
                  "
                />

                <div
                  className="
                    h-3
                    w-[35%]
                    animate-pulse
                    rounded
                    bg-[#282828]
                  "
                />
              </div>
            </div>
          ))}
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
          flex-col
          items-center
          justify-center
          px-5
          py-16
          text-center
          text-white
        "
      >
        <h2
          className="
            mb-2
            text-xl
            font-bold
            sm:text-2xl
          "
        >
          Something went wrong
        </h2>

        <p
          className="
            mb-5
            max-w-md
            text-sm
            text-gray-400
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
            font-medium
            text-black
            transition-all
            duration-200
            hover:scale-105
            hover:bg-gray-200
            active:scale-95
          "
          onClick={fetchAlbum}
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  /* =======================================================
     ALBUM NOT FOUND
  ======================================================= */

  if (!album) {
    return (
      <div
        className="
          flex
          min-h-full
          flex-col
          items-center
          justify-center
          px-5
          py-16
          text-center
          text-white
        "
      >
        <h2
          className="
            mb-2
            text-xl
            font-bold
            sm:text-2xl
          "
        >
          Album not found
        </h2>

        <p
          className="
            text-sm
            text-gray-400
            sm:text-base
          "
        >
          We couldn't find this album.
        </p>
      </div>
    );
  }

  /* =======================================================
     ALBUM DATA
  ======================================================= */

  const albumName =
    decodeHtml(
      album.name ||
        'Unknown album'
    );

  const albumImage =
    album.image?.[2]?.url ||
    album.image?.[1]?.url ||
    album.image?.[0]?.url ||
    '';

  const songCount =
    album.songCount ||
    songs.length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-w-0
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
          ALBUM HEADER
      ================================================= */}

      <div
        className="
          mb-7
          flex
          min-w-0
          items-center
          gap-4
          sm:mb-8
          sm:gap-5
          md:gap-6
        "
      >
        {/* =================================================
            ALBUM IMAGE
        ================================================= */}

        <div
          className="
            h-[120px]
            w-[120px]
            shrink-0
            sm:h-[160px]
            sm:w-[160px]
            md:h-[200px]
            md:w-[200px]
          "
        >
          {albumImage ? (
            <img
              src={albumImage}
              alt={albumName}
              className="
                h-full
                w-full
                rounded-lg
                object-cover
                shadow-lg
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
                rounded-lg
                bg-[#282828]
                text-3xl
                sm:text-[40px]
              "
            >
              🎵
            </div>
          )}
        </div>

        {/* =================================================
            ALBUM INFORMATION
        ================================================= */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <p
            className="
              m-0
              text-xs
              text-gray-400
              sm:text-sm
            "
          >
            Album
          </p>

          <h1
            className="
              my-1
              line-clamp-2
              text-xl
              font-bold
              leading-tight
              sm:text-2xl
              md:text-3xl
            "
            title={albumName}
          >
            {albumName}
          </h1>

          <p
            className="
              truncate
              text-xs
              text-gray-400
              sm:text-sm
            "
          >
            {songCount}{' '}
            {songCount === 1
              ? 'song'
              : 'songs'}

            {album.year
              ? ` • ${album.year}`
              : ''}
          </p>
        </div>

        {/* =================================================
            PLAY ALL
        ================================================= */}

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
            title="Play album"
            aria-label="Play album"
          >
            <Play
              size={20}
              fill="black"
              className="sm:h-[22px] sm:w-[22px]"
            />
          </button>
        )}
      </div>

      {/* =================================================
          EMPTY SONGS STATE
      ================================================= */}

      {songs.length === 0 ? (
        <div
          className="
            py-10
            text-center
          "
        >
          <h2
            className="
              mb-2
              text-lg
              font-semibold
              sm:text-xl
            "
          >
            No songs available
          </h2>

          <p
            className="
              px-4
              text-sm
              text-gray-400
              sm:text-base
            "
          >
            This album doesn't have
            any playable songs.
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
          "
        >
          {songs.map(
            (song, index) => {
              if (!song?.id) {
                return null;
              }

              const image =
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
                    min-w-0
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    px-2
                    py-2
                    transition-colors
                    duration-200
                    sm:gap-4
                    sm:px-3
                    ${
                      isPlaying
                        ? 'bg-[#282828]'
                        : 'hover:bg-[#181818]'
                    }
                  `}
                >
                  {/* =================================================
                      SONG MAIN AREA
                  ================================================= */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      cursor-pointer
                      items-center
                      gap-3
                    "
                    onClick={() =>
                      playQueue(
                        songs,
                        index,
                        albumName
                      )
                    }
                  >
                    {/* SONG IMAGE */}

                    {image ? (
                      <img
                        src={image}
                        alt={songName}
                        loading="lazy"
                        className="
                          h-[46px]
                          w-[46px]
                          shrink-0
                          rounded
                          object-cover
                          sm:h-[50px]
                          sm:w-[50px]
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
                          h-[46px]
                          w-[46px]
                          shrink-0
                          items-center
                          justify-center
                          rounded
                          bg-[#282828]
                          text-sm
                          sm:h-[50px]
                          sm:w-[50px]
                        "
                      >
                        🎵
                      </div>
                    )}

                    {/* SONG INFO */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className={`
                          m-0
                          truncate
                          text-sm
                          font-medium
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
                          text-gray-400
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

export default AlbumPage;