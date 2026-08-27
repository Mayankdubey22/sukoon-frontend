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

function ArtistPage() {
    const { id } = useParams();

    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { playQueue, currentSong } = usePlayer();

    const fetchArtist = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/songs/artist/${id}`
            );

            const data = response.data?.data;

            if (!data) {
                throw new Error('Invalid artist response.');
            }

            setArtist(data);
        } catch (err) {
            console.error('Failed to load artist:', err);

            setArtist(null);
            setError(
                'Unable to load this artist. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError('Invalid artist.');
            setLoading(false);
            return;
        }

        fetchArtist();
    }, [id]);

    const songs = Array.isArray(artist?.topSongs)
        ? artist.topSongs
        : [];

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(
                songs,
                0,
                artist?.name || 'Artist'
            );
        }
    };

    const artistImage =
        artist?.image?.[2]?.url ||
        artist?.image?.[1]?.url ||
        artist?.image?.[0]?.url ||
        '';

    if (loading) {
        return (
            <div
                className="loading-state"
                style={{
                    color: 'white',
                    padding: '20px',
                }}
            >
                <p>Loading artist...</p>
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
                    onClick={fetchArtist}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    if (!artist) {
        return (
            <div
                className="empty-state"
                style={{
                    color: 'white',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}
            >
                <h2>Artist not found</h2>

                <p>
                    We couldn't find this artist.
                </p>
            </div>
        );
    }

    const followers =
        artist.followerCount ??
        artist.followers ??
        null;

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
                {artistImage ? (
                    <img
                        src={artistImage}
                        alt={artist.name || 'Artist'}
                        style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0,
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
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '50px',
                            background: '#282828',
                            flexShrink: 0,
                        }}
                    >
                        🎤
                    </div>
                )}

                <div style={{ flex: 1 }}>
                    <p
                        style={{
                            color: '#999',
                            margin: 0,
                        }}
                    >
                        Artist
                    </p>

                    <h1
                        style={{
                            margin: '5px 0',
                        }}
                    >
                        {decodeHtml(
                            artist.name ||
                                'Unknown artist'
                        )}
                    </h1>

                    {followers !== null && (
                        <p
                            style={{
                                color: '#999',
                            }}
                        >
                            {Number(
                                followers
                            ).toLocaleString()}{' '}
                            followers
                        </p>
                    )}
                </div>

                {songs.length > 0 && (
                    <button
                        className="play-all-btn"
                        onClick={handlePlayAll}
                        title="Play top songs"
                    >
                        <Play
                            size={22}
                            fill="black"
                        />
                    </button>
                )}
            </div>

            <h2>Top Songs</h2>

            {songs.length === 0 ? (
                <div
                    className="empty-state"
                    style={{
                        padding: '30px 0',
                    }}
                >
                    <h3>No songs available</h3>

                    <p>
                        We couldn't find any songs
                        for this artist right now.
                    </p>
                </div>
            ) : (
                <div className="song-list">
                    {songs.map((song, index) => {
                        if (!song?.id) {
                            return null;
                        }

                        const songImage =
                            song.image?.[1]?.url ||
                            song.image?.[0]?.url ||
                            '';

                        const songArtist =
                            song.artists?.primary?.[0]
                                ?.name ||
                            song.primaryArtists ||
                            artist.name ||
                            'Unknown artist';

                        return (
                            <div
                                key={song.id}
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
                                            artist.name ||
                                                'Artist'
                                        )
                                    }
                                >
                                    {songImage ? (
                                        <img
                                            src={
                                                songImage
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
                                                width:
                                                    '50px',
                                                height:
                                                    '50px',
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
                                                flexShrink: 0,
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
                                                songArtist
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <AddToPlaylistButton
                                    song={song}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ArtistPage;