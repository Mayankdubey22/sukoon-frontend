import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { Play } from 'lucide-react';
import { API_BASE_URL } from '../config'; // adjust path: use './config' if the file is directly in src/

const decodeHtml = (text) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
};

function AlbumPage() {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const { playQueue, currentSong } = usePlayer();
    const navigate = useNavigate();

    const handlePlayAll = () => {
        if (album.songs?.length > 0) playQueue(album.songs, 0, album.name);
    };

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/songs/album/${id}`)
            .then((res) => setAlbum(res.data.data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!album) return <p style={{ color: 'white', padding: '20px' }}>Loading...</p>;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                <img src={album.image?.[2]?.url} alt={album.name} style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#999', margin: 0 }}>Album</p>
                    <h1 style={{ margin: '5px 0' }}>{decodeHtml(album.name)}</h1>
                    <p style={{ color: '#999' }}>{album.songCount} songs • {album.year}</p>
                </div>
                {album.songs?.length > 0 && (
                    <button className="play-all-btn" onClick={handlePlayAll}>
                        <Play size={22} fill="black" />
                    </button>
                )}
            </div>

            <div className="song-list">
                {album.songs?.map((song, index) => (
                    <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
                        <div className="song-item-main" onClick={() => playQueue(album.songs, index, album.name)}>
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

export default AlbumPage;