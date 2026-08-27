import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../LibraryContext';
import { usePlayer } from '../PlayerContext';
import { Trash2, Play, Heart } from 'lucide-react';

const decodeHtml = (text = '') => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function LikedSongsPage() {
  const { likedSongs, toggleLike, libraryLoaded } =
    useLibrary();

  const { playQueue, currentSong } =
    usePlayer();

  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playQueue(
        likedSongs,
        0,
        'Liked Songs'
      );
    }
  };

  const handlePlaySong = (index) => {
    playQueue(
      likedSongs,
      index,
      'Liked Songs'
    );
  };

  const handleRemoveSong = (song) => {
    if (!song?.id) return;

    const songName = decodeHtml(
      song.name ||
        song.title ||
        'this song'
    );

    const shouldRemove = window.confirm(
      `Remove "${songName}" from Liked Songs?`
    );

    if (shouldRemove) {
      toggleLike(song);
    }
  };

  if (!libraryLoaded) {
    return (
      <div
        style={{
          padding: '20px',
          color: 'white',
        }}
      >
        Loading your library...
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
        style={{
          marginBottom: '20px',
        }}
        title="Go back"
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
        <div className="liked-icon-large">
          <Heart
            size={60}
            fill="currentColor"
          />
        </div>

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
            Liked Songs
          </h1>

          <p
            style={{
              color: '#999',
            }}
          >
            {likedSongs.length}{' '}
            {likedSongs.length === 1
              ? 'song'
              : 'songs'}
          </p>
        </div>

        {likedSongs.length > 0 && (
          <button
            className="play-all-btn"
            onClick={handlePlayAll}
            title="Play all"
          >
            <Play
              size={22}
              fill="black"
            />
          </button>
        )}
      </div>

      {likedSongs.length === 0 ? (
        <div className="empty-library">
          <Heart size={40} />

          <h2>
            No liked songs yet
          </h2>

          <p>
            Tap the heart icon next to
            any song to add it here.
          </p>
        </div>
      ) : (
        <div className="song-list">
          {likedSongs.map(
            (song, index) => {
              if (!song?.id) {
                return null;
              }

              const songName =
                song.name ||
                song.title ||
                'Unknown Song';

              const artistName =
                song.artists?.primary
                  ?.map(
                    (artist) =>
                      artist.name
                  )
                  .join(', ') ||
                song.primaryArtists ||
                'Unknown Artist';

              const imageUrl =
                song.image?.[1]?.url ||
                song.image?.[0]?.url ||
                '';

              return (
                <div
                  key={song.id}
                  className={`song-item ${
                    currentSong?.id ===
                    song.id
                      ? 'playing'
                      : ''
                  }`}
                >
                  <div
                    className="song-item-main"
                    onClick={() =>
                      handlePlaySong(index)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault();
                        handlePlaySong(index);
                      }
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={songName}
                      />
                    ) : (
                      <div className="song-placeholder">
                        🎵
                      </div>
                    )}

                    <div>
                      <p className="song-name">
                        {decodeHtml(
                          songName
                        )}
                      </p>

                      <p className="song-artist">
                        {decodeHtml(
                          artistName
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    className="icon-btn"
                    onClick={() =>
                      handleRemoveSong(
                        song
                      )
                    }
                    title="Remove from liked songs"
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

export default LikedSongsPage;