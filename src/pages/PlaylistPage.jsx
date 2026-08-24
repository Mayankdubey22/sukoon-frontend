import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { Play, Heart } from 'lucide-react';
import { useLibrary } from '../LibraryContext';
import { API_BASE_URL } from '../config'; // adjust path: use './config' if the file is directly in src/

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const { playQueue, currentSong } = usePlayer();
  const { toggleLikePlaylist, isPlaylistLiked } = useLibrary();
  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (playlist.songs?.length > 0) playQueue(playlist.songs, 0, playlist.name);
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/songs/playlist/${id}`)
      .then((res) => setPlaylist(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!playlist) return <p style={{ color: 'white', padding: '20px' }}>Loading...</p>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <button onClick={() => navigate(-1)} className="back-arrow-btn" style={{ marginBottom: '20px' }}>
        ←
      </button>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <img src={playlist.image?.[2]?.url} alt={playlist.name} style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
        <div style={{ flex: 1 }}>
          <p style={{ color: '#999', margin: 0 }}>Playlist</p>
          <h1 style={{ margin: '5px 0' }}>{decodeHtml(playlist.name)}</h1>
          <p style={{ color: '#999' }}>{playlist.songCount} songs</p>
        </div>
        {playlist.songs?.length > 0 && (
  <button className="play-all-btn" onClick={handlePlayAll}>
    <Play size={22} fill="black" />
  </button>
)}
<button
  className="icon-btn playlist-like-btn"
  onClick={() => toggleLikePlaylist({ id, name: playlist.name, image: playlist.image })}
>
  <Heart size={22} fill={isPlaylistLiked(id) ? '#1db954' : 'none'} />
</button>
      </div>

      <div className="song-list">
        {playlist.songs?.map((song, index) => (
          <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, cursor: 'pointer' }} onClick={() => playQueue(playlist.songs, index, playlist.name)}>
              <img src={song.image?.[1]?.url} alt={song.name} />
              <div>
                <p className="song-name">{decodeHtml(song.name)}</p>
                <p className="song-artist">{decodeHtml(song.artists?.primary?.[0]?.name || '')}</p>
              </div>
            </div>
            <AddToPlaylistButton song={song} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistPage;