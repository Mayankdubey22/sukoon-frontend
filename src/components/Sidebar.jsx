import React, { useState } from 'react';
import { useLibrary } from '../LibraryContext';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  ListMusic,
  Music2,
} from 'lucide-react';

function Sidebar() {
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
    <aside className="sidebar">
      {/* Library Header */}
      <div className="sidebar-header">
        <div>
          <p className="sidebar-label">YOUR MUSIC</p>
          <h3>Your Library</h3>
        </div>

        <button
          className="sidebar-add-btn"
          onClick={() => setShowInput(!showInput)}
          title="Create playlist"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Create Playlist */}
      {showInput && (
        <div className="playlist-create-box">
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

      {/* Liked Songs */}
      <div
        className="sidebar-item sidebar-liked-item"
        onClick={() => navigate('/liked')}
      >
        <div className="sidebar-item-icon liked-icon">
          <Heart size={18} fill="currentColor" />
        </div>

        <div className="sidebar-item-info">
          <p>Liked Songs</p>
          <span>
            {likedSongs.length}{' '}
            {likedSongs.length === 1 ? 'song' : 'songs'}
          </span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Local Playlists */}
      {playlists.length > 0 && (
        <>
          <p className="sidebar-section-title">
            PLAYLISTS
          </p>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="sidebar-item"
              onClick={() =>
                navigate(`/playlist/local/${pl.id}`)
              }
            >
              <div className="sidebar-item-icon playlist-icon">
                <ListMusic size={18} />
              </div>

              <div className="sidebar-item-info">
                <p>{pl.name}</p>
                <span>
                  {pl.songs.length}{' '}
                  {pl.songs.length === 1
                    ? 'song'
                    : 'songs'}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Liked Online Playlists */}
      {likedPlaylists.length > 0 && (
        <>
          <p className="sidebar-section-title">
            SAVED PLAYLISTS
          </p>

          {likedPlaylists.map((pl) => {
            const imageUrl =
              pl.image?.[2]?.url ||
              pl.image?.[1]?.url ||
              pl.image?.[0]?.url;

            return (
              <div
                key={pl.id}
                className="sidebar-item"
                onClick={() =>
                  navigate(`/playlist/${pl.id}`)
                }
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={pl.name}
                    className="sidebar-playlist-img"
                  />
                ) : (
                  <div className="sidebar-item-icon playlist-icon">
                    <Music2 size={18} />
                  </div>
                )}

                <div className="sidebar-item-info">
                  <p>{pl.name}</p>
                  <span>Saved playlist</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Empty State */}
      {playlists.length === 0 &&
        likedPlaylists.length === 0 && (
          <div className="sidebar-empty">
            <Music2 size={28} />
            <p>Your playlists will appear here</p>
          </div>
        )}
    </aside>
  );
}

export default Sidebar;