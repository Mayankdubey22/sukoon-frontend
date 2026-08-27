import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { Play, Heart, RefreshCw } from 'lucide-react';
import { useLibrary } from '../LibraryContext';
import { API_BASE_URL } from '../config';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text || '';
  return txt.value;
};

function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { playQueue, currentSong } = usePlayer();
  const { toggleLikePlaylist, isPlaylistLiked } = useLibrary();

  const fetchPlaylist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/songs/playlist/${id}`
      );

      const data = response.data?.data;

      if (!data) {
        throw new Error('Invalid playlist response.');
      }

      setPlaylist(data);
    } catch (err) {
      console.error('Failed to load playlist:', err);

      setPlaylist(null);
      setError(
        'Unable to load this playlist. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('Invalid playlist.');
      setLoading(false);
      return;
    }

    fetchPlaylist();
  }, [id]);

  const songs = Array.isArray(playlist?.songs)
    ? playlist.songs
    : [];

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(
        songs,
        0,
        playlist?.name || 'Playlist'
      );
    }
  };

  const playlistImage =
    playlist?.image?.[2]?.url ||
    playlist?.image?.[1]?.url ||
    playlist?.image?.[0]?.url ||
    '';

  if (loading) {
    return (
      <div
        className="loading-state"
        style={{
          color: 'white',
          padding: '20px',
        }}
      >
        <p>Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-state"
        style={{
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          className="retry-button"
          onClick={fetchPlaylist}
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div
        className="empty-state"
        style={{
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <h2>Playlist not found</h2>

        <p>
          We couldn't find this playlist.
        </p>

        <button
          className="retry-button"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        color: 'white',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="back-arrow-btn"
        style={{ marginBottom: '20px' }}
        aria-label="Go back"
      >
        ←
      </button>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        {playlistImage ? (
          <img
            src={playlistImage}
            alt={playlist.name || 'Playlist'}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0,
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div
            className="image-placeholder"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              background: '#282828',
              flexShrink: 0,
            }}
          >
            🎵
          </div>
        )}

        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#999',
              margin: 0,
            }}
          >
            Playlist
          </p>

          <h1
            style={{
              margin: '5px 0',
            }}
          >
            {decodeHtml(
              playlist.name || 'Unknown playlist'
            )}
          </h1>

          <p style={{ color: '#999' }}>
            {playlist.songCount ?? songs.length} songs
          </p>
        </div>

        {songs.length > 0 && (
          <button
            className="play-all-btn"
            onClick={handlePlayAll}
            title="Play playlist"
          >
            <Play size={22} fill="black" />
          </button>
        )}

        <button
          className="icon-btn playlist-like-btn"
          onClick={() =>
            toggleLikePlaylist({
              id,
              name: playlist.name || 'Unknown playlist',
              image: playlist.image || [],
            })
          }
          title={
            isPlaylistLiked(id)
              ? 'Remove from library'
              : 'Add to library'
          }
          aria-label={
            isPlaylistLiked(id)
              ? 'Remove playlist from library'
              : 'Add playlist to library'
          }
        >
          <Heart
            size={22}
            fill={
              isPlaylistLiked(id)
                ? '#1db954'
                : 'none'
            }
          />
        </button>
      </div>

      {songs.length === 0 ? (
        <div
          className="empty-state"
          style={{
            padding: '30px 0',
          }}
        >
          <h2>No songs available</h2>

          <p>
            We couldn't find any songs in this
            playlist right now.
          </p>
        </div>
      ) : (
        <div className="song-list">
          {songs.map((song, index) => {
            if (!song?.id) {
              return null;
            }

            const songImage =
              song.image?.[1]?.url ||
              song.image?.[0]?.url ||
              '';

            const artist =
              song.artists?.primary?.[0]?.name ||
              song.primaryArtists ||
              'Unknown artist';

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
                    playQueue(
                      songs,
                      index,
                      playlist.name || 'Playlist'
                    )
                  }
                >
                  {songImage ? (
                    <img
                      src={songImage}
                      alt={song.name || 'Song'}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />
                  ) : (
                    <div
                      className="image-placeholder"
                      style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#282828',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      🎵
                    </div>
                  )}

                  <div>
                    <p className="song-name">
                      {decodeHtml(
                        song.name || 'Unknown song'
                      )}
                    </p>

                    <p className="song-artist">
                      {decodeHtml(artist)}
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
      )}
    </div>
  );
}

export default PlaylistPage;