import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../LibraryContext';
import { usePlayer } from '../PlayerContext';
import {
  Trash2,
  Trash,
  Play,
  Music,
} from 'lucide-react';

const decodeHtml = (text = '') => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

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

  if (!libraryLoaded) {
    return (
      <div
        style={{
          padding: '20px',
          color: 'white',
        }}
      >
        Loading playlist...
      </div>
    );
  }

  const playlist = playlists.find(
    (item) => item.id === id
  );

  if (!playlist) {
    return (
      <div
        style={{
          padding: '20px',
          color: 'white',
        }}
      >
        <h2>Playlist not found</h2>

        <p style={{ color: '#999' }}>
          This playlist may have been deleted.
        </p>

        <button
          className="back-arrow-btn"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  const songs = Array.isArray(
    playlist.songs
  )
    ? playlist.songs.filter(
        (song) => song?.id
      )
    : [];

  const handleDeletePlaylist = () => {
    const shouldDelete = window.confirm(
      `Delete playlist "${playlist.name}"? This cannot be undone.`
    );

    if (!shouldDelete) return;

    deletePlaylist(playlist.id);

    navigate('/');
  };

  const handlePlayAll = () => {
    if (songs.length === 0) return;

    playQueue(
      songs,
      0,
      playlist.name
    );
  };

  const handlePlaySong = (index) => {
    playQueue(
      songs,
      index,
      playlist.name
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
      `Remove "${songName}" from "${playlist.name}"?`
    );

    if (!shouldRemove) return;

    removeFromPlaylist(
      playlist.id,
      song.id
    );
  };

  return (
    <div
      style={{
        padding: '20px',
        color: 'white',
      }}
    >
      {/* BACK BUTTON */}

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

      {/* PLAYLIST HEADER */}

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div className="playlist-icon-large">
          <Music size={60} />
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
            {decodeHtml(
              playlist.name
            )}
          </h1>

          <p
            style={{
              color: '#999',
            }}
          >
            {songs.length}{' '}
            {songs.length === 1
              ? 'song'
              : 'songs'}
          </p>
        </div>

        {/* PLAY ALL */}

        {songs.length > 0 && (
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

        {/* DELETE PLAYLIST */}

        <button
          className="delete-playlist-page-btn"
          onClick={
            handleDeletePlaylist
          }
          title="Delete playlist"
        >
          <Trash size={18} />
          Delete Playlist
        </button>
      </div>

      {/* EMPTY STATE */}

      {songs.length === 0 ? (
        <div className="empty-library">
          <Music size={40} />

          <h2>
            This playlist is empty
          </h2>

          <p>
            Add songs using the playlist
            button next to any track.
          </p>
        </div>
      ) : (
        /* SONG LIST */

        <div className="song-list">
          {songs.map(
            (song, index) => {
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
                  {/* SONG */}

                  <div
                    className="song-item-main"
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

                  {/* REMOVE SONG */}

                  <button
                    className="icon-btn"
                    onClick={() =>
                      handleRemoveSong(
                        song
                      )
                    }
                    title="Remove from playlist"
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