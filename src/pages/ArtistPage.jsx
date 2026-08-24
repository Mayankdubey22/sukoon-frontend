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

function ArtistPage() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const { playQueue, currentSong } = usePlayer();
    const navigate = useNavigate();

    const handlePlayAll = () => {
        if (artist.topSongs?.length > 0) playQueue(artist.topSongs, 0, artist.name);
    };

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/songs/artist/${id}`)
            .then((res) => setArtist(res.data.data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!artist) return <p style={{ color: 'white', padding: '20px' }}>Loading...</p>;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                <img src={artist.image?.[2]?.url} alt={artist.name} style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#999', margin: 0 }}>Artist</p>
                    <h1 style={{ margin: '5px 0' }}>{decodeHtml(artist.name)}</h1>
                    <p style={{ color: '#999' }}>{artist.followerCount?.toLocaleString()} followers</p>
                </div>
                {artist.topSongs?.length > 0 && (
                    <button className="play-all-btn" onClick={handlePlayAll}>
                        <Play size={22} fill="black" />
                    </button>
                )}
            </div>

            <h2>Top Songs</h2>
            <div className="song-list">
                {artist.topSongs?.map((song, index) => (
                    <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
                        <div className="song-item-main" onClick={() => playQueue(artist.topSongs, index, artist.name)}>
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

export default ArtistPage;