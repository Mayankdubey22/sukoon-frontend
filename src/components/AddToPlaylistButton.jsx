import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Heart } from 'lucide-react';
import { useLibrary } from '../LibraryContext';

function AddToPlaylistButton({ song, openUpward = false }) {
  const { playlists, addToPlaylist, createPlaylist, toggleLike, isLiked } = useLibrary();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (playlistId) => {
    addToPlaylist(playlistId, song);
  };

  const handleCreateAndAdd = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim(), song);
    setNewName('');
    setOpen(false);
  };

  return (
    <div className="add-to-playlist-wrapper" ref={menuRef}>
      <button
        className={`icon-btn like-btn ${isLiked(song.id) ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
        title="Like"
      >
        <Heart size={18} fill={isLiked(song.id) ? '#1db954' : 'none'} />
      </button>

      <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
        <Plus size={18} />
      </button>

      {open && (
        <div className={`playlist-dropdown ${openUpward ? 'open-upward' : ''}`}>
          <p className="dropdown-title">Add to playlist</p>

          {playlists.length === 0 && <p className="dropdown-empty">No playlists yet</p>}

          {playlists.map((pl) => (
            <div key={pl.id} className="dropdown-item" onClick={() => { handleAdd(pl.id); setOpen(false); }}>
              <span>{pl.name}</span>
              {pl.songs.find((s) => s.id === song.id) && <Check size={14} />}
            </div>
          ))}

          <div className="dropdown-divider" />

          <div className="dropdown-create">
            <input
              type="text"
              placeholder="New playlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); handleCreateAndAdd(); }}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddToPlaylistButton;