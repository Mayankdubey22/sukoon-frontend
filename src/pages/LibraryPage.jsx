import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  ListMusic,
  Music,
  ArrowLeft,
} from 'lucide-react';

import { useLibrary } from '../LibraryContext';

function LibraryPage() {
  const {
    likedSongs,
    playlists,
    likedPlaylists,
    createPlaylist,
  } = useLibrary();

  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] =
    useState('');

  const handleCreate = () => {
    const name = newPlaylistName.trim();

    if (!name) return;

    createPlaylist(name);

    setNewPlaylistName('');
    setShowInput(false);
  };

  return (
    <div className="library-page">
      <div className="library-page-header">
        <button
          className="back-arrow-btn"
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1>Your Library</h1>

        <button
          className="library-create-btn"
          onClick={() => setShowInput(!showInput)}
          title="Create playlist"
        >
          <Plus size={22} />
        </button>
      </div>

      {showInput && (
        <div className="library-create-box">
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) =>
              setNewPlaylistName(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
            }}
            autoFocus
          />

          <button onClick={handleCreate}>
            Create
          </button>
        </div>
      )}

      {/* LIKED SONGS */}
      <div
        className="library-mobile-item"
        onClick={() => navigate('/liked')}
      >
        <div className="library-mobile-icon liked">
          <Heart size={22} fill="white" />
        </div>

        <div className="library-mobile-info">
          <h3>Liked Songs</h3>
          <p>{likedSongs.length} songs</p>
        </div>
      </div>

      {/* YOUR PLAYLISTS */}
      <div className="library-section-title">
        <h2>Your Playlists</h2>
      </div>

      {playlists.length === 0 && (
        <div className="library-empty">
          <Music size={30} />
          <p>You haven't created any playlists yet.</p>
        </div>
      )}

      <div className="library-mobile-list">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="library-mobile-item"
            onClick={() =>
              navigate(
                `/playlist/local/${playlist.id}`
              )
            }
          >
            <div className="library-mobile-icon playlist">
              <ListMusic size={22} />
            </div>

            <div className="library-mobile-info">
              <h3>{playlist.name}</h3>
              <p>
                {playlist.songs.length}{' '}
                {playlist.songs.length === 1
                  ? 'song'
                  : 'songs'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* LIKED ONLINE PLAYLISTS */}
      {likedPlaylists.length > 0 && (
        <>
          <div className="library-section-title">
            <h2>Liked Playlists</h2>
          </div>

          <div className="library-mobile-list">
            {likedPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="library-mobile-item"
                onClick={() =>
                  navigate(
                    `/playlist/${playlist.id}`
                  )
                }
              >
                {playlist.image?.[1]?.url ||
                playlist.image?.[0]?.url ? (
                  <img
                    src={
                      playlist.image?.[1]?.url ||
                      playlist.image?.[0]?.url
                    }
                    alt={playlist.name}
                    className="library-mobile-image"
                  />
                ) : (
                  <div className="library-mobile-icon playlist">
                    <ListMusic size={22} />
                  </div>
                )}

                <div className="library-mobile-info">
                  <h3>{playlist.name}</h3>
                  <p>Liked playlist</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LibraryPage;