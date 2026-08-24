import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../LibraryContext';
import { usePlayer } from '../PlayerContext';
import { Trash2, Trash, Play } from 'lucide-react';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function LocalPlaylistPage() {
  const { id } = useParams();
  const { playlists, removeFromPlaylist, deletePlaylist } = useLibrary();
  const { playQueue, currentSong } = usePlayer();
  const navigate = useNavigate();

  const playlist = playlists.find((pl) => pl.id === id);

  if (!playlist) return <p style={{ color: 'white', padding: '20px' }}>Playlist not found</p>;

  const handleDeletePlaylist = () => {
    if (window.confirm(`Delete playlist "${playlist.name}"? This cannot be undone.`)) {
      deletePlaylist(playlist.id);
      navigate('/');
    }
  };

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) playQueue(playlist.songs, 0, playlist.name);
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <button onClick={() => navigate(-1)} className="back-arrow-btn" style={{ marginBottom: '20px' }}>
        ←
      </button>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <div className="playlist-icon-large">🎵</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#999', margin: 0 }}>Playlist</p>
          <h1 style={{ margin: '5px 0' }}>{playlist.name}</h1>
          <p style={{ color: '#999' }}>{playlist.songs.length} songs</p>
        </div>
        {playlist.songs.length > 0 && (
          <button className="play-all-btn" onClick={handlePlayAll}>
            <Play size={22} fill="black" />
          </button>
        )}
        <button className="delete-playlist-page-btn" onClick={handleDeletePlaylist}>
          <Trash size={18} /> Delete Playlist
        </button>
      </div>

      {playlist.songs.length === 0 && (
        <p style={{ color: '#666' }}>No songs yet. Add songs using the + button next to any track.</p>
      )}

      <div className="song-list">
        {playlist.songs.map((song, index) => (
          <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, cursor: 'pointer' }} onClick={() => playQueue(playlist.songs, index, playlist.name)}>
              <img src={song.image?.[1]?.url} alt={song.name || song.title} />
              <div>
                <p className="song-name">{decodeHtml(song.name || song.title)}</p>
                <p className="song-artist">{decodeHtml(song.artists?.primary?.[0]?.name || song.primaryArtists || '')}</p>
              </div>
            </div>
            <button
              className="icon-btn"
              onClick={() => {
                if (window.confirm(`Remove "${decodeHtml(song.name || song.title)}" from "${playlist.name}"?`)) {
                  removeFromPlaylist(playlist.id, song.id);
                }
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocalPlaylistPage;