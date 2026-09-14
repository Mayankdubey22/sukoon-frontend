import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

import { useSearch } from '../SearchContext';
import { usePlayer } from '../PlayerContext';
import Carousel from '../components/Carousel';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { API_BASE_URL } from '../config';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text || '';
  return txt.value;
};

function SearchPage() {
  const {
    query,
    results,
    loading,
    error,
  } = useSearch();

  const navigate = useNavigate();

  const {
    playSong,
    currentSong,
    playQueue,
  } = usePlayer();

  const handlePlayArtist = async (e, artistId) => {
    e.stopPropagation();

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/songs/artist/${artistId}`
      );

      const topSongs =
        res.data?.data?.topSongs || [];

      if (topSongs.length > 0) {
        playQueue(topSongs, 0);
      }
    } catch (err) {
      console.error(
        'Failed to play artist:',
        err
      );
    }
  };

  const handlePlayPlaylist = async (
    e,
    playlistId
  ) => {
    e.stopPropagation();

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/songs/playlist/${playlistId}`
      );

      const songs =
        res.data?.data?.songs || [];

      if (songs.length > 0) {
        playQueue(songs, 0);
      }
    } catch (err) {
      console.error(
        'Failed to play playlist:',
        err
      );
    }
  };

  /* =========================
     EMPTY SEARCH
  ========================= */

  if (!query.trim()) {
    return (
      <div className="flex min-h-full min-w-0 items-center justify-center overflow-x-hidden px-5 py-16 text-center text-white">
        <div className="max-w-md">
          <h2 className="text-xl font-bold sm:text-2xl">
            Search for music
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Search for songs, artists,
            albums, or playlists.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-full min-w-0 items-center justify-center overflow-x-hidden px-5 py-16 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/60">
            Searching...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="flex min-h-full min-w-0 items-center justify-center overflow-x-hidden px-5 py-16 text-center text-white">
        <div className="max-w-md">
          <h2 className="text-xl font-bold sm:text-2xl">
            Search failed
          </h2>

          <p className="mt-2 break-words text-sm text-white/50">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const hasResults =
    results?.topQuery?.results?.length ||
    results?.songs?.results?.length ||
    results?.artists?.results?.length ||
    results?.albums?.results?.length ||
    results?.playlists?.results?.length;

  /* =========================
     NO RESULTS
  ========================= */

  if (!hasResults) {
    return (
      <div className="flex min-h-full min-w-0 items-center justify-center overflow-x-hidden px-5 py-16 text-center text-white">
        <div className="max-w-md">
          <h2 className="text-xl font-bold sm:text-2xl">
            No results found
          </h2>

          <p className="mt-2 break-words text-sm text-white/50">
            We couldn't find anything for "
            {query}".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full overflow-x-hidden px-3 py-4 text-white sm:px-5 sm:py-5 md:px-6 lg:px-8">
      <div className="mx-auto min-w-0 w-full max-w-[1600px]">

        {/* =========================
            TOP RESULT
        ========================= */}

        {results?.topQuery?.results?.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-2xl">
              Top Result
            </h2>

            {(() => {
              const item =
                results.topQuery.results[0];

              const image =
                item.image?.[2]?.url ||
                item.image?.[1]?.url ||
                item.image?.[0]?.url;

              return (
                <div
                  className="group flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3 transition hover:bg-white/[0.08] sm:gap-4 sm:p-4"
                  onClick={() => {
                    if (item.type === 'song') {
                      playSong(item);
                    } else if (
                      item.type === 'album'
                    ) {
                      navigate(
                        `/album/${item.id}`
                      );
                    } else if (
                      item.type === 'artist'
                    ) {
                      navigate(
                        `/artist/${item.id}`
                      );
                    } else if (
                      item.type === 'playlist'
                    ) {
                      navigate(
                        `/playlist/${item.id}`
                      );
                    }
                  }}
                >
                  {/* IMAGE */}

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#282828] sm:h-20 sm:w-20">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          item.name ||
                          item.title ||
                          'Result'
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl sm:text-2xl">
                        🎵
                      </div>
                    )}
                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white sm:text-base">
                      {decodeHtml(
                        item.name ||
                        item.title
                      )}
                    </p>

                    <p className="mt-1 text-xs capitalize text-white/50 sm:text-sm">
                      {item.type}
                    </p>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* =========================
            SONGS
        ========================= */}

        {results?.songs?.results?.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-2xl">
              Songs
            </h2>

            <div className="flex w-full min-w-0 flex-col overflow-hidden">
              {results.songs.results
                .slice(0, 10)
                .map((song) => {
                  const songImage =
                    song.image?.[1]?.url ||
                    song.image?.[0]?.url;

                  const isPlaying =
                    currentSong?.id === song.id;

                  return (
                    <div
                      key={song.id}
                      className={`group flex min-h-[64px] min-w-0 items-center gap-2 rounded-lg px-1.5 py-2 transition sm:min-h-[68px] sm:gap-3 sm:px-3 ${
                        isPlaying
                          ? 'bg-[#1db954]/10'
                          : 'hover:bg-white/[0.06]'
                      }`}
                    >
                      <div
                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 sm:gap-3"
                        onClick={() =>
                          playSong(song)
                        }
                      >
                        {/* COVER */}

                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[#282828] sm:h-12 sm:w-12">
                          {songImage ? (
                            <img
                              src={songImage}
                              alt={
                                song.name ||
                                song.title ||
                                'Song'
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-base sm:text-lg">
                              🎵
                            </div>
                          )}

                          {isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <span className="mx-[1px] h-3 w-[2px] animate-pulse bg-[#1db954]" />
                              <span className="mx-[1px] h-5 w-[2px] animate-pulse bg-[#1db954] [animation-delay:150ms]" />
                              <span className="mx-[1px] h-4 w-[2px] animate-pulse bg-[#1db954] [animation-delay:300ms]" />
                            </div>
                          )}
                        </div>

                        {/* INFO */}

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${
                              isPlaying
                                ? 'text-[#1db954]'
                                : 'text-white'
                            }`}
                          >
                            {decodeHtml(
                              song.name ||
                              song.title ||
                              'Unknown song'
                            )}
                          </p>

                          <p className="mt-1 truncate text-xs text-white/50">
                            {decodeHtml(
                              song.primaryArtists ||
                              song.artists?.primary
                                ?.map(
                                  (artist) =>
                                    artist.name
                                )
                                .join(', ') ||
                              'Unknown artist'
                            )}
                          </p>
                        </div>
                      </div>

                      {/* PLAYLIST */}

                      <div className="shrink-0">
                        <AddToPlaylistButton
                          song={song}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* =========================
            ARTISTS
        ========================= */}

        {results?.artists?.results?.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-2xl">
              Artists
            </h2>

            <Carousel
              items={
                results.artists.results
              }
              renderItem={(artist) => {
                const image =
                  artist.image?.[2]?.url ||
                  artist.image?.[1]?.url ||
                  artist.image?.[0]?.url;

                return (
                  <div
                    key={artist.id}
                    className="w-[125px] shrink-0 cursor-pointer sm:w-[150px] md:w-[170px]"
                    onClick={() =>
                      navigate(
                        `/artist/${artist.id}`
                      )
                    }
                  >
                    <div className="group relative aspect-square overflow-hidden rounded-full bg-[#282828]">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            artist.name ||
                            artist.title ||
                            'Artist'
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl">
                          🎤
                        </div>
                      )}

                      <div
                        className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition group-hover:opacity-100 sm:bottom-2 sm:right-2 sm:h-10 sm:w-10"
                        onClick={(e) =>
                          handlePlayArtist(
                            e,
                            artist.id
                          )
                        }
                      >
                        <Play
                          size={16}
                          fill="currentColor"
                          className="sm:hidden"
                        />

                        <Play
                          size={18}
                          fill="currentColor"
                          className="hidden sm:block"
                        />
                      </div>
                    </div>

                    <p className="mt-2 truncate text-sm font-medium text-white sm:mt-3">
                      {decodeHtml(
                        artist.name ||
                        artist.title ||
                        'Unknown artist'
                      )}
                    </p>
                  </div>
                );
              }}
            />
          </section>
        )}

        {/* =========================
            ALBUMS
        ========================= */}

        {results?.albums?.results?.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-2xl">
              Albums
            </h2>

            <Carousel
              items={
                results.albums.results
              }
              renderItem={(album) => {
                const image =
                  album.image?.[2]?.url ||
                  album.image?.[1]?.url ||
                  album.image?.[0]?.url;

                return (
                  <div
                    key={album.id}
                    className="group w-[135px] shrink-0 cursor-pointer sm:w-[160px] md:w-[180px]"
                    onClick={() =>
                      navigate(
                        `/album/${album.id}`
                      )
                    }
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#282828]">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            album.name ||
                            album.title ||
                            'Album'
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl">
                          🎵
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10">
                        <Play
                          size={16}
                          fill="currentColor"
                          className="sm:hidden"
                        />

                        <Play
                          size={18}
                          fill="currentColor"
                          className="hidden sm:block"
                        />
                      </div>
                    </div>

                    <p className="mt-2 truncate text-sm font-semibold sm:mt-3">
                      {decodeHtml(
                        album.name ||
                        album.title ||
                        'Unknown album'
                      )}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/50">
                      {album.year || 'Album'}
                    </p>
                  </div>
                );
              }}
            />
          </section>
        )}

        {/* =========================
            PLAYLISTS
        ========================= */}

        {results?.playlists?.results?.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-2xl">
              Playlists
            </h2>

            <Carousel
              items={
                results.playlists.results
              }
              renderItem={(playlist) => {
                const image =
                  playlist.image?.[2]?.url ||
                  playlist.image?.[1]?.url ||
                  playlist.image?.[0]?.url;

                return (
                  <div
                    key={playlist.id}
                    className="group w-[135px] shrink-0 cursor-pointer sm:w-[160px] md:w-[180px]"
                    onClick={() =>
                      navigate(
                        `/playlist/${playlist.id}`
                      )
                    }
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#282828]">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            playlist.name ||
                            playlist.title ||
                            'Playlist'
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl">
                          🎵
                        </div>
                      )}

                      <div
                        className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
                        onClick={(e) =>
                          handlePlayPlaylist(
                            e,
                            playlist.id
                          )
                        }
                      >
                        <Play
                          size={16}
                          fill="currentColor"
                          className="sm:hidden"
                        />

                        <Play
                          size={18}
                          fill="currentColor"
                          className="hidden sm:block"
                        />
                      </div>
                    </div>

                    <p className="mt-2 truncate text-sm font-semibold sm:mt-3">
                      {decodeHtml(
                        playlist.name ||
                        playlist.title ||
                        'Unknown playlist'
                      )}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/50">
                      Playlist
                    </p>
                  </div>
                );
              }}
            />
          </section>
        )}

      </div>
    </div>
  );
}

export default SearchPage;