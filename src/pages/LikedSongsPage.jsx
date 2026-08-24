import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../LibraryContext';
import { usePlayer } from '../PlayerContext';
import { Trash2, Play } from 'lucide-react';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function LikedSongsPage() {
  const { likedSongs, toggleLike } = useLibrary();
  const { playQueue, currentSong } = usePlayer();
  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) playQueue(likedSongs, 0, 'Liked Songs');
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <button onClick={() => navigate(-1)} className="back-arrow-btn" style={{ marginBottom: '20px' }}>
        ←
      </button>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <div className="liked-icon-large">♥</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#999', margin: 0 }}>Playlist</p>
          <h1 style={{ margin: '5px 0' }}>Liked Songs</h1>
          <p style={{ color: '#999' }}>{likedSongs.length} songs</p>
        </div>
        {likedSongs.length > 0 && (
          <button className="play-all-btn" onClick={handlePlayAll}>
            <Play size={22} fill="black" />
          </button>
        )}
      </div>

      {likedSongs.length === 0 && (
        <p style={{ color: '#666' }}>No liked songs yet. Tap the ♡ icon next to any song to like it.</p>
      )}

      <div className="song-list">
        {likedSongs.map((song, index) => (
          <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
            <div className="song-item-main" onClick={() => playQueue(likedSongs, index, 'Liked Songs')}>
              <img src={song.image?.[1]?.url} alt={song.name || song.title} />
              <div>
                <p className="song-name">{decodeHtml(song.name || song.title)}</p>
                <p className="song-artist">{decodeHtml(song.artists?.primary?.[0]?.name || song.primaryArtists || '')}</p>
              </div>
            </div>
            <button
              className="icon-btn"
              onClick={() => {
                if (window.confirm(`Remove "${decodeHtml(song.name || song.title)}" from Liked Songs?`)) {
                  toggleLike(song);
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

export default LikedSongsPage;