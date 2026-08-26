import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import Carousel from '../components/Carousel';
import { Play, RefreshCw } from 'lucide-react';
import { SkeletonRow } from '../components/SkeletonCard';
import { API_BASE_URL } from '../config';

const decodeHtml = (text) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = text || '';
    return txt.value;
};

function HomePage() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { playSong } = usePlayer();

    const fetchHome = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/songs/home`
            );

            const data = response.data?.data;

            if (!Array.isArray(data)) {
                throw new Error(
                    'Invalid home response from server.'
                );
            }

            setSections(data);
        } catch (err) {
            console.error(
                'Failed to load home:',
                err
            );

            setSections([]);

            setError(
                'Unable to load the home page. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHome();
    }, []);

    if (loading) {
        return (
            <div>
                {[
                    'Trending Now',
                    'Bollywood Hits',
                    'Arijit Singh',
                ].map((title) => (
                    <div
                        className="section"
                        key={title}
                    >
                        <h2>{title}</h2>
                        <SkeletonRow />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button
                    className="retry-button"
                    onClick={fetchHome}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    if (sections.length === 0) {
        return (
            <div className="empty-state">
                <h2>No music available</h2>

                <p>
                    We couldn't find any music
                    right now.
                </p>

                <button
                    className="retry-button"
                    onClick={fetchHome}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            {sections.map((section) => {
                const songs = Array.isArray(
                    section?.songs
                )
                    ? section.songs
                    : [];

                if (songs.length === 0) {
                    return null;
                }

                return (
                    <div
                        className="section"
                        key={section.title}
                    >
                        <h2>
                            {decodeHtml(
                                section.title ||
                                    'Music'
                            )}
                        </h2>

                        <Carousel
                            items={songs}
                            renderItem={(song) => {
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
                                    song
                                        .artists
                                        ?.primary?.[0]
                                        ?.name ||
                                    song.primaryArtists ||
                                    'Unknown artist';

                                return (
                                    <div
                                        key={song.id}
                                        className="album-card"
                                        onClick={() =>
                                            playSong(
                                                song
                                            )
                                        }
                                    >
                                        <div className="card-image-wrapper">
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
                                                <div className="image-placeholder">
                                                    🎵
                                                </div>
                                            )}

                                            <div className="play-overlay">
                                                <Play
                                                    size={
                                                        20
                                                    }
                                                    fill="black"
                                                />
                                            </div>
                                        </div>

                                        <p className="card-title">
                                            {decodeHtml(
                                                song.name ||
                                                    'Unknown song'
                                            )}
                                        </p>

                                        <p className="card-subtitle">
                                            {decodeHtml(
                                                artist
                                            )}
                                        </p>
                                    </div>
                                );
                            }}
                        />
                    </div>
                );
            })}

            <footer className="app-footer">
                <p>
                    🎵 Sukoon — Made for
                    personal use
                </p>
            </footer>
        </div>
    );
}

export default HomePage;