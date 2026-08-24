import React, { useState } from 'react';
import { useLibrary } from '../LibraryContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, ListMusic, Trash2 } from 'lucide-react';

function Sidebar() {
    const { likedSongs, playlists, likedPlaylists, createPlaylist } = useLibrary();
    const navigate = useNavigate();
    const [showInput, setShowInput] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const handleCreate = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setShowInput(false);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Your Library</h3>
                <button className="icon-btn" onClick={() => setShowInput(!showInput)}>
                    <Plus size={20} />
                </button>
            </div>

            {showInput && (
                <div className="playlist-create-box">
                    <input
                        type="text"
                        placeholder="Playlist name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <button onClick={handleCreate}>Create</button>
                </div>
            )}

            <div className="sidebar-item" onClick={() => navigate('/liked')}>
                <div className="liked-icon"><Heart size={16} fill="white" /></div>
                <p>Liked Songs</p>
                <span className="sidebar-count">{likedSongs.length}</span>
            </div>

            <div className="sidebar-divider" />

            {playlists.map((pl) => (
                <div key={pl.id} className="sidebar-item" onClick={() => navigate(`/playlist/local/${pl.id}`)}>
                    <div className="playlist-icon"><ListMusic size={16} /></div>
                    <p>{pl.name}</p>
                    <span className="sidebar-count">{pl.songs.length}</span>
                </div>
            ))}
            {likedPlaylists.map((pl) => (
                <div key={pl.id} className="sidebar-item" onClick={() => navigate(`/playlist/${pl.id}`)}>
                    <img src={pl.image?.[0]?.url} alt={pl.name} className="sidebar-playlist-img" />
                    <p>{pl.name}</p>
                </div>
            ))}
        </div>
    );
}

export default Sidebar;