import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import AddToPlaylistButton from '../components/AddToPlaylistButton';
import { Play, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

const decodeHtml = (text) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = text || '';
    return txt.value;
};

function AlbumPage() {
    const { id } = useParams();

    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { playQueue, currentSong } = usePlayer();

    const fetchAlbum = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/songs/album/${id}`
            );

            const data = response.data?.data;

            if (!data) {
                throw new Error('Invalid album response.');
            }

            setAlbum(data);
        } catch (err) {
            console.error('Failed to load album:', err);

            setAlbum(null);

            setError(
                'Unable to load this album. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError('Invalid album.');
            setLoading(false);
            return;
        }

        fetchAlbum();
    }, [id]);

    const songs = Array.isArray(album?.songs)
        ? album.songs
        : [];

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(
                songs,
                0,
                album?.name || 'Album'
            );
        }
    };

    if (loading) {
        return (
            <div
                className="loading-state"
                style={{
                    color: 'white',
                    padding: '20px',
                }}
            >
                <p>Loading album...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="error-state"
                style={{
                    color: 'white',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}
            >
                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button
                    className="retry-button"
                    onClick={fetchAlbum}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    if (!album) {
        return (
            <div
                className="empty-state"
                style={{
                    color: 'white',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}
            >
                <h2>Album not found</h2>

                <p>
                    We couldn't find this album.
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: '20px',
                color: 'white',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    marginBottom: '30px',
                }}
            >
                <div
                    style={{
                        width: '200px',
                        height: '200px',
                        flexShrink: 0,
                    }}
                >
                    {album.image?.[2]?.url ||
                    album.image?.[1]?.url ||
                    album.image?.[0]?.url ? (
                        <img
                            src={
                                album.image?.[2]?.url ||
                                album.image?.[1]?.url ||
                                album.image?.[0]?.url
                            }
                            alt={
                                album.name ||
                                'Album'
                            }
                            style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                            }}
                            onError={(e) => {
                                e.currentTarget.style.display =
                                    'none';
                            }}
                        />
                    ) : (
                        <div
                            className="image-placeholder"
                            style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                background:
                                    '#282828',
                            }}
                        >
                            🎵
                        </div>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <p
                        style={{
                            color: '#999',
                            margin: 0,
                        }}
                    >
                        Album
                    </p>

                    <h1
                        style={{
                            margin: '5px 0',
                        }}
                    >
                        {decodeHtml(
                            album.name ||
                                'Unknown album'
                        )}
                    </h1>

                    <p
                        style={{
                            color: '#999',
                        }}
                    >
                        {album.songCount ||
                            songs.length}{' '}
                        songs
                        {album.year
                            ? ` • ${album.year}`
                            : ''}
                    </p>
                </div>

                {songs.length > 0 && (
                    <button
                        className="play-all-btn"
                        onClick={handlePlayAll}
                        title="Play album"
                    >
                        <Play
                            size={22}
                            fill="black"
                        />
                    </button>
                )}
            </div>

            {songs.length === 0 ? (
                <div
                    className="empty-state"
                    style={{
                        padding: '30px 0',
                    }}
                >
                    <h2>No songs available</h2>

                    <p>
                        This album doesn't have
                        any playable songs.
                    </p>
                </div>
            ) : (
                <div className="song-list">
                    {songs.map(
                        (song, index) => {
                            if (!song?.id) {
                                return null;
                            }

                            const image =
                                song.image?.[1]
                                    ?.url ||
                                song.image?.[0]
                                    ?.url ||
                                '';

                            const artist =
                                song.artists
                                    ?.primary?.[0]
                                    ?.name ||
                                song.primaryArtists ||
                                'Unknown artist';

                            return (
                                <div
                                    key={
                                        song.id
                                    }
                                    className={`song-item ${
                                        currentSong?.id ===
                                        song.id
                                            ? 'playing'
                                            : ''
                                    }`}
                                >
                                    <div
                                        className="song-item-main"
                                        onClick={() =>
                                            playQueue(
                                                songs,
                                                index,
                                                album.name ||
                                                    'Album'
                                            )
                                        }
                                    >
                                        {image ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    song.name ||
                                                    'Song'
                                                }
                                                onError={(
                                                    e
                                                ) => {
                                                    e.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="image-placeholder"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display:
                                                        'flex',
                                                    alignItems:
                                                        'center',
                                                    justifyContent:
                                                        'center',
                                                    background:
                                                        '#282828',
                                                    borderRadius:
                                                        '4px',
                                                }}
                                            >
                                                🎵
                                            </div>
                                        )}

                                        <div>
                                            <p className="song-name">
                                                {decodeHtml(
                                                    song.name ||
                                                        'Unknown song'
                                                )}
                                            </p>

                                            <p className="song-artist">
                                                {decodeHtml(
                                                    artist
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <AddToPlaylistButton
                                        song={
                                            song
                                        }
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}

export default AlbumPage;