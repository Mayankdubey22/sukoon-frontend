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

  if (!query.trim()) {
    return (
      <div className="empty-state">
        <h2>Search for music</h2>
        <p>
          Search for songs, artists,
          albums, or playlists.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <p>Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Search failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  const hasResults =
    results?.topQuery?.results?.length ||
    results?.songs?.results?.length ||
    results?.artists?.results?.length ||
    results?.albums?.results?.length ||
    results?.playlists?.results?.length;

  if (!hasResults) {
    return (
      <div className="empty-state">
        <h2>No results found</h2>

        <p>
          We couldn't find anything for
          "{query}".
        </p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="results-container">

        {/* TOP RESULT */}
        {results?.topQuery?.results?.length > 0 && (
          <div className="section">
            <h2>Top Result</h2>

            {(() => {
              const item =
                results.topQuery.results[0];

              const image =
                item.image?.[2]?.url ||
                item.image?.[1]?.url ||
                item.image?.[0]?.url;

              return (
                <div
                  className="top-result-card"
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
                  {image && (
                    <img
                      src={image}
                      alt={
                        item.name ||
                        item.title ||
                        'Result'
                      }
                    />
                  )}

                  <div>
                    <p className="top-result-name">
                      {decodeHtml(
                        item.name || item.title
                      )}
                    </p>

                    <p className="top-result-type">
                      {item.type}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SONGS */}
        {results?.songs?.results?.length > 0 && (
          <div className="section">
            <h2>Songs</h2>

            <div className="song-list">
              {results.songs.results
                .slice(0, 10)
                .map((song) => {
                  const songImage =
                    song.image?.[1]?.url ||
                    song.image?.[0]?.url;

                  return (
                    <div
                      key={song.id}
                      className={`song-item ${
                        currentSong?.id === song.id
                          ? 'playing'
                          : ''
                      }`}
                    >
                      <div
                        className="song-item-main"
                        onClick={() =>
                          playSong(song)
                        }
                      >
                        {songImage && (
                          <img
                            src={songImage}
                            alt={
                              song.name ||
                              song.title ||
                              'Song'
                            }
                          />
                        )}

                        <div>
                          <p className="song-name">
                            {decodeHtml(
                              song.name ||
                              song.title ||
                              'Unknown song'
                            )}
                          </p>

                          <p className="song-artist">
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

                      <AddToPlaylistButton
                        song={song}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ARTISTS */}
        {results?.artists?.results?.length > 0 && (
          <div className="section">
            <h2>Artists</h2>

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
                    className="artist-card"
                    onClick={() =>
                      navigate(
                        `/artist/${artist.id}`
                      )
                    }
                  >
                    <div className="card-image-wrapper artist-image-wrapper">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            artist.name ||
                            artist.title ||
                            'Artist'
                          }
                          className="artist-img"
                        />
                      ) : (
                        <div className="image-placeholder">
                          🎤
                        </div>
                      )}

                      <div
                        className="play-overlay"
                        onClick={(e) =>
                          handlePlayArtist(
                            e,
                            artist.id
                          )
                        }
                      >
                        <Play
                          size={20}
                          fill="black"
                        />
                      </div>
                    </div>

                    <p>
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
          </div>
        )}

        {/* ALBUMS */}
        {results?.albums?.results?.length > 0 && (
          <div className="section">
            <h2>Albums</h2>

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
                    className="album-card"
                    onClick={() =>
                      navigate(
                        `/album/${album.id}`
                      )
                    }
                  >
                    <div className="card-image-wrapper">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            album.name ||
                            album.title ||
                            'Album'
                          }
                        />
                      ) : (
                        <div className="image-placeholder">
                          🎵
                        </div>
                      )}

                      <div className="play-overlay">
                        <Play
                          size={20}
                          fill="black"
                        />
                      </div>
                    </div>

                    <p className="card-title">
                      {decodeHtml(
                        album.name ||
                        album.title ||
                        'Unknown album'
                      )}
                    </p>

                    <p className="card-subtitle">
                      {album.year ||
                        'Album'}
                    </p>
                  </div>
                );
              }}
            />
          </div>
        )}

        {/* PLAYLISTS */}
        {results?.playlists?.results?.length > 0 && (
          <div className="section">
            <h2>Playlists</h2>

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
                    className="album-card"
                    onClick={() =>
                      navigate(
                        `/playlist/${playlist.id}`
                      )
                    }
                  >
                    <div className="card-image-wrapper">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            playlist.name ||
                            playlist.title ||
                            'Playlist'
                          }
                        />
                      ) : (
                        <div className="image-placeholder">
                          🎵
                        </div>
                      )}

                      <div
                        className="play-overlay"
                        onClick={(e) =>
                          handlePlayPlaylist(
                            e,
                            playlist.id
                          )
                        }
                      >
                        <Play
                          size={20}
                          fill="black"
                        />
                      </div>
                    </div>

                    <p className="card-title">
                      {decodeHtml(
                        playlist.name ||
                        playlist.title ||
                        'Unknown playlist'
                      )}
                    </p>

                    <p className="card-subtitle">
                      Playlist
                    </p>
                  </div>
                );
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchPage;